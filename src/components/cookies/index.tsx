import React, { useState } from 'react';
import {
Titlestyle,
cookiesstyle,
textstyle,
buttonstyle
}
from './styles';
export const Cookies: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);
  if (!visible) return null;
  const handleClick = () => {
    setFade(true);
    setTimeout(() => setVisible(false), 400);
  };
  return (
    <div
      style={{
        ...cookiesstyle,
        opacity: fade ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <h1 style={Titlestyle}>Cookies</h1>
      <div style={textstyle}>
        This website uses cookies to enhance the user experience. By continuing to browse the site, you agree to our use of cookies. <br /> For more information, please refer to our
        <a
          //href="/policy"
          //privacy policy placeholder
          style={{ color: '#2ebcdbff', textDecoration: 'underline' }}
        >
          Privacy Policy
        </a>.
      </div>
      <button
        style={{ ...buttonstyle, backgroundColor: '#a52a2aff' }}
        onClick={handleClick}
      >
        Njeakceptuju
      </button>
      <button
        style={{ ...buttonstyle, backgroundColor: '#4CAF50', left: '64%', }}
        onClick={handleClick}
      >
        Akceptuju
      </button>
    </div>
  );
};