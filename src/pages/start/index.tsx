import React from 'react'
import {
  startScreenStyle,
  welcomeTitleStyle,
  inputBarWrapperStyle,
} from './styles'
import ChatInput from '../../components/chat-input'

const StartScreen: React.FC<{
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
}> = ({ input, onInputChange, onSend, onInputKeyDown, isLoading = false }) => {
  return (
    <div style={startScreenStyle}>
      <div style={welcomeTitleStyle}>Witaj, rjenje zo sy tu</div>
      <div style={inputBarWrapperStyle}>
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          onKeyDown={onInputKeyDown}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default StartScreen
