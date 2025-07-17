import {
  useState,
  useCallback,
  useEffect,
  useState as useReactState,
} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import Header from './components/header'
import StartScreen from './pages/start'
import ChatScreen from './pages/chat'
import UrlsPage from './pages/urls'
import DataPage from './pages/data'
import ImpresumPage from './pages/impresum'
import { MessageType } from './components/Message.tsx'
import { chatService } from './services/api'
import { getErrorType, getErrorMessage } from './types/errors'
import { WociMikanje } from './components/woci-mikanje'
import { WociCenteredContext } from './components/woci-mikanje/WociCenteredContext'
import { Wabjenje } from './components/wabjenje/index.tsx'
import { getAudioFromText } from './services/bamborak.ts'
import TalkingPuppet from './components/lotti/index.tsx'
import { BamborakAudioResponse } from './types/bamborak'

const ChatApp: React.FC<{
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

  return (
    <div style={chatAppStyle}>
      {!started ? (
        <StartScreen
          input={input}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onInputKeyDown={handleInputKeyDown}
          isLoading={isLoading}
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
        />
      )}
    </div>
  )
}
const AppContent: React.FC = () => {
  const appStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 50px)',
    margin: 0,
    width: 'calc(100vw - 90px)',
    padding: 0,
    // background: '#212121',
    color: '#ececf1',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  }

  const spacerStyle: React.CSSProperties = {
    height: '48px',
  }

  return (
    <Router>
      <AppContentInner appStyle={appStyle} spacerStyle={spacerStyle} />
    </Router>
  )
}

const AppContentInner: React.FC<{
  appStyle: React.CSSProperties
  spacerStyle: React.CSSProperties
}> = ({ appStyle, spacerStyle }) => {
  const location = useLocation()
  const isMain = location.pathname === '/'

  const [isWide, setIsWide] = useReactState(() => window.innerWidth > 1100);
  const [isExtraWide, setIsExtraWide] = useReactState(() => window.innerWidth > 1250);
  const [isCentered, setIsCentered] = useState(false);
const [wabjenjeOn, setWabjenjeOn] = useState(true);
const [agataOn, setagataOn] = useState(true);
const [centagataOn, setcentagataOn] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [bamborakResponse, setBamborakResponse] =
    useState<BamborakAudioResponse | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 1100)
      setIsExtraWide(window.innerWidth > 1250)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onGetAudio = (
    audioUrl: string,
    bamborakResponse: BamborakAudioResponse
  ) => {
    setAudioUrl(audioUrl)
    setBamborakResponse(bamborakResponse)
  }
  return (
    <WociCenteredContext.Provider value={{ isCentered, setIsCentered }}>
      <div style={appStyle}>

        <Header centagataOn={centagataOn} agataOn={agataOn} wabjenjeOn={wabjenjeOn}  onChangecentagata={(isActive) => {setcentagataOn(isActive)} } onChangeagata={(isActive) => {setagataOn(isActive)} } onChangeWabjenje={(isActive) => {setWabjenjeOn(isActive)} }  />


        {isMain && (isCentered || isExtraWide) && agataOn && (
          <WociMikanje isCentered={isCentered} setIsCentered={setIsCentered}>
            {audioUrl && bamborakResponse && (
              <TalkingPuppet
                audioFile={audioUrl}
                visemes={bamborakResponse.visemes}
                duration={bamborakResponse.duration}
              />
            )}
          </WociMikanje>
        )}
       {isMain && isWide && wabjenjeOn && <Wabjenje />}

        <div style={spacerStyle} /> {/* Spacer for fixed header */}
        <Routes>
          <Route path='/' element={<ChatApp onGetAudio={onGetAudio} />} />
          <Route path='/urls' element={<UrlsPage />} />
          <Route path='/data' element={<DataPage />} />
          <Route path='/impresum' element={<ImpresumPage />} />
        </Routes>
      </div>
    </WociCenteredContext.Provider>
  )
}

const chatAppStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
}

const App: React.FC = () => {
  return <AppContent />
}

export default App
