import React from 'react'
import { MicIcon } from '../../assets/icons'
import SendIcon from '../../assets/SendIcon.png'
import LoadingSpinner from '../LoadingSpinner'
import { SpellCheckedInput } from '../spell-checked-input'
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
  onRecordingToggle?: () => void
  isRecording?: boolean
}> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isLoading = false,
  onRecordingToggle,
  isRecording = false,
}) => {
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
    backgroundColor: 'transparent',
  }

  // Create recording button style
  const recordingButtonStyle: React.CSSProperties = {
    ...disabledButtonStyle,
    backgroundColor: isRecording ? '#f44336' : 'transparent',
    color: isRecording ? '#fff' : '#000000ff',
    transition: 'background-color 0.3s ease',
    position: 'relative',
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
        <SpellCheckedInput
          style={disabledInputStyle}
          placeholder='Zapodaj tule swoje prašenje ...'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          autoFocus
        />
        <button
          style={recordingButtonStyle}
          disabled={isLoading}
          onClick={onRecordingToggle}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          <MicIcon />
          {isRecording && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          )}
        </button>
        <button
          style={disabledSendButtonStyle}
          onClick={onSend}
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? (
            <LoadingSpinner size='small' />
          ) : (
            <img src={SendIcon} alt='Send' style={{ width: 56, height: 32 }} />
          )}
        </button>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ChatInput
