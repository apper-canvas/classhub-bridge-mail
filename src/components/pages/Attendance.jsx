import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { studentService } from '@/services/api/studentService'
import { attendanceService } from '@/services/api/attendanceService'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from 'date-fns'

const Attendance = () => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [todayAttendance, setTodayAttendance] = useState({})

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ])
      setStudents(studentsData.filter(s => s.status === 'Active'))
      setAttendance(attendanceData)
    } catch (err) {
      setError('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Initialize today's attendance
    const today = format(selectedDate, 'yyyy-MM-dd')
    const todayRecords = attendance.filter(a => a.date === today)
    const todayData = {}
    todayRecords.forEach(record => {
      todayData[record.studentId] = record.status
    })
    setTodayAttendance(todayData)
  }, [selectedDate, attendance])

  const getAttendanceForStudent = (studentId, date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return attendance.find(a => a.studentId === studentId && a.date === dateString)
  }

  const getAttendanceStats = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId)
    const present = studentAttendance.filter(a => a.status === 'Present').length
    const total = studentAttendance.length
    return {
      present,
      total,
      rate: total > 0 ? ((present / total) * 100).toFixed(1) : 0
    }
  }

  const handleAttendanceChange = (studentId, status) => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSaveAttendance = async () => {
    try {
      const today = format(selectedDate, 'yyyy-MM-dd')
      const promises = []

      for (const [studentId, status] of Object.entries(todayAttendance)) {
        const existingRecord = attendance.find(a => 
          a.studentId === parseInt(studentId) && a.date === today
        )

        const attendanceData = {
          studentId: parseInt(studentId),
          date: today,
          status,
          notes: ''
        }

        if (existingRecord) {
          promises.push(attendanceService.update(existingRecord.Id, attendanceData))
        } else {
          promises.push(attendanceService.create(attendanceData))
        }
      }

      await Promise.all(promises)
      toast.success('Attendance saved successfully!')
      await loadData()
    } catch (error) {
      toast.error('Failed to save attendance')
    }
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end }).filter(day => !isWeekend(day))
  }

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
    { value: 'Late', label: 'Late' },
    { value: 'Excused', label: 'Excused' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'attendance-present text-white'
      case 'Absent': return 'attendance-absent text-white'
      case 'Late': return 'attendance-late text-white'
      case 'Excused': return 'attendance-excused text-white'
      default: return 'bg-gray-200 text-gray-600'
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  if (students.length === 0) {
    return (
      <Empty
        title="No active students"
        description="You need to have active students to take attendance."
        icon="Calendar"
        actionText="Go to Students"
        onAction={() => window.location.href = '/students'}
      />
    )
  }

  const monthDays = getDaysInMonth()
  const hasUnsavedChanges = Object.keys(todayAttendance).length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily student attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {hasUnsavedChanges && (
            <Button onClick={handleSaveAttendance}>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Attendance
            </Button>
          )}
        </div>
      </div>

      {/* Daily Attendance */}
      <div className="bg-white rounded-lg shadow-card">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Daily Attendance - {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <p className="text-sm text-gray-600">{students.length} students</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student, index) => {
              const existingRecord = getAttendanceForStudent(student.Id, selectedDate)
              const currentStatus = todayAttendance[student.Id] || existingRecord?.status || ''
              
              return (
                <motion.div
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{student.grade}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.slice(1).map(option => (
                      <Button
                        key={option.value}
                        variant={currentStatus === option.value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.Id, option.value)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-white rounded-lg shadow-card">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Overview - {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                  Student
                </th>
                {monthDays.map(day => (
                  <th key={day.toISOString()} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]">
                    {format(day, 'd')}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const stats = getAttendanceStats(student.Id)
                
                return (
                  <tr key={student.Id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white border-r">
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
                        </div>
                      </div>
                    </td>
                    {monthDays.map(day => {
                      const record = getAttendanceForStudent(student.Id, day)
                      const isToday = isSameDay(day, new Date())
                      
                      return (
                        <td key={day.toISOString()} className="px-2 py-4 text-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            record ? getStatusColor(record.status) : 'bg-gray-100'
                          } ${isToday ? 'ring-2 ring-primary' : ''}`}>
                            {record?.status ? record.status[0] : ''}
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-4 py-4 text-center">
                      <Badge variant={stats.rate >= 90 ? 'success' : stats.rate >= 80 ? 'warning' : 'error'}>
                        {stats.rate}%
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Attendance