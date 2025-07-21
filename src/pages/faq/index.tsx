import React from 'react';
import {
impresumtitlestyle,
podnadpisma,
pismo,
wotkazyFAQ,
}
from './styles';

const FaqPage: React.FC = () => {
  return (
    <div>
      <br />
      <h1 style={impresumtitlestyle}>husto stajene prašenja (FAQ)</h1>
          <br />
      <h2 style={podnadpisma}>Kak aktiwizuju Agatu na šmóratku?</h2>
      <p style={pismo}>Horjeka na prawo w nastajenjach: klikń na "Agata na šmóratku."</p>
          <br />
      <h2 style={podnadpisma}>Njesłyšu Agatu.</h2>
      <p style={pismo}>Pruwuj wótrosć wótřerěčaka na swojim nastroju.</p>
      <br />
      <h2 style={podnadpisma}>Wotmołwy na moje prašenja njejsu prawe!</h2>
      <p style={pismo}>Agata hišće wšitko njewě, wona pak wuknje.</p>
      <br />
      <h2 style={podnadpisma}>Kak hasnu Agatu abo wotkazy?</h2>
      <p style={pismo}>W nastajenjach - horjeka na prawo.</p>
      <br />
      <h2 style={podnadpisma}>Mikrofon njefunguje.</h2>
      <p style={pismo}>Dyrbiš Agaće wužiwanje mikrofona dowolić.</p>
      <br />
      <h2 style={podnadpisma}>Njewidźu tekst wotmołwy.</h2>
      <p style={pismo}>Klikń na mjezwočo Agaty, jelizo pokaza so wosrjedź wobrazowki.</p>
      <br />
      <h2 style={podnadpisma}>Njemóžu wotmołwy čitać, su pře małke.</h2>
      <p style={pismo}>Změn ZOOM faktor wobrazowki, na kompjuteru z STRG +</p>
      <br />

      <h2 style={podnadpisma}>Maš dalše prašenja?<br /> Kontaktěruj nas přez mailku 
      <a style={wotkazyFAQ} href={`mailto:agata@lucija.de`}
      >agata@lucija.de</a></h2>

      <h2 style={{...podnadpisma, color: 'red', fontWeight: '1000'}}>Wutrobny dźak za pokiwy a konstruktiwnu kritiku.</h2>
    </div>
  )
}

export default FaqPage