import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  type AdminPersona,
  type PersonaFormValues,
  clearAdminToken,
  createPersona,
  deletePersona,
  fetchAdminPersonas,
  generatePersonaToken,
  getAdminToken,
  personaAccessPath,
  personaErrorMessage,
  personaWebviewPath,
  setAdminToken,
  updatePersona,
  validatePersonaForm,
} from '../../services/personaService'
import {
  actionButtonStyle,
  cardStyle,
  dangerButtonStyle,
  dialogStyle,
  errorStyle,
  headerRowStyle,
  inputStyle,
  noticeStyle,
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

type SortKey =
  | 'name'
  | 'slug'
  | 'token'
  | 'topK'
  | 'webResultCount'
  | 'tag'
  | 'visibility'
  | 'documentCount'
  | 'allowExternalDelete'

const emptyForm = (): PersonaFormValues => ({
  name: '',
  slug: '',
  prompt: '',
  token: '',
  topK: 5,
  webResultCount: 0,
  tag: '',
  visibility: 'private',
  allowExternalDelete: false,
})

const columns: Array<{ key: SortKey; label: string; align?: 'left' | 'center' }> = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Kurzname' },
  { key: 'token', label: 'Token' },
  { key: 'topK', label: 'RAG', align: 'center' },
  { key: 'webResultCount', label: 'Web', align: 'center' },
  { key: 'tag', label: 'Tag' },
  { key: 'visibility', label: 'Sichtbarkeit' },
  { key: 'documentCount', label: 'Dokumente', align: 'center' },
  { key: 'allowExternalDelete', label: 'Extern löschen', align: 'center' },
]

function preview(value: string, max = 80): string {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed || '—'
  return `${trimmed.slice(0, max)}…`
}

