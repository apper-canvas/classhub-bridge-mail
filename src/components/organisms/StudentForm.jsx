import { useState } from 'react'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import { studentService } from '@/services/api/studentService'

const StudentForm = ({ student = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    grade: student?.grade || '',
    email: student?.email || '',
    phone: student?.phone || '',
    status: student?.status || 'Active',
    parent1Name: student?.parent1Name || '',
    parent1Phone: student?.parent1Phone || '',
    parent1Email: student?.parent1Email || '',
    parent2Name: student?.parent2Name || '',
    parent2Phone: student?.parent2Phone || '',
    parent2Email: student?.parent2Email || '',
  })
  const [loading, setLoading] = useState(false)

  const gradeOptions = [
    { value: '', label: 'Select Grade' },
    { value: '9th', label: '9th Grade' },
    { value: '10th', label: '10th Grade' },
    { value: '11th', label: '11th Grade' },
    { value: '12th', label: '12th Grade' },
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Graduated', label: 'Graduated' },
    { value: 'Transferred', label: 'Transferred' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (student) {
        await studentService.update(student.Id, formData)
        toast.success('Student updated successfully!')
      } else {
        await studentService.create(formData)
        toast.success('Student created successfully!')
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to save student')
    } finally {
      setLoading(false)
    }
  }

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              options={gradeOptions}
              required
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-4"
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-4"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Contact Information</h3>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">Primary Parent/Guardian</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Parent Name"
                name="parent1Name"
                value={formData.parent1Name}
                onChange={handleChange}
                placeholder="Full name"
              />
              <Input
                label="Phone Number"
                name="parent1Phone"
                type="tel"
                value={formData.parent1Phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
              <Input
                label="Email Address"
                name="parent1Email"
                type="email"
                value={formData.parent1Email}
                onChange={handleChange}
                placeholder="parent@email.com"
              />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="text-md font-medium text-gray-700">Secondary Parent/Guardian (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Parent Name"
                name="parent2Name"
                value={formData.parent2Name}
                onChange={handleChange}
                placeholder="Full name"
              />
              <Input
                label="Phone Number"
                name="parent2Phone"
                type="tel"
                value={formData.parent2Phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
              <Input
                label="Email Address"
                name="parent2Email"
                type="email"
                value={formData.parent2Email}
                onChange={handleChange}
                placeholder="parent@email.com"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  )
}

export default StudentForm