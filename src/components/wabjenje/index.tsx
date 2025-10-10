import React, { useEffect, useState } from 'react';
import {
  wabjenjeStyle,
  imageStyle,
  textstyle,
} from './styles';

import {
  updateInputValue
} from '../chat-input/ChatInputController'; // ← Import hinzugefügt

import Lucija from '../../assets/logos/01 Logo LUCIJA - 150px.png';
import Digiserb from '../../assets/logos/02 Logo DIGISERB - 150px.png';
import Bamborak from '../../assets/logos/03 Logo BAMBORAK - 150px.png';
import SerbskiCaptioner from '../../assets/logos/04 Logo WEBCAPTIONER - 150px.png';
import Ocr from '../../assets/logos/05 OCR - 150px.png';
import Eather from '../../assets/logos/06 eatherpad.png';
import ScanText from '../../assets/logos/07 Beta scan Text.png';
import pucnik from '../../assets/logos/08 Pucnik digitalny swet.png';
import workadventure from '../../assets/logos/09 Workadventure.png';
import slp from '../../assets/logos/10 Gaussia.png';
import hornjoserbsce from '../../assets/logos/Icon - Hornjoserbsce.png';
import dolnoserbski from '../../assets/logos/Icon - Dolnoserbski.png';
import nemsce from '../../assets/logos/Icon - nemsce.png';

const page1images = [Lucija, Digiserb, ScanText, Ocr, Bamborak];
const page2images = [Eather, workadventure, slp, pucnik, SerbskiCaptioner];
const page4images = [ScanText, hornjoserbsce, dolnoserbski, nemsce, SerbskiCaptioner];

const page1links = [
  'https://www.lucija.de/',
  'https://digiserb.de/de/',
  'https://spoznawanje.serbski-inkubator.de/',
  'https://www.sorbib.de/ocr',
  'https://bamborak.mudrowak.de/',
];
const page2links = [
  'https://etherpad.serbski-inkubator.de/',
  'https://play.workadventu.re/@/zalozba/berow/prenipospyt',
  'https://gaussia.de/slp/',
  'https://www.yumpu.com/xx/document/read/69582698/pucnik-po-digitalnym-swece',
  'https://spoznawanje.serbski-inkubator.de/dubbing',
];
const page4links = [
  'https://spoznawanje.serbski-inkubator.de/',
  'https://spoznawanje.serbski-inkubator.de/',
  'https://spoznawanje.serbski-inkubator.de/',
  'https://spoznawanje.serbski-inkubator.de/',
  'https://youtu.be/YdJh6-CdVNs',
];

export const Wabjenje: React.FC = () => {
  const textParts = [
    'Zapodaj prašenja a komanda:',
    'Kajke budźe jutře wjedro w Hórkach?',
    'Podaj mi přehlad Božich mšow w Chrósćicach.',
    'Kotre serbske zarjadowanja su kónc tydźenja?',
    'Powědaj mi serbsku bajku.',
  ];

  const pageOrder = [0, 1, 2, 3];
  const [pageIdx, setPageIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let swapTimeout: NodeJS.Timeout;

    const startCycle = () => {
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setFade(false);
        setPageIdx((prevIdx) => (prevIdx === pageOrder.length - 1 ? 0 : prevIdx + 1));
        swapTimeout = setTimeout(startCycle, 10000);
      }, 500);
    };

    const initialTimeout = setTimeout(startCycle, 10000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(swapTimeout);
      clearTimeout(initialTimeout);
    };
  }, []);

  const tops = ['7vh', '25.5vh', '44vh', '62.5vh', '81vh'];
  const currentPage = pageOrder[pageIdx];

  let content;
  if (currentPage === 2) {
    content = (
      <div style={wabjenjeStyle} className="wabjenje-stack">
        {tops.map((top, idx) => (
          <div
            key={idx}
            style={{ ...textstyle, top, opacity: fade ? 0 : 1, cursor: 'pointer' }}
            onClick={() => updateInputValue(textParts[idx])} // ← Klick setzt Text
          >
            <span style={{ padding: '0.5rem', lineHeight: 1.2 }}>
              {textParts[idx]}
            </span>
          </div>
        ))}
      </div>
    );
  } else {
    let images, links;
    if (currentPage === 1) {
      images = page2images;
      links = page2links;
    } else if (currentPage === 3) {
      images = page4images;
      links = page4links;
    } else {
      images = page1images;
      links = page1links;
    }

    content = (
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
  }

  return content;
};
