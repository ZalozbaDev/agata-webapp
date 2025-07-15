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
} from './styles'
import { CreateUrlRequest, urlService } from '../../services/urlService'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [newUrl, setNewUrl] = useState<CreateUrlRequest>({
    url: '',
    username: '',
    password: '',
    description: '',
  })

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

  return (
    <>
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            AGATA
          </Link>
        </div>
        <div style={headerRightStyle}>
          <Link to='/urls' style={urlsButtonStyle}>
            URLs
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
      </header>
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
