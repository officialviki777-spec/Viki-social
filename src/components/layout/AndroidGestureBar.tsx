import React from 'react';

interface AndroidGestureBarProps {
  isDark?: boolean;
}

export const AndroidGestureBar: React.FC<AndroidGestureBarProps> = ({ isDark = true }) => {
  return (
    <div
      className={`w-full h-5 flex items-center justify-center select-none pointer-events-none ${
        isDark ? 'bg-zinc-950' : 'bg-white'
      }`}
    >
      <div
        className={`w-32 h-1 rounded-full ${
          isDark ? 'bg-zinc-600/70' : 'bg-zinc-300'
        }`}
      />
    </div>
  );
};
