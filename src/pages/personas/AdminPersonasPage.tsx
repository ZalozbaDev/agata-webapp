import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  type AdminPersona,
  type PersonaFormValues,
  clearAdminToken,
  createPersona,
  deletePersona,
  deletePersonaImage,
  fetchAdminPersonas,
  getAdminToken,
  PERSONA_LANGUAGES,
  personaAccessPath,
  personaErrorMessage,
  personaImageUrl,
  personaLanguageLabel,
  personaWebviewPath,
  setAdminToken,
  updatePersona,
  uploadPersonaImage,
  validatePersonaForm,
} from '../../services/personaService'
import { DEFAULT_SPEAKER_ID } from '../../config/persona'
import { getAvailableSpeakers } from '../../services/bamborak'
import type { BamborakSpeaker } from '../../types/bamborak'
import {
  actionButtonStyle,
  cardStyle,
  dangerButtonStyle,
  dialogStyle,
  errorStyle,
  fieldLabelStyle,
  fieldStyle,
  headerRowStyle,
  hintStyle,
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

type SortKey =
  | 'name'
  | 'slug'
  | 'language'
  | 'speakerId'
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
  language: '',
  topK: 5,
  webResultCount: 0,
  tag: '',
  speakerId: DEFAULT_SPEAKER_ID,
  visibility: 'private',
  allowExternalDelete: false,
})

const SPEAKER_LANGUAGE_LABELS: Record<string, string> = {
  hsb: 'Obersorbisch',
  de: 'Deutsch',
  dsb: 'Niedersorbisch',
}

function speakerLanguageLabel(language: string): string {
  return SPEAKER_LANGUAGE_LABELS[language] ?? language
}

function speakerOptionLabel(speaker: BamborakSpeaker): string {
  const language = speakerLanguageLabel(speaker.language)
  return language ? `${speaker.name} · ${language}` : speaker.name
}

function speakerName(id: string, speakers: BamborakSpeaker[]): string {
  return (
    speakers.find(speaker => speaker.id === id)?.name ??
    (id === DEFAULT_SPEAKER_ID ? 'Katka (2025)' : id || '—')
  )
}

