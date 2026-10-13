import type { ChatSource } from '../../services/api'

const SOURCE_REF_RE = /\[\[(S\d+)\]\]|\[(S\d+)\]/g

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

function fileNameFromPath(value: string): string | null {
  const fileName = value.split(/[/\\]/).filter(Boolean).pop()
  return fileName || null
}

export function stripSourceRefs(text: string): string {
  return text.replace(SOURCE_REF_RE, '').replace(/\s{2,}/g, ' ').trim()
}

export function sourceHref(source: ChatSource): string | null {
  if (source.type === 'web' && source.url && isHttpUrl(source.url)) return source.url

  const raw = source.documentUrl || source.url || ''
  if (raw && isHttpUrl(raw)) return raw

  if (source.type === 'rag' && source.documentId) {
    const params = new URLSearchParams({ source: source.documentId })
    return `/datei?${params.toString()}`
  }

  return null
}

export function sourceDomainLabel(source: ChatSource): string {
  const raw = source.documentUrl || ''
  if (raw && !isHttpUrl(raw)) {
    return fileNameFromPath(raw) || source.title.trim() || 'Dokument'
  }
  if (source.domain) {
    return source.domain.replace(/^www\./, '')
  }

  const href = sourceHref(source)
  if (href) {
    try {
      const parsed = new URL(href)
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.hostname.replace(/^www\./, '')
      }
      const fileName = parsed.pathname.split('/').filter(Boolean).pop()
      if (fileName) return fileName
    } catch {
      const fileName = href.split('/').filter(Boolean).pop()
      if (fileName) return fileName
    }
  }

  if (source.type === 'rag') {
    const title = source.title.trim()
    if (title.length <= 18) return title || 'Dokument'
    return `${title.slice(0, 16).trimEnd()}…`
  }

  return source.title.trim() || 'Quelle'
}

/** Compact meta line for RAG: source · date · page */
export function formatSourceMeta(source: ChatSource): string {
  const parts: string[] = []

  if (source.type === 'rag') {
    parts.push(sourceDomainLabel(source))
  } else if (source.domain) {
    parts.push(source.domain.replace(/^www\./, ''))
  }

  if (source.publishedAt) {
    parts.push(formatDisplayDate(source.publishedAt))
  }

  if (source.page != null) {
    parts.push(`Seite ${source.page}`)
  }

  return parts.join(' · ')
}

function formatDisplayDate(value: string): string {
  const isoDay = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDay) {
    return `${isoDay[3]}.${isoDay[2]}.${isoDay[1]}`
  }

  const deDay = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (deDay) {
    return `${deDay[1]}.${deDay[2]}.${deDay[3]}`
  }

  // Keep short ISO timestamps readable
  if (value.includes('T')) {
    return formatDisplayDate(value.slice(0, 10))
  }

  return value
}

export function faviconUrl(source: ChatSource): string | null {
  const domain = source.domain || (() => {
    const href = sourceHref(source)
    if (!href) return null
    try {
      return new URL(href).hostname
    } catch {
      return null
    }
  })()

  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`
}

export type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'citations'; ids: string[] }

/** Split answer text into plain text and citation marker groups.
 * Accepts both [[S1]] and [S1] (models often emit the single-bracket form).
 */
export function parseAnswerParts(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  let lastIndex = 0
  let pendingIds: string[] = []

  const flushCitations = () => {
    if (pendingIds.length === 0) return
    parts.push({ type: 'citations', ids: pendingIds })
    pendingIds = []
  }

  for (const match of content.matchAll(SOURCE_REF_RE)) {
    const index = match.index ?? 0
    const id = match[1] ?? match[2]
    if (!id) continue

    const between = content.slice(lastIndex, index)
    // Keep whitespace before a citation group, but treat adjacent refs as one group.
    if (between.length > 0) {
      flushCitations()
      parts.push({ type: 'text', value: between })
    }

    pendingIds.push(id)
    lastIndex = index + match[0].length
  }

  flushCitations()

  const rest = content.slice(lastIndex)
  if (rest.length > 0) {
    parts.push({ type: 'text', value: rest })
  }

  return parts
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function isSafeHref(url: string): boolean {
  return /^https?:\/\//i.test(url.trim())
}

/** Model output is escaped first, so only the tags added here can reach the DOM. */
export function formatSorbianInlineHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\* \* ([^*]+) \* \*/g, '<strong>$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/_ ([^_]+) _/g, '<em>$1</em>')
    .replace(/\[\s?([^\]]+?)\s?\]\s?\(([^)\s]+)\)/g, (full, label, url) =>
      isSafeHref(url)
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #4a9eff; text-decoration: none;">${label}</a>`
        : full
    )
    .replace(/\n/g, '<br />')
}
