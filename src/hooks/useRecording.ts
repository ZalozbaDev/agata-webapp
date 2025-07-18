import { useState, useRef } from 'react'
import { Settings } from '../types/settings'
import { typedVoskResponse } from '../helper/vosk'
import { handleSuccess } from '../components/audio-recorder/audio-recorder/handler/handle-success'
import { initWebsocket } from '../components/audio-recorder/audio-recorder/handler/init-websocket'
import SERVER_CONFIG from '../config/server'

export const useRecording = (
  settings: Settings,
  selectedMicrophone: MediaDeviceInfo | null,
  options: {
    timeOffsetRef: React.RefObject<number>
    setInputText: (cb: (prev: string[]) => string[]) => void
    setTranslation: (cb: (prev: any[]) => any[]) => void
    audioContext: {
      playAudioData: (data: ArrayBuffer) => Promise<void>
    }
  }
) => {
  const [isRecording, setIsRecording] = useState(false)
  const [voskResponse, setVoskResponse] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  let processor: AudioWorkletNode
  let source: MediaStreamAudioSourceNode
  let context: AudioContext

  // Replace local variable with a ref to persist the websocket
  const webSocketRef = useRef<WebSocket | null>(null)

  const onReceiveMessage = async (event: MessageEvent) => {
    console.log('Received message from WebSocket:', event.data)
    if (event.data) {
      let parsed = typedVoskResponse(event.data)
      setVoskResponse(parsed.listen)
      if (parsed.text && !parsed.text.includes('whisper-Korla-whisper')) {
        const trimmedText = parsed.text.slice(2, -2).trim()
        if (trimmedText.length <= 0) return
        options.setInputText(prev => [...prev, trimmedText])
      }
    }
  }

  const onStopRecording = () => {
    webSocketRef.current?.send('{"eof" : 1}')
    webSocketRef.current?.close()

    processor?.port.close()
    source?.disconnect(processor)
    context?.close()

    if (stream?.active) {
      stream.getTracks().forEach(track => track.stop())
    }

    setIsRecording(false)
  }

  const startRecordingWithNewStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          autoGainControl: false,
          noiseSuppression: false,
          echoCancellation: false,
          channelCount: 1,
          sampleRate: settings.sampleRate,
          sampleSize: 16,
          deviceId: selectedMicrophone?.deviceId,
        },
        video: false,
      })
      .then(stream => {
        setStream(stream)
        setIsRecording(true)

        if (stream !== null) {
          handleSuccess(
            stream,
            settings.sampleRate,
            webSocketRef.current!,
            settings.bufferSize,
            (p: AudioWorkletNode) => {
              processor = p
            },
            (s: MediaStreamAudioSourceNode) => {
              source = s
            },
            (c: AudioContext) => {
              context = c
            },
            onStopRecording
          )
        }
      })
      .catch(error => {})
  }

  const startRecording = async () => {
    try {
      webSocketRef.current = initWebsocket(
        SERVER_CONFIG.VOSK_URL,
        (e: MessageEvent<any>) => onReceiveMessage(e)
      )

      if (!webSocketRef.current) {
        console.error('WebSocket connection failed')
        throw new Error('WebSocket connection failed')
      }

      webSocketRef.current.onopen = () => {
        try {
          console.log('WebSocket connection established')
          webSocketRef.current?.send(
            `sample_rate=${settings.sampleRate},buffer_size=${settings.bufferSize}`
          )
          startRecordingWithNewStream()
        } catch (error) {
          console.error('Error accessing microphone:', error)
        }
      }

      webSocketRef.current.onerror = () => {
        console.error('WebSocket error occurred2')
        breakRecording('stop')
      }
    } catch (error) {
      console.error('Error creating audio record:', error)
    }
  }

  const breakRecording = (newState: 'stop' | 'pause') => {
    console.log('breakRecording', newState)
    if (isRecording) {
      onStopRecording()
    }
  }

  return {
    isRecording,
    voskResponse,
    stream,
    setVoskResponse,
    startRecording,
    breakRecording,
    onReceiveMessage,
  }
}
