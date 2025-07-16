import axios from 'axios'
import SERVER_CONFIG from '../config/server'
import {
  BamborakAudioResponse,
  BamborakAudioRequest,
  BamborakVisemesResponse,
  BamborakSpeakersResponse,
} from '../types/bamborak'

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

export const getAvailableSpeakers =
  async (): Promise<BamborakSpeakersResponse> => {
    try {
      const response = await bamborakApi.get<BamborakSpeakersResponse>(
        '/api/bamborak/speakers'
      )
      return response.data
    } catch (error) {
      console.error('Error fetching available speakers:', error)
      throw error
    }
  }
