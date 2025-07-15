import { useState, useEffect } from 'react'
import woci0 from '../../assets/woci-mikanje/woci0.png'
import woci1 from '../../assets/woci-mikanje/woci1.png'
import woci2 from '../../assets/woci-mikanje/woci2.png'
import woci3 from '../../assets/woci-mikanje/woci3.png'
import woci4 from '../../assets/woci-mikanje/woci4.png'
import woci5 from '../../assets/woci-mikanje/woci5.png'
import woci6 from '../../assets/woci-mikanje/woci6.png'

const wociImages = [woci0, woci1, woci2, woci3, woci4, woci5, woci6]

export const WociMikanje = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isForward, setIsForward] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (isForward) {
          if (prevIndex === wociImages.length - 1) {
            // Reached the end, start going backwards
            setIsForward(false)
            return prevIndex - 1
          }
          return prevIndex + 1
        } else {
          if (prevIndex === 0) {
            // Reached the beginning, pause before restarting
            setIsPaused(true)
            setTimeout(() => {
              setIsPaused(false)
              setIsForward(true)
            }, 2000) // 2 second pause
            return 0
          }
          return prevIndex - 1
        }
      })
    }, 80) // 80ms between frames for smooth animation

    return () => clearInterval(interval)
  }, [isForward, isPaused])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 1000,
        height: 300,
      }}
    >
      <img
        src={wociImages[currentIndex]}
        alt={`Woci ${currentIndex}`}
        style={{ width: 300, height: 'auto', display: 'block' }}
      />
    </div>
  )
}
