export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: string
}

export interface ErrorToast {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const getErrorMessage = (error: any): string => {
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Njepłaćiwe naprašowanje. Přepruwujće zapodate daty.'
      case 401:
        return 'Njepowolenje. Prošu přizjewće so znowa.'
      case 403:
        return 'Žane prawa za tutu operaciju.'
      case 404:
        return 'Serwer njeje so namakał. Přepruwujće zwisk.'
      case 429:
        return 'Přewjele naprašowanjow. Spytajće to za chwilku znowa.'
      case 500:
        return 'Serwerowy zmylk. Spytajće to pozdźišo znowa.'
      case 502:
        return 'Gatewayowy zmylk. Serwer njeje k dispoziciji.'
      case 503:
        return 'Słužba njeje k dispoziciji. Spytajće to pozdźišo znowa.'
      default:
        return 'Njewočakowany zmylk je so wutwarił. Spytajće to znowa.'
    }
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Zwiskowy čas je so překročił. Přepruwujće swoju internetowu zwisk.'
  }

  if (error?.message?.includes('Network Error')) {
    return 'Syćowy zmylk. Přepruwujće swoju internetowu zwisk.'
  }

  return (
    error?.message || 'Njewočakowany zmylk je so wutwarił. Spytajće to znowa.'
  )
}

export const getErrorType = (error: any): ErrorType => {
  if (error?.response?.status) {
    if (error.response.status >= 500) return ErrorType.SERVER_ERROR
    if (error.response.status === 408 || error.response.status === 504)
      return ErrorType.TIMEOUT_ERROR
    if (error.response.status === 400 || error.response.status === 422)
      return ErrorType.VALIDATION_ERROR
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return ErrorType.TIMEOUT_ERROR
  }

  if (error?.message?.includes('Network Error')) {
    return ErrorType.NETWORK_ERROR
  }

  return ErrorType.UNKNOWN_ERROR
}
