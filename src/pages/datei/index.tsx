import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SERVER_CONFIG from '../../config/server'

function fileRequestUrl(source: string, documentId: string): string {
  const base = String(SERVER_CONFIG.BASE_URL ?? '').replace(/\/$/, '')
  if (!base) return ''
  if (source) return `${base}/api/files?source=${encodeURIComponent(source)}`
  if (documentId) return `${base}/api/files?document=${encodeURIComponent(documentId)}`
  return ''
}

function plainMessage(body: string): string {
  const withoutTitle = body.replace(/<title>[\s\S]*?<\/title>/gi, ' ')
  const text = withoutTitle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 'Die Datei konnte nicht geladen werden.'
  try {
    const parsed = JSON.parse(text) as { error?: string }
    if (parsed.error) return parsed.error
  } catch {
    // HTML or plain text from the file route.
  }
  return text
}

const FileViewPage: React.FC = () => {
  const [params] = useSearchParams()
  const source = params.get('source')?.trim() ?? ''
  const documentId = params.get('document')?.trim() ?? ''
  const src = fileRequestUrl(source, documentId)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [contentType, setContentType] = useState('')
  const [error, setError] = useState<string | null>(null)
  const objectUrl = useRef<string | null>(null)

  useEffect(() => {
    const revoke = () => {
      if (!objectUrl.current) return
      URL.revokeObjectURL(objectUrl.current)
      objectUrl.current = null
    }

    if (!src) {
      setBlobUrl(null)
      setError('Die Datei wurde nicht angegeben.')
      return
    }

    const controller = new AbortController()
    setBlobUrl(null)
    setContentType('')
    setError(null)

    const load = async () => {
      try {
        const response = await fetch(src, { signal: controller.signal })
        const type = response.headers.get('content-type')?.split(';')[0]?.trim() || ''
        if (!response.ok) {
          throw new Error(plainMessage(await response.text()))
        }
        const bytes = await response.arrayBuffer()
        const url = URL.createObjectURL(new Blob([bytes], { type: type || 'application/octet-stream' }))
        if (controller.signal.aborted) {
          URL.revokeObjectURL(url)
          return
        }
        revoke()
        objectUrl.current = url
        setContentType(type)
        setBlobUrl(url)
      } catch (loadError) {
        if (controller.signal.aborted) return
        const message = loadError instanceof Error ? loadError.message : ''
        if (message === 'Failed to fetch' || message.includes('NetworkError')) {
          setError('Der Server ist nicht erreichbar.')
          return
        }
        setError(message || 'Die Datei konnte nicht geladen werden.')
      }
    }

    void load()
    return () => {
      controller.abort()
      revoke()
    }
  }, [src])

  const isHtml = contentType.includes('html')
  const isPdf = contentType.includes('pdf')

  return (
    <div
      style={{
        flex: '1 1 auto',
        minHeight: 'calc(100vh - 80px)',
        margin: '12px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        background: '#f7f7f8',
        color: '#1c1c1c',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {src ? (
        <p style={{ margin: 0, padding: '10px 16px', borderBottom: '1px solid #e4e4e7' }}>
          <a href={src} target='_blank' rel='noopener noreferrer' style={{ color: '#0f6b4c' }}>
            Datei direkt öffnen
          </a>
        </p>
      ) : null}
      {error ? (
        <p style={{ margin: 0, padding: 24 }}>{error}</p>
      ) : blobUrl && isPdf ? (
        <embed title='Dokument' type='application/pdf' src={blobUrl} style={{ flex: 1, width: '100%', minHeight: 0 }} />
      ) : blobUrl ? (
        <iframe
          title='Dokument'
          src={blobUrl}
          {...(isHtml ? { sandbox: '' } : {})}
          style={{ flex: 1, width: '100%', minHeight: 0, border: 0, background: '#fff' }}
        />
      ) : (
        <p style={{ margin: 0, padding: 24 }}>Datei wird geladen…</p>
      )}
    </div>
  )
}

export default FileViewPage
