import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  headerStyle,
  headerLeftStyle,
  headerRightStyle,
  profileCircleStyle,
  popupStyle,
  closeButtonStyle,
  textInputStyle,
  sendButtonStyle,
  textbottomInputStyle,
  urlsButtonStyle,
  Settingsiconstyle,
  checkboxstyle,
  impresumstyle,
  userstyle,
  topmiddlestyle,
  // topmiddlestyle, // No longer used
} from './styles'
// Show top middle text for 20 seconds, then hide
import { CreateUrlRequest, urlService } from '../../services/urlService'
import { Settingsicon } from '../../assets/icons'
import mici from '../../assets/michael downsyndrom ziesch.jpg'
import cigareta from '../../assets/cigareta.mp3'
import punk from '../../assets/felix_punk.mp3'

const Header: React.FC<{
  wopyty: number
  centagataOn: boolean
  agataOn: boolean
  wabjenjeOn: boolean
  onChangecentagata: (isActive: boolean) => void
  onChangeagata: (isActive: boolean) => void
  onChangeWabjenje: (isActive: boolean) => void
}> = ({
  wopyty,
  centagataOn,
  onChangecentagata,
  agataOn,
  onChangeagata,
  wabjenjeOn,
  onChangeWabjenje,
}) => {
  // Show top middle text for 20 seconds, then hide
  const [showTopMiddle, setShowTopMiddle] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowTopMiddle(false), 20000)
    return () => clearTimeout(timer)
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [issetOpen, setIssetOpen] = useState(false)
  const [ismenuOpen, setIsmenuOpen] = useState(false)
  const [newUrl, setNewUrl] = useState<CreateUrlRequest>({
    url: '',
    username: '',
    password: '',
    description: '',
  })
  const [showLinks, setShowLinks] = useState(false)
  const [agataShiftClicks, setAgataShiftClicks] = useState(0)
  const [showHiddenImage, setShowHiddenImage] = useState(false)
  const [settingsShiftClicks, setSettingsShiftClicks] = useState(0)
  const [pendingShowHiddenImage, setPendingShowHiddenImage] = useState(false)
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log(newUrl)
    if (!newUrl.url.trim()) {
      return
    }

    try {
      await urlService.createUrl(newUrl)
      // Reset form
      setNewUrl({
        url: '',
        username: '',
        password: '',
        description: '',
      })
      setIsOpen(false)
    } catch (err: any) {}
  }

  const handleAgataClick = (e: React.MouseEvent) => {
    if (ismenuOpen) {
      const punkaudio = new Audio(punk)
      punkaudio.play()
    }
    if (e.shiftKey) {
      e.preventDefault()
      setAgataShiftClicks(prev => {
        const next = prev + 1
        if (next === 2) {
          setShowLinks(true)
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = setTimeout(() => {
            setShowLinks(false)
            setAgataShiftClicks(0)
          }, 5000) // Hide after 5 seconds
        }
        return next === 2 ? 0 : next
      })
    }
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <Link
            to='/'
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={handleAgataClick}
          >
            AGATA
          </Link>

          {showTopMiddle && (
            <div style={topmiddlestyle}>
              pokazka: jelizo wužiwaće k zapodaću naprašowanja waš mikrofon, so zwuk přechodnje składuje
            </div>
          )}
        </div>
        {!ismenuOpen && <div style={userstyle}>wopyty: {wopyty}</div>}

        <div style={Settingsiconstyle}>
          <button
            style={{ background: 'none', padding: 0 }}
            onClick={e => {
              if (e.ctrlKey) {
                setSettingsShiftClicks(prev => {
                  const next = prev + 1
                  if (next === 3) {
                    const audio = new Audio(cigareta)
                    audio.play()
                    // Stop audio after 1 minute
                    setTimeout(() => {
                      audio.pause()
                      audio.currentTime = 0
                    }, 60000)
                    setPendingShowHiddenImage(true)
                    setTimeout(() => {
                      setShowHiddenImage(true)
                      setTimeout(() => {
                        setShowHiddenImage(false)
                        setSettingsShiftClicks(0)
                        setPendingShowHiddenImage(false)
                      }, 50000) // Show for 5 seconds
                    }, 10000) // Wait 3 seconds before showing
                    return 0
                  }
                  return next
                })
              } else {
                setIsmenuOpen(!ismenuOpen)
              }
            }}
          >
            <Settingsicon />
          </button>
        </div>
        {showLinks && (
          <div style={headerRightStyle}>
            <Link to='/urls' style={urlsButtonStyle}>
              URLs
            </Link>
            <Link to='/data' style={urlsButtonStyle}>
              Data
            </Link>
            <div style={profileCircleStyle}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 20 20'
                style={{ cursor: 'pointer' }}
                onClick={() => setIsOpen(true)}
              >
                <path
                  fill='#fff'
                  d='M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16'
                />
              </svg>
            </div>
          </div>
        )}
      </header>
      {ismenuOpen && (
        <div
          onClick={() => setIsmenuOpen(false)}
          style={{
            ...popupStyle,
            fontSize: '2.5rem',
            top: '125px',
            left: 'null',
            right: '-100px',
            zIndex: 1000,
          }}
        >
          <Link to='/impresum' style={{ ...impresumstyle, fontSize: '1.5rem' }}>
            impresum
          </Link>
          <br></br>
          <button
            onClick={() => setIssetOpen(true)}
            style={{
              ...impresumstyle,
              fontSize: '1.5rem',
              background: 'none',
            }}
          >
            nastajenja
          </button>
          <br></br>
          <a
            href='https://www.mdr.de/serbski-program/rozhlos/index.html'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              ...impresumstyle,
              fontSize: '1.5rem',
              background: 'none',
            }}
          >
            rozhłós
          </a>
        </div>
      )}
      {issetOpen && (
        <div style={{ ...popupStyle, fontSize: '3rem' }}>
          <button
            style={{ ...closeButtonStyle, fontSize: '3rem' }}
            onClick={() => setIssetOpen(false)}
          >
            ×
          </button>
          <p>nastajenja</p>
          <div
            style={{
              fontSize: '2rem',
              marginLeft: '5rem',
              marginRight: '5rem',
            }}
          >
            <input
              type='checkbox'
              name='Wabjenje'
              id='wabjenje'
              checked={wabjenjeOn}
              onChange={e => {
                onChangeWabjenje(e.target.checked)
              }}
              style={checkboxstyle}
            />{' '}
            Wabjenje
            <p>
              <input
                type='checkbox'
                name='Agata'
                id='agata'
                checked={agataOn}
                onChange={e => {
                  onChangeagata(e.target.checked)
                }}
                style={checkboxstyle}
              />{' '}
              Agata
            </p>
            <p>
              <input
                type='checkbox'
                name='Centrěrowana Agata'
                id='centagata'
                checked={centagataOn}
                onChange={e => {
                  onChangecentagata(e.target.checked)
                }}
                style={checkboxstyle}
              />
              Centrěrowana Agata
            </p>
          </div>
        </div>
      )}
      {isOpen && (
        <div style={popupStyle}>
          <button style={closeButtonStyle} onClick={() => setIsOpen(false)}>
            ×
          </button>
          <p>Zapodajće waše daty w tutych kasćikach</p>
          <form
            onSubmit={e => {
              handleCreateUrl(e)
              setIsOpen(false)
            }}
          >
            <input
              type='text'
              placeholder='Waša Url'
              required
              value={newUrl.url}
              onChange={e => setNewUrl({ ...newUrl, url: e.target.value })}
              style={textInputStyle}
            />
            <input
              type='text'
              value={newUrl.username}
              placeholder='Waša Email (opcionalne)'
              onChange={e => setNewUrl({ ...newUrl, username: e.target.value })}
              style={textInputStyle}
            />
            <input
              type='password'
              value={newUrl.password}
              placeholder='Waše hesło (opcionalne)'
              onChange={e => setNewUrl({ ...newUrl, password: e.target.value })}
              style={textInputStyle}
            />
            <input
              type='text'
              value={newUrl.description}
              placeholder='Waše wopisanje (opcionalne)'
              onChange={e =>
                setNewUrl({ ...newUrl, description: e.target.value })
              }
              style={textbottomInputStyle}
            />
            <button type='submit' style={sendButtonStyle}>
              Wotpósłać
            </button>
          </form>
        </div>
      )}
      {showHiddenImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: '#000',
          }}
        >
          <img
            src={mici}
            alt='Hidden'
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              opacity: 1,
              transition:
                'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s',
              animation: 'growMici 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <style>{`
              @keyframes growMici {
                from { transform: scale(0.0); }
                to { transform: scale(1.0); }
              }
            `}</style>
        </div>
      )}
    </>
  )
}

export default Header
