import React from 'react';
import {
Titlestyle,
cookiesstyle,
textstyle
}
from './styles';
export const Cookies: React.FC = () => {
  return (
    <div style={cookiesstyle}>
        <h1 style={Titlestyle}>Cookies</h1>
        <div style={textstyle}>
        This website uses cookies to enhance the user experience. By continuing to browse the site, you agree to our use of cookies. <br/> For more information, please refer to our 
        <a 
        //href="/policy"
        //privacy policy placeholder 
        style={{color: '#2ebcdbff', textDecoration: 'underline'}}>Privacy Policy</a>.
        </div>
    </div>
  )
};