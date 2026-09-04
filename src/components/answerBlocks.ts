export type AnswerBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }

const HEADING_RE = /^(#{1,6})\s+(.*)$/
const BULLET_RE = /^\s*[-*•]\s+(.*)$/
const ORDERED_RE = /^\s*\d+[.)]\s+(.*)$/

/**
 * Minimal block-level markdown for LLM answers: headings, bullet and numbered
 * lists, paragraphs. Inline markup and citations are handled while rendering.
 */
export function parseAnswerBlocks(content: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = []
  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flushParagraph = () => {
    const text = paragraph.join('\n').trim()
    if (text) blocks.push({ type: 'paragraph', text })
    paragraph = []
  }

  const flushList = () => {
    if (list && list.items.length > 0) {
      blocks.push({ type: 'list', ordered: list.ordered, items: list.items })
    }
    list = null
  }

  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  // "¶" is the legacy paragraph separator used by older answers.
  const lines = content.replace(/¶/g, '\n\n').split('\n')

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      flushAll()
      continue
    }

    const heading = line.match(HEADING_RE)
    if (heading?.[2]) {
      flushAll()
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3
      blocks.push({ type: 'heading', level, text: heading[2].trim() })
      continue
    }

    const bullet = line.match(BULLET_RE)
    if (bullet?.[1] !== undefined) {
      flushParagraph()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(bullet[1].trim())
      continue
    }

    const ordered = line.match(ORDERED_RE)
    if (ordered?.[1] !== undefined) {
      flushParagraph()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(ordered[1].trim())
      continue
    }

    // A plain line right after a list item continues that item.
    if (list && list.items.length > 0) {
      list.items[list.items.length - 1] += ` ${line.trim()}`
      continue
    }

    paragraph.push(line)
  }

  flushAll()
  return blocks
}
