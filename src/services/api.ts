import axios, { AxiosError, AxiosResponse } from 'axios'
import SERVER_CONFIG from '../config/server'
import { ApiError, getErrorMessage } from '../types/errors'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: SERVER_CONFIG.BASE_URL,
  timeout: SERVER_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types for API responses
export interface ChatResponse {
  message: string
  timestamp: string
}

export interface ChatRequest {
  message: string
}

// Enhanced error handling
const handleApiError = (error: AxiosError): ApiError => {
  const message = getErrorMessage(error)

  return {
    message,
    status: error.response?.status,
    code: error.code,
    details: (error.response?.data as any)?.message || error.message,
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
}

// Retry logic
const retryRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retryCount = 0
): Promise<T> => {
  try {
    const response = await requestFn()
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError

    // Check if we should retry
    const shouldRetry =
      retryCount < RETRY_CONFIG.maxRetries &&
      (RETRY_CONFIG.retryableStatuses.includes(
        axiosError.response?.status || 0
      ) ||
        axiosError.code === 'ECONNABORTED' ||
        (typeof axiosError.message === 'string' &&
          axiosError.message.includes('Network Error')))

    if (shouldRetry) {
      // Exponential backoff
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount)
      await new Promise(resolve => setTimeout(resolve, delay))

      console.log(
        `Retrying request (attempt ${retryCount + 1}/${
          RETRY_CONFIG.maxRetries
        })`
      )
      return retryRequest(requestFn, retryCount + 1)
    }

    throw handleApiError(axiosError)
  }
}

// API service functions
export const chatService = {
  // Send a message to the server and get assistant response
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      return await retryRequest<ChatResponse>(() =>
        api.post<ChatResponse>(SERVER_CONFIG.ENDPOINTS.CHAT, {
          message,
        } as ChatRequest)
      )
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  // Get chat history (if needed)
  async getChatHistory(): Promise<ChatResponse[]> {
    try {
      return await retryRequest<ChatResponse[]>(() =>
        api.get<ChatResponse[]>(SERVER_CONFIG.ENDPOINTS.CHAT_HISTORY)
      )
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  },

  // Test server connection
  async testConnection(): Promise<boolean> {
    try {
      await api.get('/health')
      return true
    } catch (error) {
      console.error('Server connection test failed:', error)
      return false
    }
  },
}

// Request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    )
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(
      `Received ${response.status} response from ${response.config.url}`
    )
    return response
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default api
