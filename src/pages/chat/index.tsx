import React, { useRef, useEffect } from 'react'
import {
  chatScreenStyle,
  inputBarWrapperStyle,
  messagesWrapperStyle,
} from './styles.ts'
import Message, { MessageType } from '../../components/Message.tsx'
import ChatInput from '../../components/chat-input'
import ErrorMessage from '../../components/ErrorMessage'
import { ErrorType } from '../../types/errors'
import { useWociCentered } from '../../components/woci-mikanje/WociCenteredContext'

const ChatScreen: React.FC<{
  messages: MessageType[]
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
  lastError?: { type: string; message: string } | null
  onRetry?: () => void
  onRecordingToggle?: () => void
  isRecording?: boolean
}> = ({
  messages,
  input,
  onInputChange,
  onSend,
  onInputKeyDown,
  isLoading = false,
  lastError,
  onRetry,
  onRecordingToggle,
  isRecording = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, lastError])

  const wociCtx = useWociCentered()
  const isCentered = wociCtx?.isCentered ?? false

  return (
    <div style={chatScreenStyle}>
      {!isCentered && (
        <div
          style={messagesWrapperStyle}
          className='no-scrollbar messagesWrapper'
        >
          {messages.map((msg, i) => (
            <Message key={i} role={msg.role} content={msg.content} />
          ))}
          {lastError && (
            <ErrorMessage
              errorType={lastError.type as ErrorType}
              message={lastError.message}
              onRetry={onRetry}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      {isCentered ? (
        <div style={{ position: 'fixed', bottom: 0, zIndex: 0, width: '100%' }}>
          <ChatInput
            value={input}
            onChange={onInputChange}
            onSend={onSend}
            onKeyDown={onInputKeyDown}
            isLoading={isLoading}
            onRecordingToggle={onRecordingToggle}
            isRecording={isRecording}
          />
        </div>
      ) : (
        <div style={inputBarWrapperStyle}>
          <ChatInput
            value={input}
            onChange={onInputChange}
            onSend={onSend}
            onKeyDown={onInputKeyDown}
            isLoading={isLoading}
            onRecordingToggle={onRecordingToggle}
            isRecording={isRecording}
          />
        </div>
      )}
    </div>
  )
}

export default ChatScreen
