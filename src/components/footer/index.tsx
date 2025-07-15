import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { container, link } from './styles'
import { CreateUrlRequest, urlService } from '../../services/urlService'

const Footer: React.FC = () => {
  return (
    <footer style={container}>
      <Link style={link} to='http://b3nnox.de'>
        Twarjene z ❤️ wot b3nnox
      </Link>
    </footer>
  )
}

export default Footer
