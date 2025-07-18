import React, { useEffect, useState } from 'react'
import {
  startScreenStyle,
  welcomeTitleStyle,
  inputBarWrapperStyle,
} from './styles'
import ChatInput from '../../components/chat-input'
import { useWociCentered } from '../../components/woci-mikanje/WociCenteredContext'

const starttilearray: { title: string }[] = [
  { title: 'Budź chwaleny Jězus Chrystus.' },
  { title: 'Pomhaj Bóh.' },
  { title: 'Witaj, rjenje zo mje wopytaš ☺️' },
  { title: 'Klik mi na mjezwočo, potom so powjetšu.' },
  { title: 'Zapodaj Twoje prašenje prošu w porjadnej serbšćinje!' },
]

const fadeDuration = 500

const StartScreen: React.FC<{
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
  onRecordingToggle?: () => void
  isRecording?: boolean
}> = ({
  input,
  onInputChange,
  onSend,
  onInputKeyDown,
  isLoading = false,
  onRecordingToggle,
  isRecording = false,
}) => {
  const [titleIdx, setTitleIdx] = useState(() => Math.floor(Math.random() * starttilearray.length))
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setTitleIdx(() => Math.floor(Math.random() * starttilearray.length))
        setFade(true)
      }, fadeDuration)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const wociCtx = useWociCentered()
  const isCentered = wociCtx?.isCentered ?? false

  return (
    <div style={startScreenStyle}>
      <style>{`
        .welcome-fade {
          transition: opacity ${fadeDuration}ms;
          opacity: 1;
        }
        .welcome-fade.hide {
          opacity: 0;
        }
      `}</style>
      {!isCentered && (
        <div
          style={welcomeTitleStyle}
          className={`welcome-fade${fade ? '' : ' hide'}`}
        >
          {starttilearray[titleIdx].title}
        </div>
      )}
      {!isCentered ? (
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
      ) : null}
      {isCentered ? (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3000,
            padding: 16,
          }}
        >
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
      ) : null}
    </div>
  )
}

export default StartScreen
