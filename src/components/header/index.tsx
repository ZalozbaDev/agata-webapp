import React, { useState } from 'react'
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
  impresumstyle
} from './styles'
import { CreateUrlRequest, urlService } from '../../services/urlService'
import { Settingsicon } from '../../assets/icons'


const Header: React.FC<{agataOn:boolean, wabjenjeOn:boolean, onChangeagata:(isActive:boolean)=>void, onChangeWabjenje:(isActive:boolean)=>void}> = ({agataOn, onChangeagata, wabjenjeOn,onChangeWabjenje}) => {
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

  // Handler for shift-clicking AGATA sign
  const handleAgataClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      setAgataShiftClicks(prev => {
        const next = prev + 1;
        if (next === 2) {
          setShowLinks(true);
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(() => {
            setShowLinks(false);
            setAgataShiftClicks(0);
          }, 5000); // Hide after 5 seconds
        }
        return next === 2 ? 0 : next;
      });
    }
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleAgataClick}>
            AGATA
          </Link>
        </div>
        <div style={Settingsiconstyle}>
          <button style={{background: 'none', padding: 0}} onClick={() => setIsmenuOpen(!ismenuOpen)}>
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
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 20 20"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsOpen(true)}
              >
                <path
                  fill="#fff"
                  d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16"
                />
              </svg>
            </div>
          </div>
        )}
      </header>
      {ismenuOpen && (
        <div onClick={() => setIsmenuOpen(false)} style={{...popupStyle, fontSize: '3rem', top:'90px', left: 'null', right: '-160px', zIndex: 1000}}>
<Link to='/impresum' style={{...impresumstyle, fontSize: '2rem'}}>
              Impresum
            </Link>
            <br></br><button onClick={() => setIssetOpen(true)} style={{...impresumstyle, fontSize: '2rem', background: 'none', border: 'none',}}>
              Zastajenja
              </button>
        </div>
      )}
      {issetOpen && (
        <div style={{...popupStyle, fontSize: '3rem'}}>
          <button style={{...closeButtonStyle, fontSize:'3rem',}} onClick={() => setIssetOpen(false)}>
            ×
          </button>
          <p>Zastajenja</p>
          <div style={{fontSize: '2rem', marginLeft: '5rem', marginRight: '5rem'}}>
           <input type='checkbox' name='Wabjenje' id='wabjenje' checked={wabjenjeOn} onChange={e => {
              onChangeWabjenje(e.target.checked);
            }} style={checkboxstyle}/> Wabjenje
          <p><input type='checkbox' name='Agata' id='agata' checked={agataOn} onChange={e => {
              onChangeagata(e.target.checked);
            }} style={checkboxstyle}/> Agata</p>
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
    </>
  )
}

export default Header
