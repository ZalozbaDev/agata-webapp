import React from 'react'
import { ErrorType } from '../../types/errors'
import {
  errorMessageStyle,
  errorIconStyle,
  errorContentStyle,
  errorTitleStyle,
  errorDescriptionStyle,
  retryButtonStyle,
} from './styles'
import { RetryIcon } from '../../assets/icons'

interface ErrorMessageProps {
  errorType: ErrorType
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorType,
  message,
  onRetry,
}) => {
  const getErrorIcon = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M1 1l22 22' />
            <path d='M16.72 11.06A10.94 10.94 0 0 1 19 12.55' />
            <path d='M5 12.55a10.94 10.94 0 0 1 5.17-2.39' />
            <path d='M10.71 5.05A16 16 0 0 1 22.58 9' />
            <path d='M1.42 9a15.91 15.91 0 0 1 4.7-2.88' />
            <path d='M8.53 16.11a6 6 0 0 1 6.95 0' />
            <line x1='12' y1='20' x2='12.01' y2='20' />
          </svg>
        )
      case ErrorType.SERVER_ERROR:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
            <line x1='8' y1='21' x2='16' y2='21' />
            <line x1='12' y1='17' x2='12' y2='21' />
          </svg>
        )
      case ErrorType.TIMEOUT_ERROR:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <circle cx='12' cy='12' r='10' />
            <polyline points='12,6 12,12 16,14' />
          </svg>
        )
      case ErrorType.VALIDATION_ERROR:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M9 12l2 2 4-4' />
            <path d='M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z' />
            <path d='M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z' />
            <path d='M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z' />
            <path d='M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z' />
          </svg>
        )
      default:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='15' y1='9' x2='9' y2='15' />
            <line x1='9' y1='9' x2='15' y2='15' />
          </svg>
        )
    }
  }

  const getErrorTitle = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
        return 'Zwiskowy zmylk'
      case ErrorType.SERVER_ERROR:
        return 'Serwerowy zmylk'
      case ErrorType.TIMEOUT_ERROR:
        return 'Časowe překročenje'
      case ErrorType.VALIDATION_ERROR:
        return 'Přepruwowanski zmylk'
      default:
        return 'Zmylk je so wutwarił'
    }
  }

  return (
    <div style={errorMessageStyle}>
      <div style={errorIconStyle}>{getErrorIcon()}</div>
      <div style={errorContentStyle}>
        <div style={errorTitleStyle}>{getErrorTitle()}</div>
        <div style={errorDescriptionStyle}>{message}</div>
        {onRetry && (
          <button style={retryButtonStyle} onClick={onRetry}>
            <RetryIcon />
            Znowa spytać
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
