import { getConfig } from './server'

export const DEFAULT_PERSONA_ID = 'main'
/** Bamborak voice used when a persona has none of its own. */
export const DEFAULT_SPEAKER_ID = 'katka_2025_07'

/**
 * The persona is a deployment setting (VITE_PERSONA / window._env_).
 * `?persona=` stays available so a single deployment can be used for testing.
 * Unknown ids are accepted here and resolved server-side.
 */
export function getPersonaId(search = window.location.search): string {
  const fromQuery = new URLSearchParams(search).get('persona')?.trim()

  if (fromQuery) return fromQuery

  const fromEnv = String(getConfig('VITE_PERSONA') ?? '').trim()
  if (fromEnv && !fromEnv.startsWith('__')) return fromEnv

  return DEFAULT_PERSONA_ID
}
