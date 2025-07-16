// Types for Bamborak API responses

export interface Viseme {
  viseme: string
  startTime: number
  endTime: number
  intensity?: number
}

export interface BamborakAudioResponse {
  audio: string // base64 encoded audio data
  visemes: Viseme[]
  text: string
  duration: number
  sampleRate: number
}

export interface BamborakVisemesResponse {
  visemes: string[]
  count: number
}

export interface BamborakSpeakersResponse {
  speakers: string[]
  count: number
}

export interface BamborakAudioRequest {
  text: string
  speaker_id: string
}
