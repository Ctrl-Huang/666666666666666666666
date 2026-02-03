
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Card3DProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Card3D: React.FC<Card3DProps> = ({ children, delay = 0, className = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame - delay;
  const rotateX = Math.sin(time / 20) * 15;
  const rotateY = Math.cos(time / 25) * 20;
  const translateY = Math.sin(time / 15) * 30;
  
  const s = spring({ frame: time, fps, config: { damping: 12 } });

  return (
    <div 
      className={`perspective-[1000px] ${className}`}
      style={{
        transform: `translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${s})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative bg-white/10 backdrop-blur-2xl border-4 border-white/20 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
        {children}
        {/* 3D Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
