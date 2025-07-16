
import React, { useEffect, useState } from 'react';
import {
  wabjenjeStyle,
  imageStyle,
} from './styles';

import Lucija1 from '../../assets/lucija.png';
import Lucija2 from '../../assets/lucija.png';
import Lucija3 from '../../assets/lucija.png';
import Lucija4 from '../../assets/lucija.png';
import Lucija5 from '../../assets/lucija.png';
import Digiserb1 from '../../assets/digiserb.png';
import Digiserb2 from '../../assets/digiserb.png';
import Digiserb3 from '../../assets/digiserb.png';
import Digiserb4 from '../../assets/digiserb.png';
import Digiserb5 from '../../assets/digiserb.png';

// Arrays of 5 different images and links for each state
const page1images = [Digiserb1, Digiserb2, Digiserb3, Digiserb4, Digiserb5];
const page2images = [Lucija1, Lucija2, Lucija3, Lucija4, Lucija5];
const page1links = [
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
  'https://digiserb.de/de/',
];
const page2links = [
  'https://www.lucija.de/',
  'https://www.lucija.de/',
  'https://www.lucija.de/',
  'https://www.lucija.de/',
  'https://www.lucija.de/',
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