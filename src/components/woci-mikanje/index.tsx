import { useState, useEffect } from 'react'
import woci0 from '../../assets/woci-mikanje/woci0.png'
import woci1 from '../../assets/woci-mikanje/woci1.png'
import woci2 from '../../assets/woci-mikanje/woci2.png'
import woci3 from '../../assets/woci-mikanje/woci3.png'
import woci4 from '../../assets/woci-mikanje/woci4.png'
import woci5 from '../../assets/woci-mikanje/woci5.png'
import woci6 from '../../assets/woci-mikanje/woci6.png'

const wociImages = [woci0, woci1, woci2, woci3, woci4, woci5, woci6]

export const WociMikanje = ({
  isCentered,
  setIsCentered,
  children,
}: {
  isCentered: boolean
  setIsCentered: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isForward, setIsForward] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (isForward) {
          if (prevIndex === wociImages.length - 1) {
            setIsForward(false)
            return prevIndex - 1
          }
          return prevIndex + 1
        } else {
          if (prevIndex === 0) {
            setIsPaused(true)
            setTimeout(() => {
              setIsPaused(false)
              setIsForward(true)
            }, 2000)
            return 0
          }
          return prevIndex - 1
        }
      })
    }, 80)

    return () => clearInterval(interval)
  }, [isForward, isPaused, isCentered])

  // Animation styles
  const containerStyle = isCentered
    ? {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
        width: '70%',
        height: '70%',
        transition: 'all 0.5s cubic-bezier(.4,2,.6,.6)',
        cursor: 'pointer',
      }
    : {
        position: 'fixed' as const,
        bottom: 0,
        right: 0,
        zIndex: 2000,
        width: 300,
        height: 300,
        transition: 'all 0.5s cubic-bezier(.4,2,.6,.6)',
        cursor: 'pointer',
      }

  const imgStyle = isCentered
    ? {
        width: 450,
        height: 'auto',
        display: 'block',
        transition: 'all 0.5s cubic-bezier(.4,2,.6,.6)',
      }
    : {
        width: 300,
        height: 'auto',
        display: 'block',
        transition: 'all 0.5s cubic-bezier(.4,2,.6,.6)',
      }

  const handleClick = () => setIsCentered(c => !c)

  return (
    <div style={containerStyle} onClick={handleClick}>
      {/* <img
        src={wociImages[currentIndex]}
        alt={`Woci ${currentIndex}`}
        style={imgStyle}
      /> */}
      {children}
    </div>
  )
}
