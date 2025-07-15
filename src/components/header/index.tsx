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
          <Link to='/data' style={urlsButtonStyle}>
            Data
          </Link>
          <div style={profileCircleStyle}>
            <img
              src='/src/assets/plus.svg'
              alt='Plus'
              onClick={() => setIsOpen(true)}
              style={{ width: '32px', height: '32px', cursor: 'pointer' }}
            />
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
