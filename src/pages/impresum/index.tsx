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
      <p style={pismo}>Beno Baier, Felix Šołta</p>
    </div>
  )
}

export default ImpresumPage