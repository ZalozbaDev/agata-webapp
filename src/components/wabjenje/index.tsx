import React, { useEffect, useRef, useState } from 'react'
import {
  wabjenjeStyle,
  imageStyle,
} from './styles'

const arraywabjenje: { image: string; link: string }[] = [
  { image: 'https://www.lucija.de/images/logo/logo-Lucija.png', link: 'https://www.youtube.com/@studijoLucija' },
  { image: 'https://i.ytimg.com/vi/NEUwjF9ko0Q/maxresdefault.jpg', link: 'https://www.youtube.com/watch?v=NEUwjF9ko0Q' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Tsar_Bomba_Revised.jpg', link: 'https://de.wikipedia.org/wiki/AN602' },
  { image: 'https://profile-images.xing.com/images/f112eaf259fa9ebf6fb51bcaf66fa104-2/michael-ziesch.1024x1024.jpg', link: 'https://www.youtube.com/@SAEKBautzen' },
];

export const Wabjenje: React.FC = () => {
  const ANIMATION_DURATION = 5; // seconds
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * arraywabjenje.length));
  const prevIdxRef = useRef<number>(currentIdx);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIdx = Math.floor(Math.random() * arraywabjenje.length);
      // Ensure a different image
      while (arraywabjenje.length > 1 && nextIdx === prevIdxRef.current) {
        nextIdx = Math.floor(Math.random() * arraywabjenje.length);
      }
      prevIdxRef.current = nextIdx;
      setCurrentIdx(nextIdx);
    }, ANIMATION_DURATION * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
  @keyframes teleportDown {
    0% { transform: translateY(0vh); }
    100% { transform: translateY(100vh); }
  }
  .animated-image {
    animation: teleportDown ${ANIMATION_DURATION}s linear;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .wabjenje-stack {
    position: relative;
    width: 100%;
    height: 100%;
  }
`}
      </style>
      <div style={{ ...wabjenjeStyle, position: 'relative', overflow: 'hidden', height: '100vh', minHeight: 300 }} className="wabjenje-stack">
        <a
          key={currentIdx}
          href={arraywabjenje[currentIdx].link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ zIndex: 10, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <img
            src={arraywabjenje[currentIdx].image}
            alt={`wabjenje-${currentIdx}`}
            className="animated-image"
            style={imageStyle}
          />
        </a>
      </div>
    </>
  );
};