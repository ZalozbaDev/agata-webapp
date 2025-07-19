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
      <p style={pismo}>ChatGPT, TTS Bamborak, Sotra.APP  
                 <br />OCR Wito Bejmak, STT Inkubator</p>

      <h2 style={podnadpisma}>wosebity dźak za podpěru:</h2>
      <p style={pismo}>Daniel Zoba, Bernhard Baier  
                 <br />****************************</p>
    </div>
  )
}

export default ImpresumPage