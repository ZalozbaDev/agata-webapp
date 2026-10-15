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
import { stripSourceRefs } from './components/citations/sourceHelpers'
import { DEFAULT_SPEAKER_ID } from './config/persona'

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
  ipAddress: string
  /** Read answers aloud with the persona speaker. */
  speak?: boolean
  /** Voice used until the chat response names the persona speaker. */
  speakerId?: string
  /** The microphone stays limited to Upper Sorbian personas. */
  showMicrophone?: boolean
}> = ({
  onGetAudio,
  ipAddress,
  speak = true,
  speakerId = DEFAULT_SPEAKER_ID,
  showMicrophone = false,
}) => {
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
  const speechRequestRef = useRef(0)

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

  const readAnswer = useCallback(
    (answerText: string, voice?: string) => {
      if (!speak) return
      const requestId = ++speechRequestRef.current
      const speaker = voice?.trim() || speakerId.trim() || DEFAULT_SPEAKER_ID
      getAudioFromText(stripSourceRefs(answerText), speaker)
        .then(bamborakResponse => {
          if (speechRequestRef.current !== requestId) return
          const audioData = atob(bamborakResponse.audio)
          const audioArray = new Uint8Array(audioData.length)
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i)
          }
          const blob = new Blob([audioArray.buffer], { type: 'audio/wav' })
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          onGetAudio(url, bamborakResponse)
        })
        .catch(error => {
          console.error('Error reading answer:', error)
        })
    },
    [onGetAudio, speak, speakerId],
  )

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
      const response = await chatService.sendMessage(userMessage, ipAddress)

      const answerText = response.answer ?? response.message
      const sources = response.sources ?? []
      readAnswer(answerText, response.speakerId)
      setMessages(msgs => [
        ...msgs,
        {
          role: 'assistant',
          content: answerText,
          sources,
          title: response.title,
          language: response.language,
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
  }, [input, isLoading, started, ipAddress, readAnswer])

  const handleRetry = useCallback(
    async (message: string) => {
      if (isLoading) return

      setIsLoading(true)
      setLastError(null)

      try {
        const response = await chatService.sendMessage(message, ipAddress)
        const answerText = response.answer ?? response.message
        readAnswer(answerText, response.speakerId)

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
            content: answerText,
            sources: response.sources ?? [],
            title: response.title,
            language: response.language,
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
    [isLoading, ipAddress, readAnswer]
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
          showMicrophone={showMicrophone}
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
          showMicrophone={showMicrophone}
        />
      )}
    </div>
  )
}
