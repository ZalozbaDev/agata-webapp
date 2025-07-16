
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
import Digiserb1 from'../../assets/02 Logo DIGISERB - 150px.png';
import Digiserb2 from '../../assets/02 Logo DIGISERB - 150px.png';
import Digiserb3 from '../../assets/02 Logo DIGISERB - 150px.png';
import Digiserb4 from '../../assets/02 Logo DIGISERB - 150px.png';
import Digiserb5 from '../../assets/02 Logo DIGISERB - 150px.png';

// Arrays of 5 different images and links for each state
const page2images = [Digiserb1, Digiserb2, Digiserb3, Digiserb4, Digiserb5];
const page1images = [Lucija, Digiserb, Bamborak, SerbskiCaptioner, Ocr];
const page2links = [
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
];
const page1links = [
  'https://www.lucija.de/',
  'https://digiserb.de/de/',
  'https://www.lucija.de/',
  'https://www.lucija.de/',
  'https://2ocr.com/online-ocr-czech/',
];

export const Wabjenje: React.FC = () => {
  const [showLucija, setShowLucija] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let swapTimeout: NodeJS.Timeout;

    const startCycle = () => {
      // Start fade out
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setShowLucija((prev) => !prev);
        setFade(false);
        // After swap, wait 10s, then repeat
        swapTimeout = setTimeout(startCycle, 10000);
      }, 500); // 0.5s fade duration
    };

    // Initial cycle after 10s
    const initialTimeout = setTimeout(startCycle, 10000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(swapTimeout);
      clearTimeout(initialTimeout);
    };
  }, [showLucija]);

  // Top offsets for stacking
  const tops = [50, 184, 318, 452, 586];

  // Choose which set of images/links to use
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