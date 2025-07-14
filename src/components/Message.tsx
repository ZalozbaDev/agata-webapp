import React from 'react'

export interface MessageType {
  role: 'user' | 'assistant'
  content: string
}

const Message: React.FC<{
  role: 'user' | 'assistant'
  content: string
}> = ({ role, content }) => {
  const messageStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '0.2rem',
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  }

  const bubbleStyle: React.CSSProperties = {
    maxWidth: '70%',
    padding: '1rem 1.2rem',
    borderRadius: '1.2rem',
    fontSize: '1.05rem',
    lineHeight: 1.5,
    ...(role === 'user'
      ? {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#fff',
          borderBottomRightRadius: '0.3rem',
          boxShadow: '0 2px 8px 0 #00000020',
        }
      : {}),
  }

  return (
    <div style={messageStyle}>
      <div style={bubbleStyle}>{content}</div>
    </div>
  )
}

export default Message
