import React, { useState, useEffect } from 'react';

// SVGs for the cat states, designed to be cute and simple.
const CatBody = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 100 80" className="w-32 h-auto drop-shadow-lg">
    {/* Body */}
    <path d="M 10 80 C 10 40, 90 40, 90 80 Z" fill="#E0E0E0" stroke="#333" strokeWidth="2" />
    {/* Ears */}
    <path d="M 15 45 C 5 25, 35 20, 35 40 Z" fill="#E0E0E0" stroke="#333" strokeWidth="2" />
    <path d="M 85 45 C 95 25, 65 20, 65 40 Z" fill="#E0E0E0" stroke="#333" strokeWidth="2" />
    {/* Face */}
    <circle cx="35" cy="55" r="3" fill="#333" />
    <circle cx="65" cy="55" r="3" fill="#333" />
    <path d="M 45 65 Q 50 70, 55 65" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Keyboard */}
    <path d="M 5 80 H 95 V 90 H 5 Z" fill="#555" transform="translate(0, -5)" />
    <rect x="15" y="76" width="10" height="4" fill="#777" />
    <rect x="30" y="76" width="10" height="4" fill="#777" />
    <rect x="45" y="76" width="10" height="4" fill="#777" />
    <rect x="60" y="76" width="10" height="4" fill="#777" />
    <rect x="75" y="76" width="10" height="4" fill="#777" />
    {children}
  </svg>
);

const IdlePaws = () => (
  <>
    <circle cx="25" cy="80" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" />
    <circle cx="75" cy="80" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" />
  </>
);

const TypingPawLeft = () => (
  <>
    <circle cx="35" cy="72" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" /> {/* Left paw up */}
    <circle cx="75" cy="80" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" /> {/* Right paw down */}
  </>
);

const TypingPawRight = () => (
  <>
    <circle cx="25" cy="80" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" /> {/* Left paw down */}
    <circle cx="65" cy="72" r="8" fill="#E0E0E0" stroke="#333" strokeWidth="2" /> {/* Right paw up */}
  </>
);


interface BongoCatProps {
  isTyping: boolean;
}

export const BongoCat: React.FC<BongoCatProps> = ({ isTyping }) => {
  const [paw, setPaw] = useState(0); // 0 = left, 1 = right

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setPaw(p => (p === 0 ? 1 : 0));
      }, 150); // Fast typing animation
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const Paws = () => {
    if (!isTyping) return <IdlePaws />;
    if (paw === 0) return <TypingPawLeft />;
    return <TypingPawRight />;
  };

  return (
    <div className="absolute bottom-4 right-4 z-50 pointer-events-none select-none opacity-80 hover:opacity-100 transition-opacity">
      <CatBody>
        <Paws />
      </CatBody>
    </div>
  );
};
