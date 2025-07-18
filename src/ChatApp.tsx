import { useState, useCallback, useEffect, useRef } from 'react'
import StartScreen from './pages/start'
import ChatScreen from './pages/chat'
import { MessageType } from './components/Message.tsx'
import { chatService } from './services/api'
import { getErrorType, getErrorMessage } from './types/errors'
import { getAudioFromText } from './services/bamborak.ts'
import { BamborakAudioResponse } from './types/bamborak'
import { useRecording } from './hooks/useRecording.ts'
import { Settings } from './types/settings.ts'
import { useAudioContext } from './hooks/useAudioContext.ts'

const chatAppStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
}
export const ChatApp: React.FC<{
  onGetAudio: (
    audioUrl: string,
    bamborakResponse: BamborakAudioResponse
  ) => void
}> = ({ onGetAudio }) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [lastError, setLastError] = useState<{
    type: string
    message: string
  } | null>(null)
  const [mediaStreamSettings] = useState<Settings>({
    sampleRate: 48000,
    bufferSize: 4096,
    autoPlayAudio: false,
    selectedSpeakerId: 'katka_2025_07',
  })

  const [selectedMicrophone] = useState<MediaDeviceInfo | null>(null)

  const [inputText, setInputText] = useState<string[]>([])
  const [, setTranslation] = useState<any[]>([])

  // Add missing timeOffsetRef
  const timeOffsetRef = useRef<number>(0)

  const audioContext = useAudioContext()
  const recording = useRecording(mediaStreamSettings, selectedMicrophone, {
    timeOffsetRef,
    setInputText,
    setTranslation,
    audioContext,
  })

  // Update input field when transcription comes in
  useEffect(() => {
    if (inputText.length > 0) {
      const transcribedText = inputText.join(' ')
      setInput(transcribedText)
    }
  }, [inputText])

  // Cleanup audio URL when component unmounts or audio changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    if (!started) setStarted(true)

    // Clear any previous error
    setLastError(null)

    // Add user message to chat
    setMessages(msgs => [...msgs, { role: 'user', content: userMessage }])
    setInput('')
    // Clear transcribed text
    setInputText([])
    setIsLoading(true)

    try {
      // Send message to server
      const response = await chatService.sendMessage(userMessage)

      getAudioFromText(response.message, 'katka_2025_07').then(
        bamborakResponse => {
          // Convert base64 audio to ArrayBuffer
          const audioData = atob(bamborakResponse.audio)
          const audioArray = new Uint8Array(audioData.length)
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i)
          }
          const audioBuffer = audioArray.buffer

          // Create blob URL for the audio
          const blob = new Blob([audioBuffer], { type: 'audio/wav' })
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          onGetAudio(url, bamborakResponse)
        }
      )
      // Add assistant response to chat
      setMessages(msgs => [
        ...msgs,
        {
          role: 'assistant',
          content: response.message,
        },
      ])
    } catch (error: any) {
      console.error('Error sending message:', error)

      const errorType = getErrorType(error)
      const errorMessage = getErrorMessage(error)

      // Set error for display in chat
      setLastError({ type: errorType, message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, started])

  const handleRetry = useCallback(
    async (message: string) => {
      if (isLoading) return

      setIsLoading(true)
      setLastError(null)

      try {
        const response = await chatService.sendMessage(message)

        // Replace the last error message with the successful response
        setMessages(msgs => {
          const newMessages = [...msgs]
          // Remove the last error message if it exists
          if (
            newMessages.length > 0 &&
            newMessages[newMessages.length - 1].role === 'assistant' &&
            newMessages[newMessages.length - 1].content.includes('zmylk')
          ) {
            newMessages.pop()
          }
          // Add the successful response
          newMessages.push({
            role: 'assistant',
            content: response.message,
          })
          return newMessages
        })
      } catch (error: any) {
        console.error('Retry failed:', error)
        const errorMessage = getErrorMessage(error)

        setLastError({ type: getErrorType(error), message: errorMessage })
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value)

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) handleSend()
  }

  // Handle recording start/stop
  const handleRecordingToggle = () => {
    console.log('Toggling recording')
    if (recording.isRecording) {
      recording.breakRecording('stop')
    } else {
      recording.startRecording()
    }
  }

  return (
    <div style={chatAppStyle}>
      {!started ? (
        <StartScreen
          input={input}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onInputKeyDown={handleInputKeyDown}
          isLoading={isLoading}
          onRecordingToggle={handleRecordingToggle}
          isRecording={recording.isRecording}
        />
      ) : (
        <ChatScreen
          messages={messages}
          input={input}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onInputKeyDown={handleInputKeyDown}
          isLoading={isLoading}
          lastError={lastError}
          onRetry={
            lastError
              ? () => handleRetry(messages[messages.length - 2]?.content || '')
              : undefined
          }
          onRecordingToggle={handleRecordingToggle}
          isRecording={recording.isRecording}
        />
      )}
    </div>
  )
}
