import { toast } from 'react-toastify'

class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'assignment'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "total_points" } },
          { field: { Name: "weight" } },
          { field: { Name: "due_date" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      }

      const response = await this.client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "total_points" } },
          { field: { Name: "weight" } },
          { field: { Name: "due_date" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      }

      const response = await this.client.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(assignmentData) {
    try {
      // Validate weight
      if (assignmentData.weight < 0 || assignmentData.weight > 100) {
        toast.error('Weight must be between 0 and 100')
        return null
      }

      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          category: assignmentData.category,
          total_points: assignmentData.total_points,
          weight: assignmentData.weight,
          due_date: assignmentData.due_date,
          description: assignmentData.description,
          Tags: assignmentData.Tags,
          Owner: assignmentData.Owner
        }]
      }

      const response = await this.client.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignments:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, assignmentData) {
    try {
      // Validate weight if provided
      if (assignmentData.weight !== undefined && (assignmentData.weight < 0 || assignmentData.weight > 100)) {
        toast.error('Weight must be between 0 and 100')
        return null
      }

      const params = {
        records: [{
          Id: id,
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          category: assignmentData.category,
          total_points: assignmentData.total_points,
          weight: assignmentData.weight,
          due_date: assignmentData.due_date,
          description: assignmentData.description,
          Tags: assignmentData.Tags,
          Owner: assignmentData.Owner
        }]
      }

      const response = await this.client.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} assignments:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }

      const response = await this.client.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} assignments:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const assignmentService = new AssignmentService()