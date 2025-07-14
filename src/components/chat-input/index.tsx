import React from 'react'
import { MicIcon, SendIcon } from '../../assets/icons'
import LoadingSpinner from '../LoadingSpinner'
import {
  chatInputStyle,
  inputIconStyle,
  innerInputBarStyle,
  inputBarStyle,
  sendIconStyle,
} from './styles'

const ChatInput: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
}> = ({ value, onChange, onSend, onKeyDown, isLoading = false }) => {
  // Create disabled input style when loading
  const disabledInputStyle: React.CSSProperties = {
    ...chatInputStyle,
    opacity: isLoading ? 0.5 : 1,
    cursor: isLoading ? 'not-allowed' : 'text',
  }

  // Create disabled button style when loading
  const disabledButtonStyle: React.CSSProperties = {
    ...inputIconStyle,
    opacity: isLoading ? 0.5 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
  }

  const disabledSendButtonStyle: React.CSSProperties = {
    ...sendIconStyle,
    opacity: isLoading ? 0.5 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    backgroundColor: isLoading ? 'transparent' : '#10a37f',
  }

  return (
    <div style={inputBarStyle}>
      <div style={innerInputBarStyle}>
        {/* <button style={disabledButtonStyle} disabled={isLoading}>
          <PlusIcon />
        </button>
        <button style={disabledButtonStyle} disabled={isLoading}>
          <SettingsIcon />
        </button> */}
        <input
          style={disabledInputStyle}
          type='text'
          placeholder='Powěsć zapodać...'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          autoFocus
        />
        <button style={disabledButtonStyle} disabled={isLoading}>
          <MicIcon />
        </button>
        <button
          style={disabledSendButtonStyle}
          onClick={onSend}
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? <LoadingSpinner size='small' /> : <SendIcon />}
        </button>
      </div>
    </div>
  )
}

export default ChatInput
