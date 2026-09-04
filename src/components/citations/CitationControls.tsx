import React, { useEffect, useId, useRef, useState } from 'react'
import type { ChatSource } from '../../services/api'
import {
  faviconUrl,
  formatSourceMeta,
  sourceDomainLabel,
  sourceHref,
} from './sourceHelpers'

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  verticalAlign: 'middle',
  margin: '0 2px',
  padding: '1px 7px 1px 3px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.92)',
  color: '#1a1a1a',
  fontSize: '0.72rem',
  fontWeight: 600,
  lineHeight: 1.4,
  cursor: 'pointer',
  textDecoration: 'none',
  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  maxWidth: 140,
}

const popoverStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: 'calc(100% + 8px)',
  width: 280,
  maxWidth: 'min(280px, 70vw)',
  padding: '10px 12px',
  borderRadius: 12,
  background: '#2f2f2f',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
  color: '#fff',
  zIndex: 40,
  textAlign: 'left',
}

function SourceIcon({ source }: { source: ChatSource }) {
  const icon = faviconUrl(source)
  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        width={14}
        height={14}
        style={{ borderRadius: '50%', flexShrink: 0 }}
      />
    )
  }

  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: source.type === 'rag' ? '#5b8def' : '#888',
        color: '#fff',
        fontSize: 9,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {source.type === 'rag' ? 'D' : 'W'}
    </span>
  )
}

export const CitationPill: React.FC<{ source: ChatSource }> = ({ source }) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const popoverId = useId()
  const label = sourceDomainLabel(source)
  const href = sourceHref(source)
  const meta = formatSourceMeta(source)
  const pillText =
    source.type === 'rag' && source.page != null
      ? `${label} · S.${source.page}`
      : label

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const openSource = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <span
      ref={wrapRef}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        title={meta || source.title}
        onClick={event => {
          event.preventDefault()
          if (open && href) {
            openSource()
            return
          }
          setOpen(value => !value)
        }}
        style={pillStyle}
      >
        <SourceIcon source={source} />
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pillText}
        </span>
      </button>

      {open && (
        <span id={popoverId} role="tooltip" style={popoverStyle}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <SourceIcon source={source} />
            {meta || label}
          </span>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                color: '#7eb6ff',
                fontWeight: 700,
                fontSize: '0.92rem',
                lineHeight: 1.35,
                textDecoration: 'none',
                marginBottom: source.snippet ? 6 : 0,
              }}
            >
              {source.title}
            </a>
          ) : (
            <span
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: '0.92rem',
                lineHeight: 1.35,
                marginBottom: source.snippet ? 6 : 0,
              }}
            >
              {source.title}
            </span>
          )}

          {source.snippet ? (
            <span
              style={{
                display: 'block',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {source.snippet.length > 180
                ? `${source.snippet.slice(0, 179).trimEnd()}…`
                : source.snippet}
            </span>
          ) : null}
        </span>
      )}
    </span>
  )
}

export const SourcesToggle: React.FC<{ sources: ChatSource[] }> = ({
  sources,
}) => {
  const [open, setOpen] = useState(false)
  if (sources.length === 0) return null

  const preview = sources.slice(0, 3)

  return (
    <div style={{ marginTop: '0.85rem' }}>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px 6px 8px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '0.88rem',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {preview.map((source, index) => (
            <span
              key={source.id}
              style={{
                marginLeft: index === 0 ? 0 : -4,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.25)',
                background: '#fff',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <SourceIcon source={source} />
            </span>
          ))}
        </span>
        {sources.length} Quellen
      </button>

      {open && (
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {sources.map(source => {
            const href = sourceHref(source)
            const meta = formatSourceMeta(source)
            const body = (
              <>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  <SourceIcon source={source} />
                  {meta || sourceDomainLabel(source)}
                  {source.type === 'rag' ? (
                    <span
                      style={{
                        marginLeft: 2,
                        padding: '1px 6px',
                        borderRadius: 999,
                        background: 'rgba(91,141,239,0.25)',
                        color: '#b7d0ff',
                        fontSize: '0.7rem',
                      }}
                    >
                      RAG
                    </span>
                  ) : (
                    <span
                      style={{
                        marginLeft: 2,
                        padding: '1px 6px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.7rem',
                      }}
                    >
                      Web
                    </span>
                  )}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontWeight: 650,
                    fontSize: '0.95rem',
                    lineHeight: 1.35,
                    color: href ? '#7eb6ff' : '#fff',
                  }}
                >
                  {source.title}
                </span>
                {source.snippet ? (
                  <span
                    style={{
                      display: 'block',
                      marginTop: 4,
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {source.snippet.length > 220
                      ? `${source.snippet.slice(0, 219).trimEnd()}…`
                      : source.snippet}
                  </span>
                ) : null}
              </>
            )

            return href ? (
              <a
                key={source.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {body}
              </a>
            ) : (
              <div
                key={source.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {body}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
