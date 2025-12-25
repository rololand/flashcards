// AudioUnlocker.jsx
import React, { useState } from 'react';
import { unlockAudioContext } from '../utils/audioContextManager';

const AudioUnlocker = () => {
  const [active, setActive] = useState(true);

  const handleUnlock = () => {
    unlockAudioContext();
    setActive(false); // usuwa div po odblokowaniu
  };

  if (!active) return null;

  return (
    <div
      onClick={handleUnlock}
      onTouchStart={handleUnlock}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
    />
  );
};

export default AudioUnlocker;
