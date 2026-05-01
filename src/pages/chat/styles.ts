export const chatScreenStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 98px)', // 100vh - header height (50px) - spacer height (48px)
  width: '95vw',
  maxWidth: '800px',
  // background: 'rgba(255, 255, 255, 0.3)',
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
  textShadow: '5px 5px 10px rgba(0, 0, 0, 0.8)',

  scrollbarWidth: 'none', // Hide scrollbar in Firefox
  // To hide scrollbar in WebKit browsers, add this to your CSS:
  // .messagesWrapper::-webkit-scrollbar { display: none; }
  // Remove alignItems: 'center' to make messages align left/right
}

export const inputBarWrapperStyle: React.CSSProperties = {
  width: '80vw',
  position: 'sticky',
  bottom: 0,
  // background: '#212121',
  zIndex: 20,
}
