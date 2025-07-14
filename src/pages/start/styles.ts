export const startScreenStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}

export const welcomeTitleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 600,
  color: '#ececf1',
  marginBottom: '2.5rem',
  textAlign: 'center',
}

export const inputBarWrapperStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '0.5rem',
}

export const inputBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '1.2rem',
  boxShadow: '0 2px 16px 0 #00000020',
  padding: '0.25rem 0.5rem',
  width: '480px',
  maxWidth: 'calc(90vw - 2rem)',
  gap: '0.25rem',
  minWidth: '0',
  flexShrink: 0,
}

export const chatInputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  color: '#ececf1',
  fontSize: '1.1rem',
  padding: '1rem 0.75rem',
  outline: 'none',
  borderRadius: '1rem',
  minWidth: '0',
  maxWidth: '100%',
}

export const inputIconStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#b4bcd0',
  fontSize: '1.25rem',
  padding: '0.5rem',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'background 0.15s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '44px',
  minHeight: '44px',
  flexShrink: 0,
}

export const sendIconStyle: React.CSSProperties = {
  ...inputIconStyle,
  color: '#fff',
  background: '#10a37f',
  marginLeft: '0.3rem',
  fontSize: '1.3rem',
  flexShrink: 0,
}
