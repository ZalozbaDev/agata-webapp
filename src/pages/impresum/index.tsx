import React from 'react';
import {
impresumtitlestyle,
podnadpisma,
pismo,
}
from './styles';

const ImpresumPage: React.FC = () => {
  return (
    <div>
      <br />
    
      <br />
      <h1 style={impresumtitlestyle}>impresum</h1>
          <br />
      <h2 style={podnadpisma}>sobuskutkowacy:</h2>
      <p style={pismo}>Beno Baier, Feliks Šołta,    
                  <br />Michał Cyž, Jan Breindl
                  <br />social media: Franciska Vcelichowa</p>
      
      
      <h2 style={podnadpisma}>programy, kotrež wužiwamy:</h2>
      <p style={pismo}>sotra / Witaj Sprachzentrum / <a href="https://sotra.app" target="_blank" rel="noopener noreferrer">https://sotra.app</a>
      <br /> TTS bamborak / Korla Baier & Daniel Zoba / <a href="https://bamborak.de" target="_blank" rel="noopener noreferrer">https://bamborak.de</a>
      <br />STT bamborak / Korla Baier / <a href="https://bamborak.de" target="_blank" rel="noopener noreferrer">https://bamborak.de</a>
      <br />STT Inkubator / Daniel Zoba / <a href="https://spoznawanje.serbski-inkubator.de" target="_blank" rel="noopener noreferrer">https://spoznawanje.serbski-inkubator.de</a>
      <br />ChatGPT/ OpenAI / <a href="https://openai.com/de-DE/index/chatgpt" target="_blank" rel="noopener noreferrer">https://openai.com/de-DE/index/chatgpt</a></p>

      <h2 style={podnadpisma}>wosebity dźak za podpěru:</h2>
      <p style={pismo}>Daniel Zoba, Bernhard Baier  
                 <br />****************************</p>
    </div>
  )
}

export default ImpresumPage