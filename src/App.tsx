import { useState, useEffect, useState as useReactState } from 'react'
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
import { WociMikanje } from './components/woci-mikanje'
import { WociCenteredContext } from './components/woci-mikanje/WociCenteredContext'
import { Wabjenje } from './components/wabjenje/index.tsx'
import TalkingPuppet from './components/lotti/index.tsx'
import { BamborakAudioResponse } from './types/bamborak'
import { ChatApp } from './ChatApp.tsx'

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

  const [isWide, setIsWide] = useReactState(() => window.innerWidth > 1100)
  const [isExtraWide, setIsExtraWide] = useReactState(
    () => window.innerWidth > 1250
  )
  const [isCentered, setIsCentered] = useState(false)
  const [wabjenjeOn, setWabjenjeOn] = useState(true)
  const [agataOn, setagataOn] = useState(true)
  const [centagataOn, setcentagataOn] = useState(false)

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

const App: React.FC = () => {
  return <AppContent />
}

export default App
