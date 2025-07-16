import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import background from './assets/pozadki/HG4.jpg'

// Global styles
const globalStyles = `
  body,
  #root {
    min-height: 100vh;
    margin: 0;
    padding: 0;
    color: #ececf1;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;


  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(3px);
    z-index: -2;
  }

  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 70%, rgba(0, 0, 0, 1) 100%);
    z-index: -1;
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
