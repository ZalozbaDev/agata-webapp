import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeMap = {
    small: 12,
    medium: 16,
    large: 20,
  }

  const dotSize = sizeMap[size]

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }

  const dotStyle: React.CSSProperties = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    borderRadius: '50%',
    backgroundColor: '#ececf1',
    animation: 'loadingDots 1.4s infinite ease-in-out',
  }

  const dot1Style: React.CSSProperties = {
    ...dotStyle,
    animationDelay: '0s',
  }

  const dot2Style: React.CSSProperties = {
    ...dotStyle,
    animationDelay: '0.2s',
  }

  const dot3Style: React.CSSProperties = {
    ...dotStyle,
    animationDelay: '0.4s',
  }

  const dot4Style: React.CSSProperties = {
    ...dotStyle,
    animationDelay: '0.6s',
  }

  return (
    <>
      <style>
        {`
          @keyframes loadingDots {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={dot1Style}></div>
        <div style={dot2Style}></div>
        <div style={dot3Style}></div>
        <div style={dot4Style}></div>
      </div>
    </>
  )
}

export default LoadingSpinner
