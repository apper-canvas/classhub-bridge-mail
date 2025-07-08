import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Students from "@/components/pages/Students";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import StatCard from "@/components/molecules/StatCard";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { assignmentService } from "@/services/api/assignmentService";
import { studentService } from "@/services/api/studentService";

const Reports = () => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState('overview')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ])
      setStudents(studentsData)
      setGrades(gradesData)
      setAttendance(attendanceData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const calculateOverviewStats = () => {
    const activeStudents = students.filter(s => s.status === 'Active').length
    const totalAssignments = assignments.length
    
    // Grade statistics
    const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0)
    const averageGrade = grades.length > 0 ? (totalGrades / grades.length).toFixed(1) : 0
    
    // Attendance statistics
    const presentCount = attendance.filter(a => a.status === 'Present').length
    const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0
    
// Grade distribution
    const gradeDistribution = grades.reduce((dist, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignment_id)
      if (assignment) {
        const percentage = (grade.score / assignment.total_points) * 100
        if (percentage >= 90) dist.A++
        else if (percentage >= 80) dist.B++
        else if (percentage >= 70) dist.C++
        else if (percentage >= 60) dist.D++
        else dist.F++
      }
      return dist
    }, { A: 0, B: 0, C: 0, D: 0, F: 0 })

    return {
      activeStudents,
      totalAssignments,
      averageGrade,
      attendanceRate,
      gradeDistribution
    }
  }

  const getStudentPerformance = () => {
    return students.map(student => {
const studentGrades = grades.filter(g => g.student_id === student.Id)
const studentAttendance = attendance.filter(a => a.student_id === student.Id)
      
      // Calculate GPA
      const totalPoints = studentGrades.reduce((sum, grade) => {
const assignment = assignments.find(a => a.Id === grade.assignment_id)
return sum + (assignment ? assignment.total_points : 0)
      }, 0)
      const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0)
      const gpa = totalPoints > 0 ? ((totalScore / totalPoints) * 100).toFixed(1) : 0
      
      // Calculate attendance rate
      const presentCount = studentAttendance.filter(a => a.status === 'Present').length
      const attendanceRate = studentAttendance.length > 0 ? ((presentCount / studentAttendance.length) * 100).toFixed(1) : 0
      
      return {
        ...student,
        gpa: parseFloat(gpa),
        attendanceRate: parseFloat(attendanceRate),
        totalGrades: studentGrades.length,
        totalAttendance: studentAttendance.length
      }
    }).sort((a, b) => b.gpa - a.gpa)
  }

  const getAssignmentAnalysis = () => {
    return assignments.map(assignment => {
const assignmentGrades = grades.filter(g => g.assignment_id === assignment.Id)
      const totalScore = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0)
      const averageScore = assignmentGrades.length > 0 ? (totalScore / assignmentGrades.length).toFixed(1) : 0
const averagePercentage = assignmentGrades.length > 0 ? ((totalScore / (assignmentGrades.length * assignment.total_points)) * 100).toFixed(1) : 0
      
      return {
        ...assignment,
        submissionCount: assignmentGrades.length,
        averageScore: parseFloat(averageScore),
        averagePercentage: parseFloat(averagePercentage),
        highestScore: assignmentGrades.length > 0 ? Math.max(...assignmentGrades.map(g => g.score)) : 0,
        lowestScore: assignmentGrades.length > 0 ? Math.min(...assignmentGrades.map(g => g.score)) : 0
      }
    }).sort((a, b) => b.averagePercentage - a.averagePercentage)
  }

  const exportData = (type) => {
    // Simple CSV export functionality
    let csvContent = ''
    let filename = ''
    
    if (type === 'students') {
      const studentData = getStudentPerformance()
      csvContent = 'Name,Grade,GPA,Attendance Rate,Total Grades,Status\n'
      studentData.forEach(student => {
csvContent += `"${student.first_name} ${student.last_name}","${student.grade}","${student.gpa}%","${student.attendanceRate}%","${student.totalGrades}","${student.status}"\n`
      })
      filename = 'student_performance_report.csv'
    } else if (type === 'assignments') {
      const assignmentData = getAssignmentAnalysis()
      csvContent = 'Assignment,Category,Total Points,Average Score,Average Percentage,Submissions\n'
assignmentData.forEach(assignment => {
csvContent += `"${assignment.title}","${assignment.category}","${assignment.total_points}","${assignment.averageScore}","${assignment.averagePercentage}%","${assignment.submissionCount}"\n`
      })
      filename = 'assignment_analysis_report.csv'
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  const stats = calculateOverviewStats()
  const studentPerformance = getStudentPerformance()
  const assignmentAnalysis = getAssignmentAnalysis()

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'students', label: 'Student Performance', icon: 'Users' },
    { id: 'assignments', label: 'Assignment Analysis', icon: 'BookOpen' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Analyze classroom performance and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportData('students')}
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Students
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData('assignments')}
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Assignments
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {reportTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                selectedReport === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Students"
              value={stats.activeStudents}
              icon="Users"
              variant="gradient"
            />
            <StatCard
              title="Total Assignments"
              value={stats.totalAssignments}
              icon="BookOpen"
              variant="success"
            />
            <StatCard
              title="Class Average"
              value={`${stats.averageGrade}%`}
              icon="TrendingUp"
              variant="accent"
            />
            <StatCard
              title="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              icon="Calendar"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Grade Distribution</h3>
                <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${
                        grade === 'A' ? 'bg-success' :
                        grade === 'B' ? 'bg-info' :
                        grade === 'C' ? 'bg-warning' :
                        grade === 'D' ? 'bg-error' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="font-medium">{grade}</span>
                    </div>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Performers</h3>
                <ApperIcon name="Award" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {studentPerformance.slice(0, 5).map((student, index) => (
                  <div key={student.Id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
{student.first_name[0]}{student.last_name[0]}
                        </span>
                      </div>
                      <div>
<p className="font-medium">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                      </div>
                    </div>
                    <Badge variant="success">{student.gpa}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedReport === 'students' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Student Performance Report</h3>
            <Badge variant="info">{studentPerformance.length} students</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Grades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPerformance.map((student, index) => (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
<td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {student.first_name[0]}{student.last_name[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{student.grade}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        student.gpa >= 90 ? 'success' :
                        student.gpa >= 80 ? 'info' :
                        student.gpa >= 70 ? 'warning' :
                        'error'
                      }>
                        {student.gpa}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        student.attendanceRate >= 95 ? 'success' :
                        student.attendanceRate >= 90 ? 'info' :
                        student.attendanceRate >= 80 ? 'warning' :
                        'error'
                      }>
                        {student.attendanceRate}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalGrades}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        student.status === 'Active' ? 'success' :
                        student.status === 'Inactive' ? 'warning' :
                        'secondary'
                      }>
                        {student.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === 'assignments' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Assignment Analysis Report</h3>
            <Badge variant="info">{assignmentAnalysis.length} assignments</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignmentAnalysis.map((assignment, index) => (
                  <motion.tr
                    key={assignment.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.title}
                      </div>
                      <div className="text-sm text-gray-500">
Due: {assignment.due_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{assignment.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{assignment.total_points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.averageScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        assignment.averagePercentage >= 90 ? 'success' :
                        assignment.averagePercentage >= 80 ? 'info' :
                        assignment.averagePercentage >= 70 ? 'warning' :
                        'error'
                      }>
                        {assignment.averagePercentage}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.submissionCount}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Reports