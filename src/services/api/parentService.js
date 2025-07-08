import { toast } from 'react-toastify'

class ParentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'parent_communication'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "contact_method" } },
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
        console.error("Error fetching parent communications:", error?.response?.data?.message)
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
          { field: { Name: "student_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "contact_method" } },
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
        console.error(`Error fetching parent communication with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "contact_method" } }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [studentId]
          }
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
        console.error(`Error fetching communications for student ${studentId}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async create(communicationData) {
    try {
      const params = {
        records: [{
          Name: communicationData.Name || communicationData.subject,
          student_id: parseInt(communicationData.student_id),
          type: communicationData.type,
          subject: communicationData.subject,
          content: communicationData.content,
          date: communicationData.date || new Date().toISOString().split('T')[0],
          contact_method: communicationData.contact_method,
          Tags: communicationData.Tags,
          Owner: communicationData.Owner
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
          console.error(`Failed to create ${failedRecords.length} parent communications:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating parent communication:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, communicationData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: communicationData.Name || communicationData.subject,
          student_id: parseInt(communicationData.student_id),
          type: communicationData.type,
          subject: communicationData.subject,
          content: communicationData.content,
          date: communicationData.date,
          contact_method: communicationData.contact_method,
          Tags: communicationData.Tags,
          Owner: communicationData.Owner
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
          console.error(`Failed to update ${failedUpdates.length} parent communications:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating parent communication:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} parent communications:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting parent communication:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async addNote(studentId, noteData) {
    try {
      const communicationData = {
        student_id: parseInt(studentId),
        type: 'note',
        subject: noteData.subject,
        content: noteData.content,
        contact_method: noteData.contact_method || 'note',
        date: new Date().toISOString().split('T')[0]
      }

      return await this.create(communicationData)
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding note:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }
}

export const parentService = new ParentService()