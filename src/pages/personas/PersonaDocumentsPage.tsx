import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { fileApiUrl } from '../../components/citations/sourceHelpers'
import {
  type PersonaDocument,
  askAdminPersona,
  askPublicPersona,
  deleteAdminDocument,
  deletePublicDocument,
  fetchAdminDocuments,
  fetchAdminPersona,
  fetchPublicDocuments,
  fetchPublicPersona,
  personaErrorMessage,
  personaLanguageLabel,
  uploadAdminDocument,
  uploadPublicDocument,
} from '../../services/personaService'
import {
  cardStyle,
  dangerButtonStyle,
  dialogStyle,
  errorStyle,
  headerRowStyle,
  inputStyle,
  overlayStyle,
  pageStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  successStyle,
  tableStyle,
  tableWrapStyle,
  tdStyle,
  thStyle,
  titleStyle,
} from './styles'

type Props = {
  mode: 'admin' | 'token'
}

const ACCEPTED = '.pdf,.html,.htm,application/pdf,text/html'

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('de-DE')
}

function fileKind(document: PersonaDocument): string {
  if (document.mimeType.includes('pdf') || document.filename.toLowerCase().endsWith('.pdf')) {
    return 'PDF'
  }
  return 'HTML'
}

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith('.pdf') || name.endsWith('.html') || name.endsWith('.htm')
}

