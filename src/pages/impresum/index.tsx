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
      <br />
      <h1 style={impresumtitlestyle}>impresum</h1>
          <br />
      <h2 style={podnadpisma}>sobuskutkowacy:</h2>
      <p style={pismo}>Beno Baier, Feliks Šołta,     <br />Michał Cyž, Jan Breindl</p>
          <br />
      <h2 style={podnadpisma}>programy, kotrež wužiwamy:</h2>
      <p style={pismo}>ChatGPT, TTS Bamborak, Sotra   <br />OCR Wita Bejmaka, STT Inkubator</p>
    </div>
  )
}

export default ImpresumPage