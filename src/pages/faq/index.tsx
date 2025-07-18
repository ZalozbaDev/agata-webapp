import React from 'react';
import {
impresumtitlestyle,
podnadpisma,
pismo,
}
from './styles';

const FaqPage: React.FC = () => {
  return (
    <div>
      <br />
      <h1 style={impresumtitlestyle}>husto stajene prašenja (FAQ)</h1>
          <br />
      <h2 style={podnadpisma}>Kak widźu Agatu na šmóratce?</h2>
      <p style={pismo}>W nastajenjach klikujće na "Agata na šmóratku."</p>
          <br />
      <h2 style={podnadpisma}>Njesłyšu Agatu.</h2>
      <p style={pismo}>Hladajće, zo maće zwuk na swojim nastroju.</p>
      <br />
      <h2 style={podnadpisma}>Agata njewě wotmołwu na tute prašenje.</h2>
      <p style={pismo}>Agata njewě wšitko, wona wuknje hišće.</p>
      <br />
      <h2 style={podnadpisma}>Kak hasnu Agatu abo wotkazy?</h2>
      <p style={pismo}>W nastajenjach.</p>
      <br />
      <h2 style={podnadpisma}>Mikrofon njefunguje.</h2>
      <p style={pismo}>Hladajće, zo sće Agaće přistup na mikrofon dali.</p>
      <br />
      <h2 style={podnadpisma}>Njewidźu wotmołwy.</h2>
      <p style={pismo}>Hladajće, zo Agata njeje srjedźa.</p>
      <br />
      <h2 style={podnadpisma}>Wotmołwy njemóžu čitać/ su pře małke.</h2>
      <p style={pismo}>To zaleži na wašim nastroju</p>
      <br />
      <h2 style={podnadpisma}>Njeje so waše prašenje wotmołwiło?<br /> Kontaktěrujeće nas pod emailce <a style={{textDecoration: 'none'}} href={`mailto:agata@lucija.de`}>agata@lucija.de</a></h2>
      <h2 style={{...podnadpisma, color: 'red', fontWeight: '1000'}}>Prošu stajće nam jenož chutne prašenja</h2>
    </div>
  )
}

export default FaqPage