const PersonaDocumentsPage: React.FC<Props> = ({ mode }) => {
  const params = useParams()
  const personaKey = mode === 'admin' ? params['id'] ?? '' : params['token'] ?? ''
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [name, setName] = useState('')
  const [languageLabel, setLanguageLabel] = useState('')
  const [canUpload, setCanUpload] = useState(mode === 'admin')
  const [canDelete, setCanDelete] = useState(mode === 'admin')
  const [documents, setDocuments] = useState<PersonaDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [blocked, setBlocked] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<{ filename: string; percent: number } | null>(
    null,
  )
  const [pendingDelete, setPendingDelete] = useState<PersonaDocument | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)

  const load = useCallback(async () => {
    if (!personaKey) {
      setBlocked('Der Link ist unvollständig.')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      setBlocked(null)
      if (mode === 'admin') {
        const [persona, docs] = await Promise.all([
          fetchAdminPersona(personaKey),
          fetchAdminDocuments(personaKey),
        ])
        setName(persona.name)
        setLanguageLabel(personaLanguageLabel(persona.language))
        setCanUpload(true)
        setCanDelete(true)
        setDocuments(docs)
      } else {
        const [persona, docs] = await Promise.all([
          fetchPublicPersona(personaKey),
          fetchPublicDocuments(personaKey),
        ])
        setName(persona.name)
        setLanguageLabel(personaLanguageLabel(persona.language))
        setCanUpload(persona.canUpload)
        setCanDelete(persona.canDelete)
        setDocuments(docs)
      }
    } catch (err) {
      setName('')
      setDocuments([])
      setBlocked(personaErrorMessage(err, 'Dokumente konnten nicht geladen werden.'))
    } finally {
      setLoading(false)
    }
  }, [mode, personaKey])

  useEffect(() => {
    void load()
  }, [load])

  const uploadFiles = async (files: File[]) => {
    const accepted = files.filter(isAcceptedFile)
    if (accepted.length !== files.length) {
      setError('Nur PDF- und HTML-Dateien können hochgeladen werden.')
      if (accepted.length === 0) return
    }
    setError(null)
    setSuccess(null)
    let uploaded = 0
    for (const file of accepted) {
      try {
        setProgress({ filename: file.name, percent: 0 })
        const document =
          mode === 'admin'
            ? await uploadAdminDocument(personaKey, file, percent =>
                setProgress({ filename: file.name, percent }),
              )
            : await uploadPublicDocument(personaKey, file, percent =>
                setProgress({ filename: file.name, percent }),
              )
        setDocuments(current => [document, ...current.filter(item => item.id !== document.id)])
        uploaded += 1
      } catch (err) {
        setError(personaErrorMessage(err, `${file.name} konnte nicht hochgeladen werden.`))
        break
      }
    }
    setProgress(null)
    if (uploaded > 0) {
      setSuccess(
        uploaded === 1 ? 'Dokument hochgeladen.' : `${uploaded} Dokumente hochgeladen.`,
      )
    }
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
    void uploadFiles(Array.from(event.dataTransfer.files))
  }

  const onDelete = async () => {
    if (!pendingDelete) return
    try {
      if (mode === 'admin') await deleteAdminDocument(personaKey, pendingDelete.id)
      else await deletePublicDocument(personaKey, pendingDelete.id)
      setDocuments(current => current.filter(document => document.id !== pendingDelete.id))
      setSuccess('Dokument gelöscht.')
      setPendingDelete(null)
    } catch (err) {
      setError(personaErrorMessage(err, 'Dokument konnte nicht gelöscht werden.'))
      setPendingDelete(null)
    }
  }

  const onAsk = async (event: React.FormEvent) => {
    event.preventDefault()
    const text = question.trim()
    if (!text) return
    try {
      setAsking(true)
      setError(null)
      const reply =
        mode === 'admin'
          ? await askAdminPersona(personaKey, text)
          : await askPublicPersona(personaKey, text)
      setAnswer(reply || 'Keine Antwort erhalten.')
    } catch (err) {
      setError(personaErrorMessage(err, 'Die Frage konnte nicht beantwortet werden.'))
    } finally {
      setAsking(false)
    }
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <LoadingSpinner />
      </div>
    )
  }

  if (blocked) {
    return (
      <div style={pageStyle}>
        <h1 style={titleStyle}>Persona</h1>
        <div style={errorStyle}>{blocked}</div>
        <button type='button' style={primaryButtonStyle} onClick={() => void load()}>
          Erneut versuchen
        </button>
        {mode === 'admin' && (
          <Link to='/admin/personas' style={{ color: '#10a37f' }}>
            Zurück zur Verwaltung
          </Link>
        )}
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          {mode === 'admin' && (
            <Link to='/admin/personas' style={{ color: '#10a37f', fontSize: 14 }}>
              Zurück zur Verwaltung
            </Link>
          )}
          <h1 style={titleStyle}>{name}</h1>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}

      {canUpload && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 16,
            borderStyle: 'dashed',
            borderColor: dragging ? '#10a37f' : '#404040',
            textAlign: 'center',
          }}
          onDragOver={event => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <p>Dateien hierher ziehen oder auswählen. Erlaubt sind PDF und HTML, maximal 20 MB.</p>
          <p style={{ margin: '8px 0 0', color: '#f0d48a' }}>
            {languageLabel && languageLabel !== '—'
              ? `Bitte nur Dokumente auf ${languageLabel} hochladen.`
              : 'Für diese Persona ist noch keine Sprache festgelegt.'}
          </p>
          <button type='button' style={primaryButtonStyle} onClick={() => fileInput.current?.click()}>
            Dateien auswählen
          </button>
          <input
            ref={fileInput}
            type='file'
            accept={ACCEPTED}
            multiple
            hidden
            onChange={event => {
              void uploadFiles(Array.from(event.target.files ?? []))
              event.target.value = ''
            }}
          />
          {progress && (
            <div style={{ marginTop: 16, textAlign: 'left' }}>
              <div style={{ marginBottom: 6 }}>
                {progress.filename}: {progress.percent}%
              </div>
              <div style={{ height: 8, background: '#1a1a1a', borderRadius: 4 }}>
                <div
                  style={{
                    width: `${progress.percent}%`,
                    height: '100%',
                    background: '#10a37f',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div style={tableWrapStyle}>
        <table style={{ ...tableStyle, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, cursor: 'default' }}>Dateiname</th>
              <th style={{ ...thStyle, cursor: 'default' }}>Dateityp</th>
              <th style={{ ...thStyle, cursor: 'default' }}>Dateigröße</th>
              <th style={{ ...thStyle, cursor: 'default' }}>Upload-Datum</th>
              {canDelete && <th style={{ ...thStyle, cursor: 'default' }}>Aktionen</th>}
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan={canDelete ? 5 : 4}>
                  Noch keine Dokumente vorhanden.
                </td>
              </tr>
            ) : (
              documents.map(document => (
                <tr key={document.id}>
                  <td style={tdStyle}>
                    <a
                      href={
                        fileKind(document) === 'PDF'
                          ? fileApiUrl(document.id, 'document')
                          : `/datei?document=${encodeURIComponent(document.id)}`
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ color: '#8fd8c0', textDecoration: 'none' }}
                    >
                      {document.filename}
                    </a>
                  </td>
                  <td style={tdStyle}>{fileKind(document)}</td>
                  <td style={tdStyle}>{formatBytes(document.size)}</td>
                  <td style={tdStyle}>{formatDate(document.uploadedAt)}</td>
                  {canDelete && (
                    <td style={tdStyle}>
                      <button
                        type='button'
                        style={dangerButtonStyle}
                        onClick={() => setPendingDelete(document)}
                      >
                        Löschen
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={onAsk} style={{ ...cardStyle, marginTop: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Frage an diese Persona</h2>
        <textarea
          value={question}
          onChange={event => setQuestion(event.target.value)}
          placeholder='Frage stellen'
          style={{ ...inputStyle, minHeight: 80 }}
        />
        <div style={{ marginTop: 10 }}>
          <button type='submit' style={primaryButtonStyle} disabled={asking}>
            {asking ? 'Antwort wird erstellt…' : 'Fragen'}
          </button>
        </div>
        {answer && (
          <div style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>{answer}</div>
        )}
      </form>

      {pendingDelete && (
        <div style={overlayStyle} role='presentation'>
          <div style={dialogStyle}>
            <h2 style={{ marginTop: 0 }}>Dokument löschen?</h2>
            <p>„{pendingDelete.filename}“ wird aus der Persona und aus dem RAG-Bestand entfernt.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type='button'
                style={secondaryButtonStyle}
                onClick={() => setPendingDelete(null)}
              >
                Abbrechen
              </button>
              <button type='button' style={dangerButtonStyle} onClick={() => void onDelete()}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonaDocumentsPage
