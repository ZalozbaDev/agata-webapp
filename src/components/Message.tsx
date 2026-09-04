import React from 'react'
import type { ChatSource } from '../services/api'
import { parseAnswerBlocks } from './answerBlocks'
import { CitationPill, SourcesToggle } from './citations/CitationControls'
import {
  formatSorbianInlineHtml,
  parseAnswerParts,
} from './citations/sourceHelpers'

export interface MessageType {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  title?: string
  language?: 'hsb' | 'de'
}

const HEADING_FONT_SIZE: Record<1 | 2 | 3, string> = {
  1: '1.25rem',
  2: '1.12rem',
  3: '1.02rem',
}

/** Renders one block of text with citation pills kept inline. */
const InlineContent: React.FC<{
  text: string
  sourceById: Map<string, ChatSource>
}> = ({ text, sourceById }) => (
  <>
    {parseAnswerParts(text).map((part, index) => {
      if (part.type === 'text') {
        return (
          <span
            key={`t-${index}`}
            dangerouslySetInnerHTML={{
              __html: formatSorbianInlineHtml(part.value),
            }}
          />
        )
      }

      return part.ids.map(id => {
        const source = sourceById.get(id)
        if (!source) return null
        return <CitationPill key={`c-${index}-${id}`} source={source} />
      })
    })}
  </>
)

const Message: React.FC<{
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  title?: string
}> = ({ role, content, sources = [], title }) => {
  const messageStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '0.2rem',
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  }

  const bubbleStyle: React.CSSProperties = {
    maxWidth: role === 'assistant' ? '100%' : '70%',
    padding: role === 'user' ? '1rem 1.2rem' : '0.35rem 0.2rem',
    borderRadius: '1.2rem',
    fontSize: '1.05rem',
    lineHeight: 1.5,
    color: '#fff',
    ...(role === 'user'
      ? {
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottomRightRadius: '0.3rem',
          boxShadow: '0 2px 8px 0 #00000020',
          lineBreak: 'anywhere',
        }
      : {}),
  }

  if (role === 'user') {
    return (
      <div style={messageStyle}>
        <div style={bubbleStyle}>{content}</div>
      </div>
    )
  }

  const sourceById = new Map(sources.map(source => [source.id, source]))
  const blocks = parseAnswerBlocks(content)
  // A title above a one-liner is redundant; only structured answers get one.
  const showTitle = Boolean(title?.trim()) && blocks.length > 1

  return (
    <div style={messageStyle}>
      <div style={bubbleStyle}>
        {showTitle && (
          <div
            style={{
              margin: '0 0 0.6rem',
              fontSize: '1.18rem',
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        )}

        <div>
          {blocks.map((block, index) => {
            const spacing = index === 0 ? '0 0 0.7rem' : '0.7rem 0'

            if (block.type === 'heading') {
              return (
                <div
                  key={`h-${index}`}
                  style={{
                    margin: index === 0 ? '0 0 0.5rem' : '1rem 0 0.5rem',
                    fontSize: HEADING_FONT_SIZE[block.level],
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  <InlineContent
                    text={block.text}
                    sourceById={sourceById}
                  />
                </div>
              )
            }

            if (block.type === 'list') {
              const ListTag = block.ordered ? 'ol' : 'ul'
              return (
                <ListTag
                  key={`l-${index}`}
                  style={{ margin: spacing, paddingLeft: '1.4rem' }}
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ margin: '0.25rem 0' }}>
                      <InlineContent text={item} sourceById={sourceById} />
                    </li>
                  ))}
                </ListTag>
              )
            }

            return (
              <p key={`p-${index}`} style={{ margin: spacing }}>
                <InlineContent text={block.text} sourceById={sourceById} />
              </p>
            )
          })}
        </div>

        <SourcesToggle sources={sources} />
      </div>
    </div>
  )
}

export default Message
