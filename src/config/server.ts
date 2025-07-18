// Server configuration
export const SERVER_CONFIG = {
  // Base URL for the API server
  BASE_URL: import.meta.env.VITE_API_URL,
  VOSK_URL: import.meta.env.VITE_VOSK_URL,

  // API endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    CHAT_HISTORY: '/api/chat/history',
    URLS: '/api/urls',
    DATA: '/api/data',
    VISITORS: '/api/visitors',
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,
}

export default SERVER_CONFIG
