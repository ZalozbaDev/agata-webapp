export const inputBarStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  background: '#212121',
  padding: '1.5rem 1rem 1.5rem 1rem',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 20,
  boxSizing: 'border-box',
}

export const innerInputBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.94)',
  borderRadius: '1.2rem',
  padding: '0.25rem 0.5rem',
  width: '100%',
  maxWidth: '800px',
  gap: '0.25rem',
  minWidth: '0',
  flexShrink: 0,
}

export const chatInputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  color: '#ececf1',
  fontSize: '0.95rem',
  padding: '1rem 0.75rem',
  outline: 'none',
  borderRadius: '1rem',
  minWidth: '0',
  maxWidth: '100%',
}

export const inputIconStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#000000ff',
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
  marginLeft: '0.3rem',
  flexShrink: 0,
}
