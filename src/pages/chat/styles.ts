export const chatScreenStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  maxWidth: '100vw',
  background: '#212121',
  borderRadius: 0,
  boxShadow: 'none',
  padding: 0,
  alignItems: 'center',
}

export const messagesWrapperStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '0 0 0 0',
  width: '100%',
  maxWidth: '800px',
  scrollbarWidth: 'none', // Hide scrollbar in Firefox
  // To hide scrollbar in WebKit browsers, add this to your CSS:
  // .messagesWrapper::-webkit-scrollbar { display: none; }
  // Remove alignItems: 'center' to make messages align left/right
}

export const inputBarWrapperStyle: React.CSSProperties = {
  width: '100%',
  position: 'sticky',
  bottom: 0,
  background: '#212121',
  zIndex: 20,
}
