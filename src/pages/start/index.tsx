import React, { useEffect, useState } from 'react'
import {
  startScreenStyle,
  welcomeTitleStyle,
  inputBarWrapperStyle,
} from './styles'
import ChatInput from '../../components/chat-input'

const starttilearray: { title: string}[] = [
  { title: 'Witaj, rjenje zo sy tu' },
  { title: 'Moin Mišter' },
  { title: 'Budź chaweleny Jězus Chrystus!' },
  { title: 'Dobry dźen, što chceš wědźeć?' },
  { title: 'Halo, što leži Tebi na wutrobje?' },
]

const fadeDuration = 500;

const StartScreen: React.FC<{
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
}> = ({ input, onInputChange, onSend, onInputKeyDown, isLoading = false }) => {
  const [titleIdx, setTitleIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTitleIdx(idx => (idx + 1) % starttilearray.length);
        setFade(true);
      }, fadeDuration);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={startScreenStyle}>
      <style>{`
        .welcome-fade {
          transition: opacity ${fadeDuration}ms;
          opacity: 1;
        }
        .welcome-fade.hide {
          opacity: 0;
        }
      `}</style>
      <div
        style={welcomeTitleStyle}
        className={`welcome-fade${fade ? '' : ' hide'}`}
      >
        {starttilearray[titleIdx].title}
      </div>
      <div style={inputBarWrapperStyle}>
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          onKeyDown={onInputKeyDown}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default StartScreen
