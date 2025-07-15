import React from 'react'
import { Link } from 'react-router-dom'
import { container, impresumstyle } from './styles'

export const Footer: React.FC = () => {
  return (
    <footer style={{ ...container, zIndex: 9999}}>
      <Link to='/impresum' style={{ ...impresumstyle, textDecoration: 'underline' }}>
        Impresum
      </Link>
    </footer>
  );
}