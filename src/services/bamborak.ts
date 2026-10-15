import axios from 'axios'
import SERVER_CONFIG from '../config/server'
import {
  BamborakAudioResponse,
  BamborakAudioRequest,
  BamborakVisemesResponse,
  BamborakSpeaker,
} from '../types/bamborak'

const SPEAKER_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/

// Create axios instance for bamborak API
const bamborakApi = axios.create({
  baseURL: SERVER_CONFIG.BASE_URL,
  timeout: SERVER_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAudioFromText = async (
  text: string,
  speakerId: string
): Promise<BamborakAudioResponse> => {
  const requestData: BamborakAudioRequest = {
    text: text,
    speaker_id: speakerId,
  }

  try {
    const response = await bamborakApi.post<BamborakAudioResponse>(
      '/api/bamborak/audioFromText',
      requestData
    )
    return response.data
  } catch (error) {
    console.error('Error getting audio from text:', error)
    throw error
  }
}

export const getAvailableVisemes =
  async (): Promise<BamborakVisemesResponse> => {
    try {
      const response = await bamborakApi.get<BamborakVisemesResponse>(
        '/api/bamborak/visemes'
      )
      return response.data
    } catch (error) {
      console.error('Error fetching available visemes:', error)
      throw error
    }
  }

export function normalizeBamborakSpeakers(payload: unknown): BamborakSpeaker[] {
  const raw = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === 'object' &&
        Array.isArray((payload as { speakers?: unknown }).speakers)
      ? (payload as { speakers: unknown[] }).speakers
      : []

  const speakers: BamborakSpeaker[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    const speaker = speakerFromUnknown(item)
    if (!speaker || seen.has(speaker.id)) continue
    seen.add(speaker.id)
    speakers.push(speaker)
  }
  return speakers
}

function speakerFromUnknown(item: unknown): BamborakSpeaker | null {
  if (typeof item === 'string') {
    const id = item.trim()
    if (!SPEAKER_ID_PATTERN.test(id)) return null
    return { id, name: id, language: '' }
  }
  if (!item || typeof item !== 'object') return null
  const record = item as { id?: unknown; name?: unknown; language?: unknown }
  const id = typeof record.id === 'string' ? record.id.trim() : ''
  if (!SPEAKER_ID_PATTERN.test(id)) return null
  const name =
    typeof record.name === 'string' && record.name.trim() ? record.name.trim() : id
  const language = typeof record.language === 'string' ? record.language.trim() : ''
  return { id, name, language }
}

export const getAvailableSpeakers = async (): Promise<BamborakSpeaker[]> => {
  try {
    const response = await bamborakApi.get<unknown>('/api/bamborak/speakers')
    return normalizeBamborakSpeakers(response.data)
  } catch (error) {
    console.error('Error fetching available speakers:', error)
    throw error
  }
}
