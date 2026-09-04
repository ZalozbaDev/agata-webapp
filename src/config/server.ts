// Server configuration
export const getConfig = (key: string) => {
  // 1. Prüfen, ob eine Variable im Docker-Fenster (Laufzeit) existiert und kein Platzhalter ist
  if (
    window._env_ &&
    window._env_[key] &&
    !window._env_[key].startsWith('__')
  ) {
    return window._env_[key]
  }

  // 2. Fallback auf die normale Vite-Umgebungsvariable (Build-Zeit / Lokal)
  return import.meta.env[key]
}

export const SERVER_CONFIG = {
  // Base URL for the API server
  BASE_URL: getConfig('VITE_API_URL'),
  VOSK_URL: getConfig('VITE_VOSK_URL'),

  // API endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    CHAT_HISTORY: '/api/chat/history',
    PERSONAS: '/api/personas',
    URLS: '/api/urls',
    DATA: '/api/data',
    VISITORS: '/api/visitors',
  },

  // Request timeout in milliseconds
  TIMEOUT: 100000,
}

export default SERVER_CONFIG
