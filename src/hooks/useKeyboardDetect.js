import { useState, useEffect } from 'react';

export default function useKeyboardDetect() {
  const [baseWindowHeight] = useState(window.innerHeight);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  function onResize() {
    setKeyboardOpen(window.innerHeight !== baseWindowHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return keyboardOpen;
}
