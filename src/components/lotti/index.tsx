import React, { useRef, useEffect, useState } from 'react'
import { Viseme } from '../../types/bamborak'

// Import PNG images for different mouth positions
import mjezwoce from './wobrazy/mjezwoco.png'
import woci_wocinjene from './wobrazy/woci_wocinjene.png'
import woci_zacinjene from './wobrazy/woci_zacinjene.png'
import brjowcki from './wobrazy/browcki1.png'
import brjowcki2 from './wobrazy/browcki2.png'
import closedImg from './wobrazy/closed.png'
import aImg from './wobrazy/a.png'
import eImg from './wobrazy/e.png'
import iImg from './wobrazy/i.png'
import oImg from './wobrazy/o.png'
import uImg from './wobrazy/u.png'
import mImg from './wobrazy/m.png'
import fImg from './wobrazy/f.png'
import sImg from './wobrazy/s.png'
import thImg from './wobrazy/th.png'
import lImg from './wobrazy/l.png'
import nImg from './wobrazy/n.png'
import kImg from './wobrazy/k.png'
import gImg from './wobrazy/g.png'
import neutralImg from './wobrazy/neutral.png'
import Lottie from 'lottie-react'
import puppetAnimation from './puppet-mouth.json'

import { WociMikanje } from '../woci-mikanje'

const mouthFramesImage = {
  closed: closedImg,
  a: aImg,
  e: eImg,
  i: iImg,
  o: oImg,
  u: uImg,
  m: mImg,
  f: fImg,
  s: sImg,
  th: thImg,
  l: lImg,
  n: nImg,
  k: kImg,
  g: gImg,
  neutral: neutralImg,
}

interface TalkingPuppetProps {
  audioFile: string
  visemes?:
    | Viseme[]
    | { visemes: Viseme[]; duration?: number; sampleRate?: number }
  duration?: number
}

