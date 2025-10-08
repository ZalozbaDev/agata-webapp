
import React, { useEffect, useState } from 'react';
import {
  wabjenjeStyle,
  imageStyle,
  textstyle,
} from './styles';

import Lucija from '../../assets/logos/01 Logo LUCIJA - 150px.png';
import Digiserb from '../../assets/logos/02 Logo DIGISERB - 150px.png';
import Bamborak from '../../assets/logos/03 Logo BAMBORAK - 150px.png';
import SerbskiCaptioner from '../../assets/logos/04 Logo WEBCAPTIONER - 150px.png';
import Ocr from '../../assets/logos/05 OCR - 150px.png';
import Eather from'../../assets/logos/06 eatherpad.png';
import ScanText from '../../assets/logos/07 Beta scan Text.png';
import pucnik from '../../assets/logos/08 Pucnik digitalny swet.png';
import workadventure from '../../assets/logos/09 Workadventure.png';
import slp from '../../assets/logos/10 Gaussia.png';

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
  'https://www.sorbib.de/ocr',
];

export const Wabjenje: React.FC = () => {
  // 0: page1, 1: page2, 2: text page
  const textParts = [
    'Kak budźe jutře w Budyšinje wjedro?',
    'Hdy su njedźelu w Chrósćicach kemše?',
    'Kotre serbske zarjadowanja su kónctydźenja?',
    'Powjedaj mi bajku!',
    'Rjek mi rjany žort!',
  ];

  const [pageOrder, setPageOrder] = useState(() => {
    // Randomize at mount
    return shuffleArray([0, 1, 2]);
  });
  const [pageIdx, setPageIdx] = useState(0);
  const [fade, setFade] = useState(false);

  // Fisher-Yates shuffle
  function shuffleArray(array: number[]) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Store previous order to avoid immediate repeat
  const prevOrderRef = React.useRef<number[] | null>(null);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let swapTimeout: NodeJS.Timeout;

    const startCycle = () => {
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setFade(false);
        setPageIdx((prevIdx) => {
          if (prevIdx === pageOrder.length - 1) {
            // End of cycle, randomize next order (avoid immediate repeat)
            setPageOrder((oldOrder) => {
              let newOrder;
              let tries = 0;
              do {
                newOrder = shuffleArray([0, 1, 2]);
                tries++;
              } while (prevOrderRef.current && newOrder.join() === prevOrderRef.current.join() && tries < 10);
              prevOrderRef.current = oldOrder;
              return newOrder;
            });
            return 0;
          }
          return prevIdx + 1;
        });
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

  let content;
  const currentPage = pageOrder[pageIdx];
  if (currentPage === 2) {
    // Show all text parts in the same layout as images
    content = (
      <div style={wabjenjeStyle} className="wabjenje-stack">
        {tops.map((top, idx) => (
          <div
            key={idx}
            style={{...textstyle, top, opacity: fade ? 0 : 1,}}
          >
            <span style={{padding: '0.5rem', lineHeight: 1.2}}>{textParts[idx]}</span>
          </div>
        ))}
      </div>
    );
  } else {
    const images = currentPage === 1 ? page2images : page1images;
    const links = currentPage === 1 ? page2links : page1links;
    const alts = currentPage === 1
      ? ['Lucija 1','Lucija 2','Lucija 3','Lucija 4','Lucija 5']
      : ['Digiserb 1','Digiserb 2','Digiserb 3','Digiserb 4','Digiserb 5'];
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
  }

  return content;
};