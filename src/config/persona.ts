import { getConfig } from './server'

export const DEFAULT_PERSONA_ID = 'agata'

/**
 * The persona is a deployment setting (VITE_PERSONA / window._env_).
 * `?persona=` stays available so a single deployment can be used for testing.
 * Unknown ids are accepted here and resolved server-side.
 */
export function getPersonaId(): string {
  const fromQuery = new URLSearchParams(window.location.search)
    .get('persona')
    ?.trim()

  if (fromQuery) return fromQuery

  const fromEnv = String(getConfig('VITE_PERSONA') ?? '').trim()
  if (fromEnv && !fromEnv.startsWith('__')) return fromEnv

  return DEFAULT_PERSONA_ID
}
