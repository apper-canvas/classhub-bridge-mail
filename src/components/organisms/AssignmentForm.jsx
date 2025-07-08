import { useState } from 'react'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import { assignmentService } from '@/services/api/assignmentService'

const AssignmentForm = ({ assignment = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    category: assignment?.category || '',
    totalPoints: assignment?.totalPoints || '',
    dueDate: assignment?.dueDate || '',
    description: assignment?.description || '',
  })
  const [loading, setLoading] = useState(false)

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'Homework', label: 'Homework' },
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Test', label: 'Test' },
    { value: 'Project', label: 'Project' },
    { value: 'Participation', label: 'Participation' },
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
      const data = {
        ...formData,
        totalPoints: parseInt(formData.totalPoints),
        dueDate: new Date(formData.dueDate).toISOString().split('T')[0],
      }

      if (assignment) {
        await assignmentService.update(assignment.Id, data)
        toast.success('Assignment updated successfully!')
      } else {
        await assignmentService.create(data)
        toast.success('Assignment created successfully!')
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to save assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Assignment Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
        />
        <Input
          label="Total Points"
          name="totalPoints"
          type="number"
          value={formData.totalPoints}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Assignment description..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : assignment ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  )
}

export default AssignmentForm