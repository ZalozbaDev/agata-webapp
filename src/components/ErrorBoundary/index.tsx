import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            background: '#212121',
            color: '#ececf1',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          }}
        >
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 142, 0.05) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#ff6b6b',
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                margin: '0 0 12px 0',
                fontSize: '24px',
                fontWeight: '600',
                color: '#ff6b6b',
              }}
            >
              Něšto je so wopak wutwariło
            </h2>
            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: '16px',
                color: '#b0b0b0',
                lineHeight: 1.5,
              }}
            >
              Njewočakowany zmylk je so w nałoženju wutwarił. Spytaj stronu
              aktualizować abo staj so z techniskim podpěrom do zwiska.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = 'translateY(-1px)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              Stonu aktualizować
            </button>
            {this.state.error && (
              <details
                style={{
                  marginTop: '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#888',
                }}
              >
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Zmylkowe podrobnosće
                </summary>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '12px',
                    borderRadius: '6px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
