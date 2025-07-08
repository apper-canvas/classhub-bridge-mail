import parentsData from '@/services/mockData/parents.json'

class ParentService {
  constructor() {
    this.communications = [...parentsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.communications]
  }

  async getById(id) {
    await this.delay(200)
    const communication = this.communications.find(c => c.Id === id)
    if (!communication) {
      throw new Error('Communication record not found')
    }
    return { ...communication }
  }

  async getByStudentId(studentId) {
    await this.delay(250)
    const studentCommunications = this.communications.filter(c => c.studentId === studentId)
    return [...studentCommunications]
  }

  async create(communicationData) {
    await this.delay(400)
    const newCommunication = {
      ...communicationData,
      Id: Math.max(...this.communications.map(c => c.Id)) + 1,
      date: new Date().toISOString().split('T')[0]
    }
    this.communications.push(newCommunication)
    return { ...newCommunication }
  }

  async update(id, communicationData) {
    await this.delay(400)
    const index = this.communications.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Communication record not found')
    }
    this.communications[index] = { ...this.communications[index], ...communicationData }
    return { ...this.communications[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.communications.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Communication record not found')
    }
    this.communications.splice(index, 1)
    return true
  }

  async addNote(studentId, noteData) {
    await this.delay(350)
    const newNote = {
      studentId: parseInt(studentId),
      type: 'note',
      subject: noteData.subject,
      content: noteData.content,
      contactMethod: noteData.contactMethod || 'note',
      Id: Math.max(...this.communications.map(c => c.Id)) + 1,
      date: new Date().toISOString().split('T')[0]
    }
    this.communications.push(newNote)
    return { ...newNote }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const parentService = new ParentService()