import axios from 'axios'

export const getAudioFromText = async (text: string, speakerId: string) => {
  const data = JSON.stringify({
    text: text,
    speaker_id: speakerId,
  })
  const url = 'https://bamborakapi.mudrowak.de/api/tts/'
  const config = {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: data,
    responseType: 'arraybuffer' as const,
  }

  return axios.post(url, data, config)
}
