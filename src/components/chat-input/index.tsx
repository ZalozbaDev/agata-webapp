import React, { useEffect } from 'react'
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
import { registerInputSetter } from './ChatInputController'
import { updateInputValue } from './ChatInputController'

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
  useEffect(() => {
    registerInputSetter((newValue) => {
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    })
  }, [onChange])

  const disabledInputStyle: React.CSSProperties = {
    ...chatInputStyle,
    opacity: isLoading ? 0.5 : 1,
    cursor: isLoading ? 'not-allowed' : 'text',
  }

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

  const recordingButtonStyle: React.CSSProperties = {
    ...disabledButtonStyle,
    backgroundColor: isRecording ? '#f44336' : 'transparent',
    color: isRecording ? '#fff' : '#000000ff',
    transition: 'background-color 0.3s ease',
    position: 'relative',
  }

  // WICHTIG: Gemeinsame Prüf-Logik für Klick und Enter
  const openIfBajk = () => {
    if (value.toLowerCase().includes('bajk')) {
      window.open('https://dyrdomdej.de/?category=4', '_blank')
    }
  }

  const handleSendClick = () => {
    if (isLoading || !value.trim()) return
    openIfBajk()
    onSend()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      // Enter abfangen, Tab öffnen, dann senden
      openIfBajk()
      onSend()
      // optional: Standard-Enter verhindern, falls Parent zusätzlich sendet
      e.preventDefault()
      return
    }
    // bestehendes KeyDown-Verhalten beibehalten
    onKeyDown(e)
  }

  return (
    <div style={inputBarStyle}>
      <div style={innerInputBarStyle}>
        <SpellCheckedInput
          style={disabledInputStyle}
          placeholder='Zapodaj tule swoje prašenje ...'
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoFocus
        />
        <button
          style={recordingButtonStyle}
          disabled={isLoading}
          onClick={() => {
            onRecordingToggle && onRecordingToggle()
            updateInputValue('')
          }}
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
          onClick={handleSendClick}
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
