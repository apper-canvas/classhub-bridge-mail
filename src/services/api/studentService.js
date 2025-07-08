import { toast } from 'react-toastify'

class StudentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'student'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "grade" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } },
          { field: { Name: "parent1_name" } },
          { field: { Name: "parent1_phone" } },
          { field: { Name: "parent1_email" } },
          { field: { Name: "parent2_name" } },
          { field: { Name: "parent2_phone" } },
          { field: { Name: "parent2_email" } },
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
        console.error("Error fetching students:", error?.response?.data?.message)
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "grade" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } },
          { field: { Name: "parent1_name" } },
          { field: { Name: "parent1_phone" } },
          { field: { Name: "parent1_email" } },
          { field: { Name: "parent2_name" } },
          { field: { Name: "parent2_phone" } },
          { field: { Name: "parent2_email" } },
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
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          grade: studentData.grade,
          email: studentData.email,
          phone: studentData.phone,
          enrollment_date: studentData.enrollment_date,
          status: studentData.status,
          parent1_name: studentData.parent1_name,
          parent1_phone: studentData.parent1_phone,
          parent1_email: studentData.parent1_email,
          parent2_name: studentData.parent2_name,
          parent2_phone: studentData.parent2_phone,
          parent2_email: studentData.parent2_email,
          Tags: studentData.Tags,
          Owner: studentData.Owner
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
          console.error(`Failed to create ${failedRecords.length} students:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating student:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          grade: studentData.grade,
          email: studentData.email,
          phone: studentData.phone,
          enrollment_date: studentData.enrollment_date,
          status: studentData.status,
          parent1_name: studentData.parent1_name,
          parent1_phone: studentData.parent1_phone,
          parent1_email: studentData.parent1_email,
          parent2_name: studentData.parent2_name,
          parent2_phone: studentData.parent2_phone,
          parent2_email: studentData.parent2_email,
          Tags: studentData.Tags,
          Owner: studentData.Owner
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
          console.error(`Failed to update ${failedUpdates.length} students:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating student:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} students:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const studentService = new StudentService()