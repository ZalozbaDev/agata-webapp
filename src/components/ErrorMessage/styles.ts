export const errorMessageStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '16px',
  marginTop: '16px',
  background:
    'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 142, 0.05) 100%)',
  border: '1px solid rgba(255, 107, 107, 0.2)',
  borderRadius: '12px',
  marginBottom: '12px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.1)',
  animation: 'errorPulse 2s ease-in-out infinite',
}

export const errorIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  background: 'rgba(255, 107, 107, 0.2)',
  color: '#ff6b6b',
  animation: 'iconPulse 2s ease-in-out infinite',
}

export const errorContentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: 0,
}

export const errorTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#ff6b6b',
  margin: 0,
  lineHeight: 1.2,
}

export const errorDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#b0b0b0',
  margin: 0,
  lineHeight: 1.4,
  wordBreak: 'break-word',
}

export const retryButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: '500',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  alignSelf: 'flex-start',
  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
}

// Add CSS animations
const styleElement = document.createElement('style')
styleElement.textContent = `
  @keyframes errorPulse {
    0%, 100% {
      box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
    }
    50% {
      box-shadow: 0 4px 20px rgba(255, 107, 107, 0.2);
    }
  }
  
  @keyframes iconPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
`
document.head.appendChild(styleElement)
