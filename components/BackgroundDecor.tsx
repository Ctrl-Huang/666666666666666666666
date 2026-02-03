
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const BackgroundDecor: React.FC<{ theme?: 'chaos' | 'tech' }> = ({ theme = 'chaos' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {/* Moving Grid */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(${theme === 'chaos' ? '#ff000022' : '#00ccff22'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'chaos' ? '#ff000022' : '#00ccff22'} 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          transform: `translateY(${(frame % 100)}px) rotate(${theme === 'chaos' ? 5 : -5}deg) scale(1.5)`
        }}
      />
      
      {/* Floating Characters */}
      {Array.from({ length: 20 }).map((_, i) => {
        const top = (i * 123) % height;
        const left = (i * 456) % width;
        const opacity = interpolate(Math.sin((frame + i * 10) / 20), [-1, 1], [0.1, 0.5]);
        const char = ["繁", "忙", "数", "据", "效", "率", "快", "智", "能"][i % 9];
        return (
          <div 
            key={i} 
            className="absolute text-white font-black text-8xl select-none"
            style={{ top, left, opacity, transform: `rotate(${frame + i * 45}deg)` }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};
