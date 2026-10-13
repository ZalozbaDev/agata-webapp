import type { CSSProperties } from 'react'

export const pageStyle: CSSProperties = {
  margin: '0 auto',
  padding: '20px 24px 32px',
  minHeight: 'calc(100vh - 48px)',
  maxWidth: '100%',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
}

export const headerRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px',
  flexWrap: 'wrap',
}

export const titleStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 600,
  margin: 0,
  color: '#ececf1',
}

export const primaryButtonStyle: CSSProperties = {
  backgroundColor: '#10a37f',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}

export const secondaryButtonStyle: CSSProperties = {
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  border: '1px solid #404040',
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
}

export const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: '#ffb4b4',
  borderColor: '#7a3030',
}

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #3a3a3a',
  borderRadius: '8px',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  fontSize: '14px',
  boxSizing: 'border-box',
  colorScheme: 'dark',
}

export const fieldStyle: CSSProperties = {
  display: 'block',
  marginTop: 16,
}

export const fieldLabelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 600,
  color: '#e6e6ec',
}

export const hintStyle: CSSProperties = {
  display: 'block',
  marginTop: 6,
  color: '#9b9ba4',
  fontSize: 12,
  lineHeight: 1.45,
}

export const cardStyle: CSSProperties = {
  backgroundColor: '#2d2d2d',
  borderRadius: '8px',
  border: '1px solid #404040',
  padding: '16px',
}

export const tableWrapStyle: CSSProperties = {
  backgroundColor: '#2d2d2d',
  borderRadius: '8px',
  overflowX: 'auto',
  border: '1px solid #404040',
  maxWidth: '100%',
}

export const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

export const thStyle: CSSProperties = {
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  padding: '12px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 600,
  borderBottom: '1px solid #404040',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

export const tdStyle: CSSProperties = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#ececf1',
  verticalAlign: 'middle',
  borderBottom: '1px solid #404040',
  whiteSpace: 'nowrap',
}

export const actionButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  padding: '6px 10px',
  fontSize: '12px',
  whiteSpace: 'nowrap',
  lineHeight: 1.2,
}

export const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  padding: '16px',
}

export const dialogStyle: CSSProperties = {
  width: 'min(680px, 100%)',
  maxHeight: '90vh',
  overflowY: 'auto',
  background: '#2a2a2a',
  border: '1px solid #3c3c3c',
  borderRadius: '16px',
  padding: '24px 28px 20px',
  boxSizing: 'border-box',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
}

export const noticeStyle: CSSProperties = {
  background: '#3a2a1a',
  color: '#ffd7a8',
  border: '1px solid #6a4a22',
  borderRadius: '6px',
  padding: '10px 12px',
  marginBottom: '16px',
}

export const successStyle: CSSProperties = {
  background: '#16362c',
  color: '#b7f0d8',
  border: '1px solid #1f6b4f',
  borderRadius: '6px',
  padding: '10px 12px',
  marginBottom: '16px',
}

export const errorStyle: CSSProperties = {
  background: '#3a1c1c',
  color: '#ffb4b4',
  border: '1px solid #7a3030',
  borderRadius: '6px',
  padding: '10px 12px',
  marginBottom: '16px',
}