const columns: Array<{
  key: SortKey
  label: string
  align?: 'left' | 'center'
}> = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Kurzname' },
  { key: 'language', label: 'Sprache' },
  { key: 'speakerId', label: 'Stimme' },
  { key: 'topK', label: 'RAG', align: 'center' },
  { key: 'webResultCount', label: 'Web', align: 'center' },
  { key: 'tag', label: 'Gruppen-Tag' },
  { key: 'visibility', label: 'Sichtbarkeit' },
  { key: 'documentCount', label: 'Dokumente', align: 'center' },
  { key: 'allowExternalDelete', label: 'Extern löschen', align: 'center' },
]

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [storedImage, setStoredImage] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const [languageLocked, setLanguageLocked] = useState(false)
  const [speakers, setSpeakers] = useState<BamborakSpeaker[]>([])
  const [speakersError, setSpeakersError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const loadSpeakers = useCallback(async () => {
    try {
      setSpeakersError(null)
      const available = await getAvailableSpeakers()
      setSpeakers(available)
    } catch {
      setSpeakersError(
        'Die Stimmen konnten nicht geladen werden. Es bleibt die bisherige Stimme.',
      )
    }
  }, [])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAdminPersonas()
      setPersonas(data)
      setAuthed(true)
    } catch (err) {
      const message = personaErrorMessage(
        err,
        'Personas konnten nicht geladen werden.',
      )
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
        personaLanguageLabel(persona.language),
        persona.prompt,
        persona.tag,
        persona.speakerId,
        speakerName(persona.speakerId, speakers),
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
  }, [personas, query, sortAsc, sortKey, speakers])

  const speakerChoices = useMemo(() => {
    const byId = new Map(speakers.map(speaker => [speaker.id, speaker]))
    const selected = editor?.speakerId?.trim() || DEFAULT_SPEAKER_ID
    if (!byId.has(DEFAULT_SPEAKER_ID)) {
      byId.set(DEFAULT_SPEAKER_ID, {
        id: DEFAULT_SPEAKER_ID,
        name: 'Katka (2025)',
        language: 'hsb',
      })
    }
    if (!byId.has(selected)) {
      byId.set(selected, { id: selected, name: selected, language: '' })
    }
    const preferred = editor?.language
    return [...byId.values()].sort((left, right) => {
      const leftMatch = preferred && left.language === preferred ? 0 : 1
      const rightMatch = preferred && right.language === preferred ? 0 : 1
      if (leftMatch !== rightMatch) return leftMatch - rightMatch
      return left.name.localeCompare(right.name, 'de')
    })
  }, [editor, speakers])

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
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(false)
    setStoredImage(false)
    setSlugLocked(false)
    setLanguageLocked(false)
    setError(null)
    void loadSpeakers()
  }

  const openEdit = (persona: AdminPersona) => {
    setEditingId(persona.id)
    setEditor({
      name: persona.name,
      slug: persona.slug,
      prompt: persona.prompt,
      language: persona.language ?? '',
      topK: persona.topK,
      webResultCount: persona.webResultCount ?? 0,
      tag: persona.tag,
      speakerId: persona.speakerId || DEFAULT_SPEAKER_ID,
      visibility: persona.visibility,
      allowExternalDelete: persona.allowExternalDelete,
    })
    setImageFile(null)
    setRemoveImage(false)
    setStoredImage(Boolean(persona.hasImage))
    setSlugLocked(persona.protected)
    setLanguageLocked(Boolean(persona.language))
    setImagePreview(
      persona.hasImage ? personaImageUrl(persona.slug || persona.id) : null,
    )
    setError(null)
    void loadSpeakers()
  }

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editor) return
    const validation = validatePersonaForm(editor)
    if (validation) {
      setError(validation)
      return
    }
    try {
      setSaving(true)
      setError(null)
      const wasEdit = Boolean(editingId)
      const savedPersona = wasEdit
        ? await updatePersona(editingId as string, editor)
        : await createPersona(editor)
      let saved = savedPersona
      try {
        if (imageFile) {
          saved = await uploadPersonaImage(savedPersona.id, imageFile)
        } else if (removeImage && wasEdit) {
          saved = await deletePersonaImage(savedPersona.id)
        }
      } catch (imageError) {
        setPersonas(current => {
          const rest = current.filter(persona => persona.id !== savedPersona.id)
          return [savedPersona, ...rest]
        })
        setEditingId(savedPersona.id)
        setError(
          personaErrorMessage(
            imageError,
            'Das Bild konnte nicht gespeichert werden.',
          ),
        )
        return
      }
      setPersonas(current => {
        const rest = current.filter(persona => persona.id !== saved.id)
        return [saved, ...rest]
      })
      setEditor(null)
      setEditingId(null)
      setImageFile(null)
      setImagePreview(null)
      setRemoveImage(false)
      setStoredImage(false)
      setSuccess(wasEdit ? 'Persona gespeichert.' : 'Persona erstellt.')
    } catch (err) {
      setError(
        personaErrorMessage(err, 'Persona konnte nicht gespeichert werden.'),
      )
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
      setPersonas(current =>
        current.filter(persona => persona.id !== pendingDelete.id),
      )
      setSuccess('Persona und zugehörige Dokumente wurden gelöscht.')
      setPendingDelete(null)
    } catch (err) {
      setError(
        personaErrorMessage(err, 'Persona konnte nicht gelöscht werden.'),
      )
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
          placeholder='Suchen nach Name, Kurzname oder Gruppen-Tag'
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
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {persona.name}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: 'monospace',
                        color: '#c8c8d0',
                      }}
                    >
                      {persona.slug || '—'}
                    </td>
                    <td style={tdStyle}>{personaLanguageLabel(persona.language)}</td>
                    <td style={tdStyle}>{speakerName(persona.speakerId, speakers)}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {persona.topK}
                    </td>
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
                            persona.visibility === 'public'
                              ? '#145c45'
                              : '#3a3a3a',
                        }}
                      >
                        {persona.visibility === 'public'
                          ? 'Öffentlich'
                          : 'Privat'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {persona.documentCount}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {persona.allowExternalDelete ? 'Ja' : 'Nein'}
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}
                      >
                        <button
                          type='button'
                          style={actionButtonStyle}
                          onClick={() => openEdit(persona)}
                        >
                          Bearbeiten
                        </button>
                        <button
                          type='button'
                          disabled={persona.protected}
                          title={
                            persona.protected
                              ? 'Main und Sip können nicht gelöscht werden.'
                              : undefined
                          }
                          style={{
                            ...actionButtonStyle,
                            ...dangerButtonStyle,
                            padding: '6px 10px',
                            fontSize: 12,
                            opacity: persona.protected ? 0.4 : 1,
                            cursor: persona.protected ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() => {
                            if (!persona.protected) setPendingDelete(persona)
                          }}
                        >
                          Löschen
                        </button>
                        <Link
                          to={`/admin/personas/${persona.id}/documents`}
                          style={{
                            ...actionButtonStyle,
                            textDecoration: 'none',
                          }}
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
            <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 650 }}>
              {editingId ? 'Persona bearbeiten' : 'Neue Persona'}
            </h2>
            <label style={{ ...fieldStyle, marginTop: 0 }}>
              <span style={fieldLabelStyle}>Name</span>
              <input
                required
                value={editor.name}
                onChange={event =>
                  setEditor({ ...editor, name: event.target.value })
                }
                style={inputStyle}
              />
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Kurzname für die Webview</span>
              <input
                required
                value={editor.slug}
                disabled={slugLocked}
                onChange={event =>
                  setEditor({ ...editor, slug: event.target.value })
                }
                placeholder='schule'
                style={{
                  ...inputStyle,
                  ...(slugLocked ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
                }}
              />
              <span style={hintStyle}>
                {slugLocked
                  ? 'Main und Sip behalten ihren Kurznamen. Der Prompt kann geändert werden.'
                  : editor.slug.trim()
                    ? personaWebviewPath(editor.slug.trim().toLowerCase())
                    : `${window.location.origin}/?persona=schule`}
              </span>
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Sprache</span>
              <select
                required
                value={editor.language}
                disabled={languageLocked}
                onChange={event =>
                  setEditor({
                    ...editor,
                    language: event.target.value as PersonaFormValues['language'],
                  })
                }
                style={{
                  ...inputStyle,
                  ...(languageLocked ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
                }}
              >
                <option value="">Sprache wählen</option>
                {PERSONA_LANGUAGES.map(language => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
              <span style={hintStyle}>
                {languageLocked
                  ? 'Die Sprache kann nach dem Anlegen nicht geändert werden.'
                  : 'Dokumente werden in dieser Sprache gespeichert und durchsucht.'}
              </span>
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Stimme</span>
              <select
                value={editor.speakerId}
                onChange={event =>
                  setEditor({ ...editor, speakerId: event.target.value })
                }
                style={inputStyle}
              >
                {speakerChoices.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speakerOptionLabel(speaker)}
                  </option>
                ))}
              </select>
              <span style={hintStyle}>
                {speakersError
                  ? speakersError
                  : 'Die Antworten im Chat werden mit dieser Stimme vorgelesen. Standard ist Katka (2025).'}
              </span>
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Prompt</span>
              <textarea
                value={editor.prompt}
                onChange={event =>
                  setEditor({ ...editor, prompt: event.target.value })
                }
                style={{
                  ...inputStyle,
                  minHeight: 120,
                  resize: 'vertical',
                  lineHeight: 1.45,
                }}
              />
            </label>
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 16,
                alignItems: 'flex-start',
              }}
            >
              <label style={{ flex: 1, minWidth: 0 }}>
                <span style={fieldLabelStyle}>RAG-Ergebnisse</span>
                <input
                  type='number'
                  min={1}
                  max={50}
                  step={1}
                  value={editor.topK}
                  onChange={event =>
                    setEditor({ ...editor, topK: Number(event.target.value) })
                  }
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1, minWidth: 0 }}>
                <span style={fieldLabelStyle}>Web-Ergebnisse</span>
                <input
                  type='number'
                  min={0}
                  max={20}
                  step={1}
                  value={editor.webResultCount}
                  onChange={event =>
                    setEditor({
                      ...editor,
                      webResultCount: Number(event.target.value),
                    })
                  }
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1, minWidth: 0 }}>
                <span style={fieldLabelStyle}>Gruppen-Tag</span>
                <input
                  value={editor.tag}
                  onChange={event =>
                    setEditor({ ...editor, tag: event.target.value })
                  }
                  style={inputStyle}
                />
              </label>
            </div>
            <span style={hintStyle}>
              Web-Ergebnisse: 0 sucht nicht im Web. Sonst so viele
              DuckDuckGo-Treffer pro Antwort.
            </span>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Sichtbarkeit</span>
              <select
                value={editor.visibility}
                onChange={event =>
                  setEditor({
                    ...editor,
                    visibility:
                      event.target.value === 'public' ? 'public' : 'private',
                  })
                }
                style={inputStyle}
              >
                <option value='private'>Privat</option>
                <option value='public'>Öffentlich</option>
              </select>
            </label>
            <label
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 16,
                alignItems: 'center',
                color: '#e6e6ec',
                fontSize: 14,
              }}
            >
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
            <div style={{ ...fieldStyle, paddingTop: 4 }}>
              <span style={fieldLabelStyle}>Bild</span>
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid #3a3a3a',
                  background: '#232323',
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    flexShrink: 0,
                    borderRadius: 12,
                    border: '1px solid #3a3a3a',
                    background: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {!removeImage && imagePreview ? (
                    <img
                      src={imagePreview}
                      alt='Persona-Bild'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span style={{ color: '#8d8d96', fontSize: 12 }}>
                      Kein Bild
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    ref={imageInputRef}
                    type='file'
                    accept='image/png,image/jpeg,image/webp,image/gif'
                    onChange={event => {
                      const file = event.target.files?.[0] ?? null
                      setImageFile(file)
                      setRemoveImage(false)
                      if (file) {
                        setImagePreview(URL.createObjectURL(file))
                        return
                      }
                      setImagePreview(
                        storedImage && editor.slug.trim()
                          ? personaImageUrl(editor.slug.trim().toLowerCase())
                          : storedImage && editingId
                            ? personaImageUrl(editingId)
                            : null,
                      )
                    }}
                    style={{ display: 'none' }}
                  />
                  <button
                    type='button'
                    style={secondaryButtonStyle}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    Bild auswählen
                  </button>
                  <span style={{ ...hintStyle, marginTop: 8 }}>
                    {removeImage
                      ? 'Das Bild wird beim Speichern entfernt.'
                      : imageFile
                        ? imageFile.name
                        : 'PNG, JPEG, WebP oder GIF, höchstens 5 MB. Ersetzt die Frau rechts unten.'}
                  </span>
                  {storedImage ? (
                    <label
                      style={{
                        display: 'flex',
                        gap: 8,
                        marginTop: 8,
                        alignItems: 'center',
                        fontSize: 13,
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={removeImage}
                        onChange={event => setRemoveImage(event.target.checked)}
                      />
                      Bild entfernen
                    </label>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 22,
                paddingTop: 16,
                borderTop: '1px solid #3a3a3a',
              }}
            >
              <button
                type='button'
                style={secondaryButtonStyle}
                onClick={() => setEditor(null)}
              >
                Abbrechen
              </button>
              <button
                type='submit'
                style={primaryButtonStyle}
                disabled={saving}
              >
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
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
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
