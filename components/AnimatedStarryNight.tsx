import React from 'react';

interface AnimatedStarryNightProps {
  theme: 'light' | 'dark';
}

const LIGHT_GRADIENT = 'linear-gradient(135deg, #A0BCF6 0%, #AFC0F1 20%, #BEC3EB 40%, #CCC7E6 60%, #DBCAE0 80%, #EACEDB 100%)';
const DARK_GRADIENT = 'linear-gradient(135deg, #211C84 0%, #4D55CC 33%, #7A73D1 66%, #B5A8D5 100%)';

// CSS pattern: pastel polka dots (can be swapped for hearts/stars if desired)
const DOT_COLOR_LIGHT = 'rgba(249,168,212,0.25)'; // pastel pink
const DOT_COLOR_DARK = 'rgba(191,162,219,0.18)'; // pastel purple
const PATTERN_LIGHT = `radial-gradient(circle at 10px 10px, ${DOT_COLOR_LIGHT} 6px, transparent 8px),
  radial-gradient(circle at 40px 40px, ${DOT_COLOR_LIGHT} 6px, transparent 8px)`;
const PATTERN_DARK = `radial-gradient(circle at 10px 10px, ${DOT_COLOR_DARK} 6px, transparent 8px),
  radial-gradient(circle at 40px 40px, ${DOT_COLOR_DARK} 6px, transparent 8px)`;

const AnimatedStarryNight: React.FC<AnimatedStarryNightProps> = ({ theme }) => {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-colors duration-1000"
      style={{
        background: theme === 'dark'
          ? DARK_GRADIENT
          : `${LIGHT_GRADIENT}, ${PATTERN_LIGHT}`,
        backgroundSize: theme === 'dark' ? undefined : '48px 48px',
        transition: 'background 1s',
      }}
    />
  );
};

export default AnimatedStarryNight;