import React from 'react';
import {
impresumtitlestyle,
podnadpisma,
pismo,
wotkazy,
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
                  <br />Daniel Zoba
                  <br />social media: Franciska Vcelichowa</p>
      
      
      <h2 style={podnadpisma}>programy, kotrež wužiwamy:</h2>
      <p style={pismo}>sotra / Witaj Sprachzentrum / <a href="https://sotra.app" 
      target="_blank" rel="noopener noreferrer" style={wotkazy} >https://sotra.app</a>
      
      <br /> TTS & STT bamborak / Korla Baier / <a href="https://bamborak.de" 
      target="_blank" rel="noopener noreferrer" style={wotkazy} >https://bamborak.de</a>
      
      <br />TTS mudrowak / Daniel Zoba / <a href="https://bamborak.mudrowak.de" 
      target="_blank" rel="noopener noreferrer" style={wotkazy} >https://bamborak.mudrowak.de</a>
      
      <br />STT webcaptioner / Daniel Zoba / <a href="https://spoznawanje.serbski-inkubator.de" 
      target="_blank" rel="noopener noreferrer"  style={wotkazy} >https://spoznawanje.serbski-inkubator.de</a>
      
      <br />ChatGPT/ OpenAI / <a href="https://openai.com/de-DE/index/chatgpt" 
      target="_blank" rel="noopener noreferrer"  style={wotkazy} >https://openai.com/de-DE/index/chatgpt</a></p>

      <h2 style={podnadpisma}>wosebity dźak za podpěru:</h2>
      <p style={pismo}>Bernhard Baier  
                 <br />*******************</p>
                 <br />
      <h2 style={podnadpisma}>Datenschutzerklärung</h2>
      <br />
      <p style={pismo}>Der Schutz personenbezogener Daten ist uns ein wichtiges Anliegen. Beim Besuch dieser Website werden automatisch technische Informationen wie die IP Adresse, der Zeitpunkt des Zugriffs sowie Angaben zum verwendeten Browser und Betriebssystem verarbeitet. Diese Verarbeitung ist erforderlich, um die Sicherheit und Funktionsfähigkeit der Website zu gewährleisten und die Daten werden nach einer kurzen Aufbewahrungszeit gelöscht.

Die zentrale Funktion dieser Website ist die Möglichkeit, mit einer künstlichen Intelligenz zu chatten. Dafür werden die eingegebenen Texte sowie bei Nutzung der Sprachfunktion auch Sprachaufnahmen verarbeitet und an den Dienst OpenAI übermittelt, damit Antworten erzeugt werden können. Ohne diese Verarbeitung wäre die Nutzung des Chats nicht möglich. Zusätzlich werden anonyme Nutzungsstatistiken erstellt, in denen gezählt wird wie viele Personen die Seite besuchen und wie viele Anfragen gestellt werden. Diese statistischen Informationen enthalten keine personenbezogenen Daten und dienen ausschließlich der Verbesserung des Angebots.

Rechtsgrundlage für die Verarbeitung personenbezogener Daten ist Artikel 6 Absatz 1 Buchstabe b der Datenschutz Grundverordnung, soweit die Verarbeitung für die Erfüllung der angebotenen Dienste erforderlich ist, sowie Artikel 6 Absatz 1 Buchstabe f, da ein berechtigtes Interesse an einem sicheren und funktionierenden Betrieb der Website besteht.

Personenbezogene Daten werden nur solange gespeichert wie dies für die genannten Zwecke erforderlich ist. Chat Inhalte werden nicht dauerhaft gespeichert, sondern ausschließlich zur direkten Kommunikation mit der künstlichen Intelligenz verarbeitet. Anonyme statistische Daten werden ohne Bezug zu einzelnen Personen gesondert gespeichert. Eine Weitergabe personenbezogener Daten an Dritte findet nicht statt, mit Ausnahme der Übermittlung an den Anbieter des KI Dienstes, der die Eingaben verarbeitet, um Antworten zu generieren.

Nutzerinnen und Nutzer haben das Recht auf Auskunft über die gespeicherten Daten, das Recht auf Berichtigung unrichtiger Daten, das Recht auf Löschung oder Einschränkung der Verarbeitung, das Recht auf Widerspruch gegen die Verarbeitung sowie das Recht auf Datenübertragbarkeit. Darüber hinaus besteht ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde, wenn eine Verletzung datenschutzrechtlicher Vorschriften vermutet wird.

Alle Datenübertragungen erfolgen verschlüsselt über HTTPS. Es werden technische und organisatorische Maßnahmen getroffen, um die Sicherheit der Daten zu gewährleisten und sie vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen.</p>
    </div>
  )
}

export default ImpresumPage