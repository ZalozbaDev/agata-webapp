import api from './api'

// Visitor interface matching the mongoose schema
export interface IVisitor {
  _id: string
  ipAddress: string
  lastVisitedAt: string[]
  createdAt: string
  updatedAt: string
}

// API response types
export interface VisitorsResponse {
  message: string
  visitors: IVisitor[]
}

export interface VisitorResponse {
  message: string
  visitor: IVisitor
}

export interface DetectVisitorRequest {
  ipAddress: string
}

export interface CountResponse {
  visitors: number
  total: number
  prompts: number
}

// Visitor service functions
export const visitorService = {
  // Fetch all visitors
  async getAllVisitors(): Promise<IVisitor[]> {
    try {
      const response = await api.get<VisitorsResponse>('/api/visitors')
      return response.data.visitors
    } catch (error) {
      console.error('Error fetching visitors:', error)
      throw error
    }
  },

  // Create a new visitor
  async detectVisitor(visitorData: DetectVisitorRequest): Promise<IVisitor> {
    try {
      const response = await api.post<VisitorResponse>(
        '/api/visitors',
        visitorData
      )
      return response.data.visitor
    } catch (error) {
      console.error('Error creating visitor:', error)
      throw error
    }
  },

  // Get total visit count
  async getVisitCount(): Promise<CountResponse> {
    try {
      const response = await api.get<CountResponse>('/api/visitors/count')
      return response.data
    } catch (error) {
      console.error('Error fetching visit count:', error)
      throw error
    }
  },
}

export default visitorService
