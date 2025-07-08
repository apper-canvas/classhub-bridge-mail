import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import AssignmentForm from '@/components/organisms/AssignmentForm'
import { studentService } from '@/services/api/studentService'
import { assignmentService } from '@/services/api/assignmentService'
import { gradeService } from '@/services/api/gradeService'

const Grades = () => {
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [gradeInputs, setGradeInputs] = useState({})

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ])
      setStudents(studentsData.filter(s => s.status === 'Active'))
      setAssignments(assignmentsData)
      setGrades(gradesData)
    } catch (err) {
      setError('Failed to load grade data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId)
  }

  const getGradeColor = (score, totalPoints) => {
    if (!score || !totalPoints) return 'bg-gray-100 text-gray-600'
    const percentage = (score / totalPoints) * 100
    if (percentage >= 90) return 'grade-a text-white'
    if (percentage >= 80) return 'grade-b text-white'
    if (percentage >= 70) return 'grade-c text-white'
    if (percentage >= 60) return 'grade-d text-white'
    return 'grade-f text-white'
  }

  const getGradeLetter = (score, totalPoints) => {
    if (!score || !totalPoints) return '-'
    const percentage = (score / totalPoints) * 100
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const handleGradeInput = (studentId, assignmentId, value) => {
    const key = `${studentId}-${assignmentId}`
    setGradeInputs(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleGradeSubmit = async (studentId, assignmentId) => {
    const key = `${studentId}-${assignmentId}`
    const score = parseFloat(gradeInputs[key])
    const assignment = assignments.find(a => a.Id === assignmentId)
    
    if (isNaN(score) || score < 0 || score > assignment.totalPoints) {
      toast.error(`Score must be between 0 and ${assignment.totalPoints}`)
      return
    }

    try {
      const existingGrade = getGradeForStudent(studentId, assignmentId)
      const gradeData = {
        studentId,
        assignmentId,
        score,
        submittedDate: new Date().toISOString().split('T')[0],
        comments: ''
      }

      if (existingGrade) {
        await gradeService.update(existingGrade.Id, gradeData)
        toast.success('Grade updated successfully!')
      } else {
        await gradeService.create(gradeData)
        toast.success('Grade added successfully!')
      }

      // Clear input
      setGradeInputs(prev => ({
        ...prev,
        [key]: ''
      }))

      await loadData()
    } catch (error) {
      toast.error('Failed to save grade')
    }
  }

  const handleAddAssignment = () => {
    setSelectedAssignment(null)
    setIsModalOpen(true)
  }

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? All grades for this assignment will be lost.')) {
      try {
        // Delete all grades for this assignment first
        const assignmentGrades = grades.filter(g => g.assignmentId === assignmentId)
        await Promise.all(assignmentGrades.map(grade => gradeService.delete(grade.Id)))
        
        // Then delete the assignment
        await assignmentService.delete(assignmentId)
        toast.success('Assignment deleted successfully!')
        await loadData()
      } catch (error) {
        toast.error('Failed to delete assignment')
      }
    }
  }

  const handleFormSuccess = () => {
    loadData()
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">Manage assignments and track student performance</p>
        </div>
        <Button onClick={handleAddAssignment} className="shrink-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Empty
          title="No assignments found"
          description="Create your first assignment to start tracking student grades."
          icon="BookOpen"
          actionText="Add Assignment"
          onAction={handleAddAssignment}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Grade Book</h2>
            <p className="text-sm text-gray-600">{students.length} students • {assignments.length} assignments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Student
                  </th>
                  {assignments.map(assignment => (
                    <th key={assignment.Id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <span className="truncate">{assignment.title}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditAssignment(assignment)}
                              className="text-gray-400 hover:text-primary"
                            >
                              <ApperIcon name="Edit2" className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(assignment.Id)}
                              className="text-gray-400 hover:text-error"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {assignment.totalPoints} pts
                        </div>
                        <Badge variant="info" size="sm">
                          {assignment.category}
                        </Badge>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => {
                  const studentGrades = grades.filter(g => g.studentId === student.Id)
                  const totalPoints = studentGrades.reduce((sum, grade) => {
                    const assignment = assignments.find(a => a.Id === grade.assignmentId)
                    return sum + (assignment ? assignment.totalPoints : 0)
                  }, 0)
                  const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0)
                  const average = totalPoints > 0 ? ((totalScore / totalPoints) * 100).toFixed(1) : 0

                  return (
                    <motion.tr
                      key={student.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.grade}
                            </div>
                          </div>
                        </div>
                      </td>
                      {assignments.map(assignment => {
                        const grade = getGradeForStudent(student.Id, assignment.Id)
                        const key = `${student.Id}-${assignment.Id}`
                        return (
                          <td key={assignment.Id} className="px-4 py-4 text-center">
                            {grade ? (
                              <div className="space-y-1">
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  getGradeColor(grade.score, assignment.totalPoints)
                                }`}>
                                  {grade.score}/{assignment.totalPoints}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getGradeLetter(grade.score, assignment.totalPoints)}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  placeholder="Score"
                                  value={gradeInputs[key] || ''}
                                  onChange={(e) => handleGradeInput(student.Id, assignment.Id, e.target.value)}
                                  className="w-20 h-8 text-center text-xs"
                                  min="0"
                                  max={assignment.totalPoints}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleGradeSubmit(student.Id, assignment.Id)}
                                  className="text-xs p-1 h-6"
                                >
                                  <ApperIcon name="Check" className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-4 py-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          average >= 90 ? 'grade-a text-white' :
                          average >= 80 ? 'grade-b text-white' :
                          average >= 70 ? 'grade-c text-white' :
                          average >= 60 ? 'grade-d text-white' :
                          'grade-f text-white'
                        }`}>
                          {average}%
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        size="lg"
      >
        <AssignmentForm
          assignment={selectedAssignment}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  )
}

export default Grades