const TalkingPuppet: React.FC<TalkingPuppetProps> = ({
  audioFile,
  visemes,
  duration = 0,
}) => {
  const [isCentered, setIsCentered] = useState(false)
  // Handle viseme data structure - it might be an object with visemes property or direct array
  const visemesArray = React.useMemo(() => {
    if (!visemes) return []
    if (Array.isArray(visemes)) return visemes
    if (
      typeof visemes === 'object' &&
      'visemes' in visemes &&
      Array.isArray(visemes.visemes)
    ) {
      return visemes.visemes
    }
    return []
  }, [visemes])

  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentViseme, setCurrentViseme] = useState<string>('closed')
  const animationFrameRef = useRef<number | undefined>(undefined)
  const isPlayingRef = useRef<boolean>(false)
  const [showPlayButton, setShowPlayButton] = useState<boolean>(false)
  const lottieRef = useRef<any>(null)

  // Eyebrow animation state
  const [eyebrowFrame, setEyebrowFrame] = useState<'brjowcki' | 'brjowcki2'>(
    'brjowcki'
  )
  const [eyesFrame, setEyesFrame] = useState<
    'woci_wocinjene' | 'woci_zacinjene'
  >('woci_wocinjene')

  // Natural random blinking effect
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout | null = null
    let blinkDurationTimeout: NodeJS.Timeout | null = null

    const startBlinking = () => {
      // Random delay between 2 and 6 seconds
      const nextBlink = Math.random() * 4000 + 10000
      blinkTimeout = setTimeout(() => {
        setEyesFrame('woci_zacinjene') // closed eyes
        blinkDurationTimeout = setTimeout(() => {
          setEyesFrame('woci_wocinjene') // open eyes
          startBlinking() // schedule next blink
        }, 200) // blink lasts 200ms
      }, nextBlink)
    }

    startBlinking()
    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout)
      if (blinkDurationTimeout) clearTimeout(blinkDurationTimeout)
    }
  }, [])

  // Natural random blinking effect
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout | null = null
    let blinkDurationTimeout: NodeJS.Timeout | null = null

    const startBlinking = () => {
      // Random delay between 2 and 6 seconds
      const nextBlink = Math.random() * 5000 + 2000
      blinkTimeout = setTimeout(() => {
        setEyebrowFrame('brjowcki2') // closed eyes
        blinkDurationTimeout = setTimeout(() => {
          setEyebrowFrame('brjowcki') // open eyes
          startBlinking() // schedule next blink
        }, 200) // blink lasts 200ms
      }, nextBlink)
    }

    startBlinking()
    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout)
      if (blinkDurationTimeout) clearTimeout(blinkDurationTimeout)
    }
  }, [])

  // Map viseme types to animation frames
  const visemeToFrame = (visemeType: string): number => {
    switch (visemeType.toLowerCase()) {
      case 'closed':
      case 'sil':
        return 0
      case 'a':
      case 'aa':
      case 'ah':
      case 'hh':
        return 1 // Wide open mouth for 'a' sound
      case 'e':
      case 'ee':
      case 'eh':
      case 'ey':
        return 1 // Semi-open mouth for 'e' sound
      case 'i':
      case 'iy':
        return 2 // Slightly open for 'i' sound
      case 'o':
      case 'oo':
      case 'oh':
      case 'ow':
        return 2 // Rounded lips for 'o' sound
      case 'u':
      case 'uw':
        return 3 // Tight rounded lips for 'u' sound
      case 'm':
      case 'b':
      case 'p':
        return 3 // Closed lips for 'm', 'b', 'p' sounds
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
      case 'rr':
        return 18 // Tongue position for 'l', 'r' sounds
      case 'n':
      case 'd':
      case 't':
        return 10 // Tongue to alveolar ridge for 'n', 'd', 't' sounds
      case 'k':
      case 'kk':
      case 'g':
      case 'gg':
        return 6 // Back of tongue to soft palate for 'k', 'g' sounds
      default:
        return 12 // Neutral mouth position
    }
  }

  // Control mouth position based on current viseme
  useEffect(() => {
    if (lottieRef.current) {
      const targetFrame = visemeToFrame(currentViseme)
      console.log(lottieRef.current)
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
  // Map viseme types to image paths
  const visemeToName = (visemeType: string) => {
    switch (visemeType.toLowerCase()) {
      case 'closed':
      case 'sil':
      case 'rest':
        return mouthFramesImage.closed
      case 'a':
      case 'aa':
      case 'ah':
      case 'hh':
        return mouthFramesImage.a // Wide open mouth for 'a' sound
      case 'e':
      case 'ee':
      case 'eh':
      case 'ey':
      case 'y':
      case 'yy':
        return mouthFramesImage.e // Semi-open mouth for 'e' sound
      case 'i':
      case 'iy':
        return mouthFramesImage.i // Slightly open for 'i' sound
      case 'o':
      case 'oo':
      case 'oh':
      case 'ow':
        return mouthFramesImage.o // Rounded lips for 'o' sound
      case 'u':
      case 'uw':
        return mouthFramesImage.u // Tight rounded lips for 'u' sound
      case 'm':
      case 'b':
      case 'p':
      case 'mm':
        return mouthFramesImage.m // Closed lips for 'm', 'b', 'p' sounds
      case 'f':
      case 'v':
      case 'ff':
        return mouthFramesImage.f // Lower lip to upper teeth for 'f', 'v' sounds
      case 's':
      case 'z':
      case 'sh':
      case 'zh':
      case 'ss':
        return mouthFramesImage.s // Slightly open with teeth showing for 's' sounds
      case 'th':
        return mouthFramesImage.th // Tongue between teeth for 'th' sound
      case 'l':
      case 'r':
      case 'rr':
      case 'll':
        return mouthFramesImage.l // Tongue position for 'l', 'r' sounds
      case 'n':
      case 'd':
      case 't':
      case 'nn':
        return mouthFramesImage.n // Tongue to alveolar ridge for 'n', 'd', 't' sounds
      case 'k':
      case 'g':
      case 'gg':
      case 'kk':
        return mouthFramesImage.k // Back of tongue to soft palate for 'k', 'g' sounds
      case 'ww':
        return mouthFramesImage.m // 'ww' is similar to 'm' - rounded lips
      default:
        console.log('Unknown viseme type:', visemeType)
        return mouthFramesImage.neutral
    }
  }

  const animateMouthWithVisemes = () => {
    if (!isPlayingRef.current || visemesArray.length === 0) {
      return
    }

    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    // Use the actual audio currentTime instead of Date.now()
    const currentTimeSeconds = audioElement.currentTime

    // Find the current viseme based on timing
    let activeViseme = visemesArray.find(
      (viseme: Viseme) =>
        currentTimeSeconds >= viseme.startTime &&
        currentTimeSeconds <= viseme.endTime
    )

    if (activeViseme && activeViseme.viseme !== currentViseme) {
      setCurrentViseme(activeViseme.viseme)
    } else if (!activeViseme && currentViseme !== 'closed') {
      // If no active viseme found, default to closed
      setCurrentViseme('closed')
    }

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(animateMouthWithVisemes)
  }

  const handlePlay = () => {
    isPlayingRef.current = true
    animateMouthWithVisemes()
  }

  const handlePause = () => {
    isPlayingRef.current = false
    setCurrentViseme('closed')
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const handleEnded = () => {
    isPlayingRef.current = false
    setCurrentViseme('closed')
    setShowPlayButton(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const handleManualPlay = () => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.play().catch(error => {
        console.warn('Manual play failed:', error)
      })
      setShowPlayButton(false)
    }
  }

  const handleTimeUpdate = () => {
    // This ensures the mouth animation updates even when the audio is paused/resumed
    // and helps maintain sync during playback
    if (isPlayingRef.current && visemesArray.length > 0) {
      const audioElement = audioRef.current
      if (!audioElement) return

      const currentTimeSeconds = audioElement.currentTime

      // Find the current viseme based on timing
      let activeViseme = visemesArray.find(
        (viseme: Viseme) =>
          currentTimeSeconds >= viseme.startTime &&
          currentTimeSeconds <= viseme.endTime
      )

      if (activeViseme && activeViseme.viseme !== currentViseme) {
        setCurrentViseme(activeViseme.viseme)
      } else if (!activeViseme && currentViseme !== 'closed') {
        // If no active viseme found, default to closed
        setCurrentViseme('closed')
      }
    }
  }

  // Set up audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('pause', handlePause)
    audioElement.addEventListener('ended', handleEnded)
    audioElement.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('pause', handlePause)
      audioElement.removeEventListener('ended', handleEnded)
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [visemesArray])

  // Auto-play when audioFile is available
  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement && audioFile) {
      console.log('Audio file received:', audioFile)
      // Reset to beginning and play
      audioElement.currentTime = 0

      // Ensure audio is loaded before playing
      if (audioElement.readyState >= 2) {
        // HAVE_CURRENT_DATA
        console.log('Audio ready, attempting to play...')
        audioElement.play().catch(error => {
          console.warn('Auto-play failed:', error)
          // Auto-play might be blocked by browser policy, show play button
          setShowPlayButton(true)
        })
      } else {
        // Wait for audio to load
        console.log('Waiting for audio to load...')
        const handleCanPlay = () => {
          console.log('Audio can play, attempting to start...')
          audioElement.play().catch(error => {
            console.warn('Auto-play failed:', error)
            setShowPlayButton(true)
          })
          audioElement.removeEventListener('canplay', handleCanPlay)
        }
        audioElement.addEventListener('canplay', handleCanPlay)
      }
    }
  }, [audioFile])

  return (
    <WociMikanje isCentered={isCentered} setIsCentered={setIsCentered}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'block',
        }}
      >
        {/* Display the current viseme image */}
        <img
          src={mjezwoce}
          alt={`Mouth position: ${currentViseme}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onError={e => {
            console.warn(`Failed to load image for viseme: ${currentViseme}`)
            const target = e.target as HTMLImageElement
            target.src = mouthFramesImage.neutral
          }}
        />
        <img
          src={eyebrowFrame === 'brjowcki' ? brjowcki : brjowcki2}
          alt={`Eyebrows frame: ${eyebrowFrame}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onError={e => {
            console.warn(`Failed to load eyebrow image: ${eyebrowFrame}`)
            const target = e.target as HTMLImageElement
            target.src = brjowcki
          }}
        />
        <img
          src={eyesFrame === 'woci_wocinjene' ? woci_wocinjene : woci_zacinjene}
          alt={`Mouth position: ${currentViseme}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onError={e => {
            console.warn(`Failed to load image for viseme: ${currentViseme}`)
            const target = e.target as HTMLImageElement
            target.src = mouthFramesImage.neutral
          }}
        />
        <img
          key={currentViseme}
          src={visemeToName(currentViseme)}
          alt={`Mouth position: ${currentViseme}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
          }}
          onError={e => {
            console.warn(`Failed to load image for viseme: ${currentViseme}`)
            const target = e.target as HTMLImageElement
            target.src = mouthFramesImage.neutral
          }}
        />
        <audio ref={audioRef} src={audioFile} style={{ display: 'none' }} />
      </div>
    </WociMikanje>
  )
}

export default TalkingPuppet
