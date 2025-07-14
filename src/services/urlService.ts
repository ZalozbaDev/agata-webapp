import api from './api'

// URL interface matching the mongoose schema
export interface IUrl {
  _id: string
  url: string
  username?: string
  password?: string
  description?: string
  createdAt: string
}

// API response types
export interface UrlsResponse {
  success: boolean
  data: IUrl[]
  count: number
  timestamp: string
}

export interface UrlResponse {
  success: boolean
  data: IUrl
  timestamp: string
}

export interface CreateUrlRequest {
  url: string
  username?: string
  password?: string
  description?: string
}

export interface CreateUrlResponse {
  success: boolean
  data: IUrl
  message: string
  timestamp: string
}

// URL service functions
export const urlService = {
  // Fetch all URLs
  async getAllUrls(): Promise<IUrl[]> {
    try {
      const response = await api.get<UrlsResponse>('/api/urls')
      return response.data.data
    } catch (error) {
      console.error('Error fetching URLs:', error)
      throw error
    }
  },

  // Fetch a specific URL by ID
  async getUrlById(id: string): Promise<IUrl> {
    try {
      const response = await api.get<UrlResponse>(`/api/urls/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching URL:', error)
      throw error
    }
  },

  // Create a new URL
  async createUrl(urlData: CreateUrlRequest): Promise<IUrl> {
    try {
      const response = await api.post<CreateUrlResponse>('/api/urls', urlData)
      return response.data.data
    } catch (error) {
      console.error('Error creating URL:', error)
      throw error
    }
  },
}

export default urlService
