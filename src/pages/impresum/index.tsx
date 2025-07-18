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
      <h1 style={impresumtitlestyle}>Impresum</h1>
      <h2 style={podnadpisma}>Sobuskutkowacy:</h2>
      <p style={pismo}>Beno Baier, Feliks Šołta, MiC, Jan Breindl</p>
      <h2 style={podnadpisma}>Programy, kotrež wužiwamy:</h2>
      <p style={pismo}>ChatGPT, Bamborak, Ocr wot Wita Bejmaka, Inkubator</p>
    </div>
  )
}

export default ImpresumPage