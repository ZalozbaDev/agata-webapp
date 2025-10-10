import { useState, useEffect, useState as useReactState, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import Header from './components/header'
import UrlsPage from './pages/urls'
import DataPage from './pages/data'
import ImpresumPage from './pages/impresum'
import FaqPage from './pages/faq'
import { WociMikanje } from './components/woci-mikanje'
import { WociCenteredContext } from './components/woci-mikanje/WociCenteredContext'
import { Wabjenje } from './components/wabjenje/index.tsx'
import TalkingPuppet from './components/lotti/index.tsx'
import { BamborakAudioResponse } from './types/bamborak'
import { ChatApp } from './ChatApp.tsx'
import visitorService from './services/visitorService.ts'
// import { Cookies }  from './components/cookies/index.tsx'

const AppContent: React.FC = () => {
  const appStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 50px)',
    margin: 0,
    width: 'calc(100vw - 50px)',
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

  const [isWide, setIsWide] = useReactState(() => window.innerWidth > 1100)
  const [ishigh, setishigh] = useReactState(() => window.innerHeight > 670)
  const [isextrahigh, setisextrahigh] = useReactState(() => window.innerHeight > 600)
  const [isExtraWide, setIsExtraWide] = useReactState(
    () => window.innerWidth > 1250
  )
  const [isCentered, setIsCentered] = useState(false)
  const [wabjenjeOn, setWabjenjeOn] = useState(true)
  const [agataOn, setagataOn] = useState(true)
  const [centagataOn, setcentagataOn] = useState(false)
  const [wopyty, setWopyty] = useState(0)
  const [prompts, setPrompts] = useState(0)
  const [ipAddress, setIpAddress] = useState<string>('')
  const effectRan = useRef(false)

  useEffect(() => {
    if (!effectRan.current) {
      // Get client IP address
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          setIpAddress(data.ip)
          visitorService.detectVisitor({ ipAddress: data.ip })
        })
        .finally(() => {
          visitorService.getVisitCount().then(result => {
            setWopyty(result.visitors)
            setPrompts(result.prompts)
          })
        })
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  useEffect(() => {
    if (centagataOn) {
      setIsCentered(true)
    }
  }, [centagataOn])

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [bamborakResponse, setBamborakResponse] =
    useState<BamborakAudioResponse | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 1100)
      setishigh(window.innerHeight > 670)
      setisextrahigh(window.innerHeight > 600)
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
        <Header
          wopyty={wopyty}
          propmts={prompts}
          centagataOn={centagataOn}
          agataOn={agataOn}
          wabjenjeOn={wabjenjeOn}
          onChangecentagata={isActive => {
            setcentagataOn(isActive)
          }}
          onChangeagata={isActive => {
            setagataOn(isActive)
          }}
          onChangeWabjenje={isActive => {
            setWabjenjeOn(isActive)
          }}
        />
        {/*isMain && <Cookies /> */}
        {isMain && (isCentered || isWide) && ishigh && agataOn && (
          <WociMikanje isCentered={isCentered} setIsCentered={setIsCentered}>
            <TalkingPuppet
              audioFile={audioUrl}
              visemes={bamborakResponse?.visemes}
              duration={bamborakResponse?.duration}
            />
          </WociMikanje>
        )}
        {isMain && isWide && ishigh && wabjenjeOn && <Wabjenje />}
        <div style={spacerStyle} /> {/* Spacer for fixed header */}
        <Routes>
          <Route
            path='/'
            element={<ChatApp onGetAudio={onGetAudio} ipAddress={ipAddress} />}
          />
          <Route path='/urls' element={<UrlsPage />} />
          <Route path='/data' element={<DataPage />} />
          <Route path='/impresum' element={<ImpresumPage />} />
          <Route path='/faq' element={<FaqPage />} />
        </Routes>
      </div>
    </WociCenteredContext.Provider>
  )
}

const App: React.FC = () => {
  return <AppContent />
}

export default App
