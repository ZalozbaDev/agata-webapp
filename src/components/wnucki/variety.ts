export const WNUCKI_HEADER_LIMIT = 10

const STICKER_COLORS = [
  '#f2c14e',
  '#e07a5f',
  '#8fce9a',
  '#7eb6ff',
  '#f4a4c0',
  '#c4b5fd',
  '#f6e7c1',
  '#9ad1d4',
]

/**
 * Travel distance that the tuned durations were chosen for.
 * A longer or shorter header scales the duration so the pace in pixels stays the same.
 */
const REFERENCE_TRAVEL = 1300

/** Seconds for one there-and-back. `pace` is 0 (fastest) to 1 (slowest). */
export function walkDuration(travel: number, pace: number): number {
  const tuned = 34 + pace * 28
  return tuned * (Math.max(travel, 0) / REFERENCE_TRAVEL)
}

/** Stable 0..1 value so a persona keeps its pace and spot across reloads. */
export function variety(seed: string, salt: number): number {
  let hash = salt >>> 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619) >>> 0
  }
  return (hash % 10000) / 10000
}

export function stickerColor(slug: string): string {
  const index = Math.floor(variety(slug, 3) * STICKER_COLORS.length)
  return STICKER_COLORS[index] ?? STICKER_COLORS[0]
}

export function pickerHref(persona: string | null, focus?: string): string {
  const params = new URLSearchParams()
  const current = persona?.trim() ?? ''
  if (current) params.set('persona', current)
  if (focus) params.set('focus', focus)
  const query = params.toString()
  return query ? `/wnucki?${query}` : '/wnucki'
}
