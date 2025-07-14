import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

// Global styles
const globalStyles = `
  body,
  #root {
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background: #212121;
    color: #ececf1;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  input {
    font-family: inherit;
  }

  @media (max-width: 600px) {
    .chat-input-bar-fixed .input-bar,
    .input-bar {
      width: 98vw;
      max-width: 98vw;
    }
    
    /* Ensure input elements don't overflow on mobile */
    input[type="text"] {
      font-size: 16px !important; /* Prevents zoom on iOS */
      max-width: 100%;
    }
    
    /* Ensure buttons stay visible on mobile */
    button {
      min-width: 44px; /* Minimum touch target size */
      min-height: 44px;
    }
  }
`

// Inject global styles
const styleElement = document.createElement('style')
styleElement.textContent = globalStyles
document.head.appendChild(styleElement)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
