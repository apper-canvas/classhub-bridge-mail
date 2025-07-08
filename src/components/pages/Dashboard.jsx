import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { studentService } from '@/services/api/studentService'
import { gradeService } from '@/services/api/gradeService'
import { attendanceService } from '@/services/api/attendanceService'
import { assignmentService } from '@/services/api/assignmentService'

const Dashboard = () => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
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
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const calculateStats = () => {
    const activeStudents = students.filter(s => s.status === 'Active').length
    const totalAssignments = assignments.length
    
    // Calculate average grade
    const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0)
    const averageGrade = grades.length > 0 ? (totalGrades / grades.length).toFixed(1) : 0
    
    // Calculate attendance rate
    const presentCount = attendance.filter(a => a.status === 'Present').length
    const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0

    return {
      activeStudents,
      totalAssignments,
      averageGrade,
      attendanceRate
    }
  }

  const getRecentActivity = () => {
    // Get recent grades (last 5)
const recentGrades = grades
      .sort((a, b) => new Date(b.submitted_date) - new Date(a.submitted_date))
      .slice(0, 5)
      .map(grade => {
        const student = students.find(s => s.Id === grade.student_id)
        const assignment = assignments.find(a => a.Id === grade.assignment_id)
        return {
          id: grade.Id,
          type: 'grade',
          message: `${student?.first_name} ${student?.last_name} scored ${grade.score} on ${assignment?.title}`,
          time: grade.submitted_date,
          score: grade.score
        }
      })

    return recentGrades
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = calculateStats()
  const recentActivity = getRecentActivity()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your classroom</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
            <div className="text-sm text-gray-600">Academic Year</div>
            <div className="font-semibold">2024-2025</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="Users"
          trend="up"
          trendValue="+2 this month"
          variant="gradient"
        />
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon="BookOpen"
          trend="up"
          trendValue="+3 this week"
          variant="success"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="TrendingUp"
          trend="up"
          trendValue="+2.5% from last month"
          variant="accent"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          trend="up"
          trendValue="+1.2% this week"
        />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-display">Recent Activity</h2>
            <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="Award" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.score >= 90 ? 'bg-success text-white' :
                    activity.score >= 80 ? 'bg-info text-white' :
                    activity.score >= 70 ? 'bg-warning text-white' :
                    'bg-error text-white'
                  }`}>
                    {activity.score}%
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-display">Quick Actions</h2>
            <ApperIcon name="Zap" className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-primary rounded-lg text-white cursor-pointer"
            >
              <ApperIcon name="UserPlus" className="w-6 h-6 mb-2" />
              <p className="font-medium">Add Student</p>
              <p className="text-sm opacity-80">Enroll new student</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-success rounded-lg text-white cursor-pointer"
            >
              <ApperIcon name="PlusCircle" className="w-6 h-6 mb-2" />
              <p className="font-medium">New Assignment</p>
              <p className="text-sm opacity-80">Create assignment</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-accent rounded-lg text-white cursor-pointer"
            >
              <ApperIcon name="ClipboardCheck" className="w-6 h-6 mb-2" />
              <p className="font-medium">Take Attendance</p>
              <p className="text-sm opacity-80">Mark today's attendance</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-secondary to-primary rounded-lg text-white cursor-pointer"
            >
              <ApperIcon name="BarChart" className="w-6 h-6 mb-2" />
              <p className="font-medium">View Reports</p>
              <p className="text-sm opacity-80">Generate reports</p>
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard