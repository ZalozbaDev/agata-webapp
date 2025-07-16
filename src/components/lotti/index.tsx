import React, { useRef, useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import puppetAnimation from './puppet-mouth.json'
import { Viseme } from '../../types/bamborak'

interface TalkingPuppetProps {
  audioFile: string
  visemes?: Viseme[]
  duration?: number
}

const TalkingPuppet: React.FC<TalkingPuppetProps> = ({
  audioFile,
  visemes = [],
  duration = 0,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentViseme, setCurrentViseme] = useState<string>('closed')
  const lottieRef = useRef<any>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(0)

  // Map viseme types to animation frames
  const visemeToFrame = (visemeType: string): number => {
    switch (visemeType.toLowerCase()) {
      case 'closed':
      case 'sil':
        return 0
      case 'a':
      case 'aa':
      case 'ah':
        return 32 // Wide open mouth for 'a' sound
      case 'e':
      case 'eh':
      case 'ey':
        return 24 // Semi-open mouth for 'e' sound
      case 'i':
      case 'iy':
        return 28 // Slightly open for 'i' sound
      case 'o':
      case 'ow':
        return 20 // Rounded lips for 'o' sound
      case 'u':
      case 'uw':
        return 16 // Tight rounded lips for 'u' sound
      case 'm':
      case 'b':
      case 'p':
        return 8 // Closed lips for 'm', 'b', 'p' sounds
      case 'f':
      case 'v':
        return 12 // Lower lip to upper teeth for 'f', 'v' sounds
      case 's':
      case 'z':
      case 'sh':
      case 'zh':
        return 16 // Slightly open with teeth showing for 's' sounds
      case 'th':
        return 14 // Tongue between teeth for 'th' sound
      case 'l':
      case 'r':
        return 18 // Tongue position for 'l', 'r' sounds
      case 'n':
      case 'd':
      case 't':
        return 10 // Tongue to alveolar ridge for 'n', 'd', 't' sounds
      case 'k':
      case 'g':
        return 6 // Back of tongue to soft palate for 'k', 'g' sounds
      default:
        return 12 // Neutral mouth position
    }
  }

  const animateMouthWithVisemes = () => {
    if (!isPlaying || visemes.length === 0) return

    const currentTime = Date.now() - startTimeRef.current
    const currentTimeSeconds = currentTime / 1000

    // Find the current viseme based on timing
    let activeViseme = visemes.find(
      viseme =>
        currentTimeSeconds >= viseme.startTime &&
        currentTimeSeconds <= viseme.endTime
    )

    if (activeViseme && activeViseme.type !== currentViseme) {
      setCurrentViseme(activeViseme.type)
      console.log(
        'Current viseme:',
        activeViseme.type,
        'at time:',
        currentTimeSeconds
      )
    }

    animationFrameRef.current = requestAnimationFrame(animateMouthWithVisemes)
  }

  const handlePlay = () => {
    setIsPlaying(true)
    startTimeRef.current = Date.now()
    animateMouthWithVisemes()
  }

  const handlePause = () => {
    setIsPlaying(false)
    setCurrentViseme('closed')
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentViseme('closed')
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  // Set up audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('pause', handlePause)
    audioElement.addEventListener('ended', handleEnded)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('pause', handlePause)
      audioElement.removeEventListener('ended', handleEnded)
    }
  }, [visemes])

  // Control mouth position based on current viseme
  useEffect(() => {
    if (lottieRef.current) {
      const targetFrame = visemeToFrame(currentViseme)

      try {
        if (lottieRef.current.goToAndStop) {
          lottieRef.current.goToAndStop(targetFrame, true)
        } else if (lottieRef.current.playSegments) {
          lottieRef.current.playSegments([targetFrame, targetFrame], true)
        }
      } catch (error) {
        console.error('Error controlling Lottie animation:', error)
      }
    }
  }, [currentViseme])

  // Initialize Lottie when component mounts
  useEffect(() => {
    if (lottieRef.current) {
      try {
        lottieRef.current.goToAndStop(0, true)
      } catch (error) {
        console.error('Error initializing Lottie:', error)
      }
    }
  }, [])

  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={puppetAnimation}
        loop={false}
        autoplay={false}
        style={{ width: '100%', height: '100%' }}
        onDOMLoaded={() => {
          console.log('Lottie DOM loaded, setting initial frame')
          if (lottieRef.current) {
            lottieRef.current.goToAndStop(0, true)
          }
        }}
      />
      <audio
        ref={audioRef}
        controls
        src={audioFile}
        style={{ width: '100%', marginTop: '10px' }}
      />
      {/* Debug info */}
      <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
        Status: {isPlaying ? 'Playing' : 'Stopped'} | Viseme: {currentViseme}
        {visemes.length > 0 && ` | Visemes: ${visemes.length}`}
        {duration > 0 && ` | Duration: ${duration.toFixed(1)}s`}
      </div>
      {/* Test buttons for manual viseme testing */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCurrentViseme('closed')}
          style={{ marginRight: '5px', fontSize: '10px' }}
        >
          Closed
        </button>
        <button
          onClick={() => setCurrentViseme('a')}
          style={{ marginRight: '5px', fontSize: '10px' }}
        >
          A
        </button>
        <button
          onClick={() => setCurrentViseme('e')}
          style={{ marginRight: '5px', fontSize: '10px' }}
        >
          E
        </button>
        <button
          onClick={() => setCurrentViseme('m')}
          style={{ marginRight: '5px', fontSize: '10px' }}
        >
          M
        </button>
        <button
          onClick={() => setCurrentViseme('s')}
          style={{ fontSize: '10px' }}
        >
          S
        </button>
      </div>
    </div>
  )
}

export default TalkingPuppet
