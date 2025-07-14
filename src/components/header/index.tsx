import React from 'react'
import {
  headerStyle,
  headerLeftStyle,
  headerRightStyle,
  profileCircleStyle,
} from './styles'

const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <div style={headerLeftStyle}>AGATA</div>
      <div style={headerRightStyle}>
        {/* Placeholder for user/profile icon */}
        <div style={profileCircleStyle}>F</div>
      </div>
    </header>
  )
}

export default Header
