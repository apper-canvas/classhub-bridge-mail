import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import StudentForm from '@/components/organisms/StudentForm'
import { studentService } from '@/services/api/studentService'
import { format } from 'date-fns'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await studentService.getAll()
      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(term.toLowerCase()) ||
      student.lastName.toLowerCase().includes(term.toLowerCase()) ||
      student.email.toLowerCase().includes(term.toLowerCase()) ||
      student.grade.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredStudents(filtered)
  }

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setIsModalOpen(true)
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(studentId)
        toast.success('Student deleted successfully!')
        await loadStudents()
      } catch (error) {
        toast.error('Failed to delete student')
      }
    }
  }

  const handleFormSuccess = () => {
    loadStudents()
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success'
      case 'Inactive': return 'warning'
      case 'Graduated': return 'info'
      case 'Transferred': return 'secondary'
      default: return 'default'
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadStudents} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student roster</p>
        </div>
        <Button onClick={handleAddStudent} className="shrink-0">
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-card">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
              <p className="text-sm text-gray-600">{filteredStudents.length} students</p>
            </div>
            <div className="w-full sm:w-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search students..."
                className="w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <Empty
              title="No students found"
              description={searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first student."}
              icon="Users"
              actionText="Add Student"
              onAction={handleAddStudent}
            />
          ) : (
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
                    Student Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
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
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.Id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{student.grade}</Badge>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.parent1Name || 'Not provided'}</div>
                      <div className="text-sm text-gray-500">{student.parent1Phone || student.parent1Email || 'No contact info'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(student.status)}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(student.enrollmentDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.Id)}
                          className="text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  )
}

export default Students