import React from 'react'

export interface MessageType {
  role: 'user' | 'assistant'
  content: string
}

// Function to parse Sorbian text formatting and convert to HTML
const parseSorbianText = (text: string): string => {
  return (
    text
      // Convert paragraph breaks (¶) to proper HTML paragraphs
      .split('¶')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('')
      // Convert bold formatting (* * text * *)
      .replace(/\* \* ([^*]+) \* \*/g, '<strong>$1</strong>')
      // Convert italic formatting (_ text _)
      .replace(/_ ([^_]+) _/g, '<em>$1</em>')
      // Convert links [ text ] (url)
      .replace(
        /\[ ([^\]]+) \] \(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #4a9eff; text-decoration: none;">$1</a>'
      )
      // Convert list items (1. text)
      .replace(/(\d+\.\s+)(.+)/g, '<li>$1$2</li>')
      // Wrap consecutive list items in <ul> tags
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      // Convert emoji at the end
      .replace(/┊\s*([^\s]+)$/, '<span style="font-size: 1.2em;">$1</span>')
  )
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

  // Parse the content to convert Sorbian formatting to HTML
  const formattedContent = parseSorbianText(content)

  return (
    <div style={messageStyle}>
      <div
        style={bubbleStyle}
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  )
}

export default Message
