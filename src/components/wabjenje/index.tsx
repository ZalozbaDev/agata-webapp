
import React, { useEffect, useState } from 'react';
import {
  wabjenjeStyle,
  imageStyle,
} from './styles';

import Lucija from '../../assets/01 Logo LUCIJA - 150px.png';
import Digiserb from '../../assets/02 Logo DIGISERB - 150px.png';
import Bamborak from '../../assets/03 Logo BAMBORAK - 150px.png';
import SerbskiCaptioner from '../../assets/04 Logo WEBCAPTIONER - 150px.png';
import Ocr from '../../assets/05 OCR - 150px.png';
import Eather from'../../assets/06 eatherpad.png';
import ScanText from '../../assets/07 Beta scan Text.png';
import pucnik from '../../assets/08 Pucnik digitalny swet.png';
import workadventure from '../../assets/09 Workadventure.png';
import slp from '../../assets/10 Gaussia.png';

const page2images = [Eather, ScanText, pucnik, workadventure, slp];
const page1images = [Lucija, Digiserb, Bamborak, SerbskiCaptioner, Ocr];
const page2links = [
  'https://etherpad.serbski-inkubator.de/',
  'https://spoznawanje.serbski-inkubator.de/',
  'https://www.yumpu.com/xx/document/read/69582698/pucnik-po-digitalnym-swece',
  'https://play.workadventu.re/@/zalozba/berow/prenipospyt',
  'https://gaussia.de/slp/',
];
const page1links = [
  'https://www.lucija.de/',
  'https://digiserb.de/de/',
  'https://bamborak.mudrowak.de/',
  'https://youtu.be/YdJh6-CdVNs',
  'https://sorbib.de/ocr',
];

export const Wabjenje: React.FC = () => {
  const [showLucija, setShowLucija] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let swapTimeout: NodeJS.Timeout;

    const startCycle = () => {
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setShowLucija((prev) => !prev);
        setFade(false);
        swapTimeout = setTimeout(startCycle, 10000);
      }, 500);
    };

    const initialTimeout = setTimeout(startCycle, 10000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(swapTimeout);
      clearTimeout(initialTimeout);
    };
  }, [showLucija]);

  const tops = ['7vh', '25.5vh', '44vh', '62.5vh', '81vh'];

  const images = showLucija ? page2images : page1images;
  const links = showLucija ? page2links : page1links;
  const alts = showLucija ? ['Lucija 1','Lucija 2','Lucija 3','Lucija 4','Lucija 5'] : ['Digiserb 1','Digiserb 2','Digiserb 3','Digiserb 4','Digiserb 5'];

  return (
    <div style={wabjenjeStyle} className="wabjenje-stack">
      {images.map((imgSrc, idx) => (
        <a
          key={idx}
          href={links[idx]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', position: 'absolute', left: 0, top: tops[idx] }}
        >
          <img
            src={imgSrc}
            alt={alts[idx]}
            style={{
              ...imageStyle,
              top: 0,
              transition: 'opacity 0.5s',
              opacity: fade ? 0 : 1,
            }}
          />
        </a>
      ))}
    </div>
  );
};