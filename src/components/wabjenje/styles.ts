export const wabjenjeStyle: React.CSSProperties = {
    maxWidth: '250px',
    width: '10%',
    height: '100vh',
    position: 'fixed',
    bottom: 0,
    zIndex: 100,
}


export const imageStyle: React.CSSProperties = {
    width: '110px',
    height: '110px',
    objectFit: 'cover',
    position: 'absolute',
    zIndex: 9,
}

export const textstyle: React.CSSProperties = {
    position: 'absolute',
              left: 0,
              width: '100px', // match imageStyle
              height: '100px', // match imageStyle
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1rem',
              textAlign: 'center',
              padding: 0,
              background: 'rgba(7, 22, 43, 0.97)', //nutřkowna barba
              borderRadius: '12px',
              boxShadow: '0 2px 8px #7a7e84ff',
              border: '1px solid #83ccf6ff',
              transition: 'opacity 0.5s',
              overflow: 'hidden',
              zIndex: 9
}