const AdminPersonasPage: React.FC = () => {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()))
  const [loginToken, setLoginToken] = useState('')
  const [personas, setPersonas] = useState<AdminPersona[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [editor, setEditor] = useState<PersonaFormValues | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<AdminPersona | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAdminPersonas()
      setPersonas(data)
      setAuthed(true)
    } catch (err) {
      const message = personaErrorMessage(err, 'Personas konnten nicht geladen werden.')
      if (message === 'Nicht autorisiert.') {
        clearAdminToken()
        setAuthed(false)
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) void load()
  }, [authed, load])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = personas.filter(persona => {
      if (!needle) return true
      return [
        persona.name,
        persona.slug,
        persona.prompt,
        persona.token,
        persona.tag,
        persona.visibility,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
    const sorted = [...filtered].sort((left, right) => {
      const a = left[sortKey]
      const b = right[sortKey]
      const result =
        typeof a === 'number' && typeof b === 'number'
          ? a - b
          : typeof a === 'boolean' && typeof b === 'boolean'
            ? Number(a) - Number(b)
            : String(a).localeCompare(String(b), 'de')
      return sortAsc ? result : -result
    })
    return sorted
  }, [personas, query, sortAsc, sortKey])

  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(current => !current)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!loginToken.trim()) {
      setError('Bitte den Admin-Token eingeben.')
      return
    }
    setAdminToken(loginToken)
    setLoginToken('')
    setAuthed(true)
  }

  const openCreate = () => {
    setEditingId(null)
    setEditor(emptyForm())
    setError(null)
  }

  const openEdit = (persona: AdminPersona) => {
    setEditingId(persona.id)
    setEditor({
      name: persona.name,
      slug: persona.slug,
      prompt: persona.prompt,
      token: persona.token,
      topK: persona.topK,
      webResultCount: persona.webResultCount ?? 0,
      tag: persona.tag,
      visibility: persona.visibility,
      allowExternalDelete: persona.allowExternalDelete,
    })
    setError(null)
  }

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editor) return
    const validation = validatePersonaForm(editor)
    if (validation) {
      setError(validation)
      return
    }
    if (editingId && !editor.token.trim()) {
      setError('Der Token darf nicht leer sein.')
      return
    }
    try {
      setSaving(true)
      setError(null)
      const saved = editingId
        ? await updatePersona(editingId, editor)
        : await createPersona(editor)
      setPersonas(current => {
        const rest = current.filter(persona => persona.id !== saved.id)
        return [saved, ...rest]
      })
      setEditor(null)
      setEditingId(null)
      setSuccess(editingId ? 'Persona gespeichert.' : 'Persona erstellt.')
    } catch (err) {
      setError(personaErrorMessage(err, 'Persona konnte nicht gespeichert werden.'))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!pendingDelete) return
    try {
      setSaving(true)
      setError(null)
      await deletePersona(pendingDelete.id)
      setPersonas(current => current.filter(persona => persona.id !== pendingDelete.id))
      setSuccess('Persona und zugehörige Dokumente wurden gelöscht.')
      setPendingDelete(null)
    } catch (err) {
      setError(personaErrorMessage(err, 'Persona konnte nicht gelöscht werden.'))
    } finally {
      setSaving(false)
    }
  }

  const copyText = async (value: string, successText: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setSuccess(successText)
    } catch {
      setError(`Kopieren fehlgeschlagen: ${value}`)
    }
  }

  const fillToken = async () => {
    try {
      const token = await generatePersonaToken()
      setEditor(current => (current ? { ...current, token } : current))
    } catch (err) {
      setError(personaErrorMessage(err, 'Token konnte nicht erzeugt werden.'))
    }
  }

  if (!authed) {
    return (
      <div style={pageStyle}>
        <h1 style={titleStyle}>Persona-Verwaltung</h1>
        <form onSubmit={onLogin} style={{ ...cardStyle, maxWidth: 480 }}>
          <p style={{ marginTop: 0 }}>
            Diese Seite ist nur für Administratoren. Der Token bleibt in dieser
            Browser-Sitzung und wird nicht in der Persona gespeichert.
          </p>
          {error && <div style={errorStyle}>{error}</div>}
          <input
            type='password'
            autoComplete='current-password'
            placeholder='Admin-Token'
            value={loginToken}
            onChange={event => setLoginToken(event.target.value)}
            style={inputStyle}
          />
          <div style={{ marginTop: 12 }}>
            <button type='submit' style={primaryButtonStyle}>
              Anmelden
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>Persona-Verwaltung</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type='button' onClick={openCreate} style={primaryButtonStyle}>
            Neue Persona erstellen
          </button>
          <button
            type='button'
            style={secondaryButtonStyle}
            onClick={() => {
              clearAdminToken()
              setAuthed(false)
              setPersonas([])
            }}
          >
            Abmelden
          </button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}

      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <input
          type='search'
          placeholder='Suchen nach Name, Kurzname, Token oder Tag'
          value={query}
          onChange={event => setQuery(event.target.value)}
          style={inputStyle}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    style={{
                      ...thStyle,
                      textAlign: column.align ?? 'left',
                    }}
                    title={
                      column.key === 'topK'
                        ? 'RAG-Ergebnisse'
                        : column.key === 'webResultCount'
                          ? 'Web-Ergebnisse'
                          : undefined
                    }
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortKey === column.key ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
                <th style={{ ...thStyle, cursor: 'default' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td style={tdStyle} colSpan={columns.length + 1}>
                    Keine Personas gefunden.
                  </td>
                </tr>
              ) : (
                visible.map(persona => (
                  <tr key={persona.id}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{persona.name}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#c8c8d0' }}>
                      {persona.slug || '—'}
                    </td>
                    <td
                      style={{ ...tdStyle, fontFamily: 'monospace', color: '#c8c8d0' }}
                      title={persona.token}
                    >
                      {preview(persona.token, 10)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{persona.topK}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {persona.webResultCount ?? 0}
                    </td>
                    <td style={tdStyle}>{persona.tag || '—'}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 12,
                          background:
                            persona.visibility === 'public' ? '#145c45' : '#3a3a3a',
                        }}
                      >
                        {persona.visibility === 'public' ? 'Öffentlich' : 'Privat'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{persona.documentCount}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {persona.allowExternalDelete ? 'Ja' : 'Nein'}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        <button
                          type='button'
                          style={actionButtonStyle}
                          onClick={() => openEdit(persona)}
                        >
                          Bearbeiten
                        </button>
                        <button
                          type='button'
                          style={{ ...actionButtonStyle, ...dangerButtonStyle, padding: '6px 10px', fontSize: 12 }}
                          onClick={() => setPendingDelete(persona)}
                        >
                          Löschen
                        </button>
                        <Link
                          to={`/admin/personas/${persona.id}/documents`}
                          style={{ ...actionButtonStyle, textDecoration: 'none' }}
                        >
                          Dokumente
                        </Link>
                        <button
                          type='button'
                          style={{
                            ...actionButtonStyle,
                            opacity: persona.slug ? 1 : 0.45,
                          }}
                          disabled={!persona.slug}
                          onClick={() =>
                            void copyText(
                              personaWebviewPath(persona.slug),
                              'Webview-Link kopiert.',
                            )
                          }
                        >
                          Webview
                        </button>
                        <button
                          type='button'
                          style={actionButtonStyle}
                          title='Zugriffslink kopieren'
                          onClick={() =>
                            void copyText(
                              personaAccessPath(persona.token),
                              'Zugriffslink kopiert.',
                            )
                          }
                        >
                          Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <div style={overlayStyle} role='presentation'>
          <form style={dialogStyle} onSubmit={onSave}>
            <h2 style={{ marginTop: 0 }}>
              {editingId ? 'Persona bearbeiten' : 'Neue Persona'}
            </h2>
            {editingId && (
              <p style={noticeStyle}>
                Ein geänderter Token macht den bisherigen Zugriffslink ungültig.
              </p>
            )}
            <label>
              Name
              <input
                required
                value={editor.name}
                onChange={event =>
                  setEditor({ ...editor, name: event.target.value })
                }
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </label>
            <label style={{ display: 'block', marginTop: 12 }}>
              Kurzname für die Webview
              <input
                required
                value={editor.slug}
                onChange={event =>
                  setEditor({ ...editor, slug: event.target.value })
                }
                placeholder='schule'
                style={{ ...inputStyle, marginTop: 6 }}
              />
              <span style={{ display: 'block', marginTop: 6, color: '#bdbdbd', fontSize: 13 }}>
                {editor.slug.trim()
                  ? personaWebviewPath(editor.slug.trim().toLowerCase())
                  : `${window.location.origin}/?persona=schule`}
              </span>
            </label>
            <label style={{ display: 'block', marginTop: 12 }}>
              Prompt
              <textarea
                value={editor.prompt}
                onChange={event =>
                  setEditor({ ...editor, prompt: event.target.value })
                }
                style={{ ...inputStyle, marginTop: 6, minHeight: 140 }}
              />
            </label>
            <label style={{ display: 'block', marginTop: 12 }}>
              Token
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <input
                  value={editor.token}
                  onChange={event =>
                    setEditor({ ...editor, token: event.target.value })
                  }
                  placeholder='Leer lassen zum automatischen Erzeugen'
                  style={inputStyle}
                />
                <button type='button' style={secondaryButtonStyle} onClick={() => void fillToken()}>
                  Erzeugen
                </button>
              </div>
            </label>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: 160 }}>
                RAG-Ergebnisse (Top-K)
                <input
                  type='number'
                  min={1}
                  max={50}
                  step={1}
                  value={editor.topK}
                  onChange={event =>
                    setEditor({ ...editor, topK: Number(event.target.value) })
                  }
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>
              <label style={{ flex: 1, minWidth: 160 }}>
                Web-Ergebnisse
                <input
                  type='number'
                  min={0}
                  max={20}
                  step={1}
                  value={editor.webResultCount}
                  onChange={event =>
                    setEditor({ ...editor, webResultCount: Number(event.target.value) })
                  }
                  style={{ ...inputStyle, marginTop: 6 }}
                />
                <span style={{ display: 'block', marginTop: 4, color: '#a0a0a8', fontSize: 13 }}>
                  0 sucht nicht im Web. Sonst so viele DuckDuckGo-Treffer pro Antwort.
                </span>
              </label>
              <label style={{ flex: 1, minWidth: 160 }}>
                Tag
                <input
                  value={editor.tag}
                  onChange={event =>
                    setEditor({ ...editor, tag: event.target.value })
                  }
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>
            </div>
            <label style={{ display: 'block', marginTop: 12 }}>
              Sichtbarkeit
              <select
                value={editor.visibility}
                onChange={event =>
                  setEditor({
                    ...editor,
                    visibility: event.target.value === 'public' ? 'public' : 'private',
                  })
                }
                style={{ ...inputStyle, marginTop: 6 }}
              >
                <option value='private'>Privat</option>
                <option value='public'>Öffentlich</option>
              </select>
            </label>
            <label style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
              <input
                type='checkbox'
                checked={editor.allowExternalDelete}
                onChange={event =>
                  setEditor({
                    ...editor,
                    allowExternalDelete: event.target.checked,
                  })
                }
              />
              Externe Nutzer dürfen Dokumente löschen
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button
                type='button'
                style={secondaryButtonStyle}
                onClick={() => setEditor(null)}
              >
                Abbrechen
              </button>
              <button type='submit' style={primaryButtonStyle} disabled={saving}>
                {saving ? 'Speichert…' : 'Speichern'}
              </button>
            </div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div style={overlayStyle} role='presentation'>
          <div style={dialogStyle}>
            <h2 style={{ marginTop: 0 }}>Persona löschen?</h2>
            <p>
              „{pendingDelete.name}“ und alle zugehörigen Dokumente sowie
              RAG-Einträge werden unwiderruflich gelöscht.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type='button'
                style={secondaryButtonStyle}
                onClick={() => setPendingDelete(null)}
              >
                Abbrechen
              </button>
              <button
                type='button'
                style={dangerButtonStyle}
                disabled={saving}
                onClick={() => void onDelete()}
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPersonasPage
