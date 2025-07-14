import React, { useState, useEffect } from 'react'
import { urlService, IUrl, CreateUrlRequest } from '../../services/urlService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { getErrorType } from '../../types/errors'

const UrlsPage: React.FC = () => {
  const [urls, setUrls] = useState<IUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUrl, setNewUrl] = useState<CreateUrlRequest>({
    url: '',
    username: '',
    password: '',
    description: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await urlService.getAllUrls()
      setUrls(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch URLs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUrl.url.trim()) {
      setError('URL is required')
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      const createdUrl = await urlService.createUrl(newUrl)
      setUrls(prev => [createdUrl, ...prev])

      // Reset form
      setNewUrl({
        url: '',
        username: '',
        password: '',
        description: '',
      })
      setShowAddForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to create URL')
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>URLs</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={addButtonStyle}
        >
          {showAddForm ? 'Cancel' : 'Add URL'}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: '20px' }}>
          <ErrorMessage
            errorType={getErrorType({ message: error })}
            message={error}
            onRetry={fetchUrls}
          />
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreateUrl} style={formStyle}>
          <div style={formRowStyle}>
            <input
              type='url'
              placeholder='URL *'
              value={newUrl.url}
              onChange={e =>
                setNewUrl(prev => ({ ...prev, url: e.target.value }))
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={formRowStyle}>
            <input
              type='text'
              placeholder='Username (optional)'
              value={newUrl.username}
              onChange={e =>
                setNewUrl(prev => ({ ...prev, username: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              type='password'
              placeholder='Password (optional)'
              value={newUrl.password}
              onChange={e =>
                setNewUrl(prev => ({ ...prev, password: e.target.value }))
              }
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            <textarea
              placeholder='Description (optional)'
              value={newUrl.description}
              onChange={e =>
                setNewUrl(prev => ({ ...prev, description: e.target.value }))
              }
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={formActionsStyle}>
            <button
              type='submit'
              disabled={isCreating}
              style={submitButtonStyle}
            >
              {isCreating ? 'Creating...' : 'Create URL'}
            </button>
          </div>
        </form>
      )}

      <div style={tableContainerStyle}>
        {urls.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No URLs found. Add your first URL above!</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>URL</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(url => (
                <tr key={url._id} style={trStyle}>
                  <td style={tdStyle}>
                    <a
                      href={url.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={linkStyle}
                    >
                      {url.url}
                    </a>
                  </td>
                  <td style={tdStyle}>
                    {url.description ? (
                      <span style={descriptionStyle}>{url.description}</span>
                    ) : (
                      <span style={emptyFieldStyle}>-</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={dateStyle}>{formatDate(url.createdAt)}</span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => copyToClipboard(url.url)}
                      style={actionButtonStyle}
                      title='Copy URL'
                    >
                      📋
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// Styles
const containerStyle: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px',
  minHeight: 'calc(100vh - 48px)',
  maxWidth: '95vw',
  width: '100%',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: '600',
  margin: 0,
  color: '#ececf1',
}

const addButtonStyle: React.CSSProperties = {
  backgroundColor: '#10a37f',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.2s',
}

const formStyle: React.CSSProperties = {
  backgroundColor: '#2d2d2d',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
  border: '1px solid #404040',
}

const formRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  marginBottom: '15px',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  border: '1px solid #404040',
  borderRadius: '4px',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  fontSize: '14px',
}

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
}

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: '#10a37f',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
}

const tableContainerStyle: React.CSSProperties = {
  backgroundColor: '#2d2d2d',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #404040',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle: React.CSSProperties = {
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: '600',
  borderBottom: '1px solid #404040',
}

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid #404040',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#ececf1',
  verticalAlign: 'top',
}

const linkStyle: React.CSSProperties = {
  color: '#10a37f',
  textDecoration: 'none',
  wordBreak: 'break-all',
}

const credentialStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'monospace',
}

const copyButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '2px',
  opacity: 0.7,
  transition: 'opacity 0.2s',
}

const emptyFieldStyle: React.CSSProperties = {
  color: '#666',
  fontStyle: 'italic',
}

const descriptionStyle: React.CSSProperties = {
  maxWidth: '200px',
  wordBreak: 'break-word',
}

const dateStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#999',
}

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px',
  opacity: 0.7,
  transition: 'opacity 0.2s',
}

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px',
  color: '#666',
}

export default UrlsPage
