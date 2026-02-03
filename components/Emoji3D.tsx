
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Emoji3D: React.FC<{ 
  emoji: string; 
  delay?: number; 
  className?: string; 
  size?: number;
  style?: React.CSSProperties;
}> = ({ emoji, delay = 0, className = "", size = 200, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame - delay;

  const pop = spring({ frame: time, fps, config: { damping: 10, stiffness: 120 } });
  const float = Math.sin(time / 15) * 20;
  const rotateX = Math.sin(time / 20) * 10;
  const rotateY = Math.cos(time / 25) * 15;

  return (
    <div 
      className={`absolute preserve-3d flex items-center justify-center ${className}`}
      style={{
        ...style,
        width: size,
        height: size,
        // Add comment: Casting style to any to prevent TS error 'Property transform does not exist on type {}'
        transform: `${(style as any).transform || ''} translateY(${float}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${pop})`,
        filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.4))`,
      }}
    >
      <div 
        className="text-white flex items-center justify-center"
        style={{ fontSize: size * 0.8 }}
      >
        {emoji}
        {/* Fake 3D depth using text-shadow */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
            textShadow: '2px 2px 0 #000, 4px 4px 0 #000, 6px 6px 0 #000',
            zIndex: -1
        }}>{emoji}</div>
      </div>
    </div>
  );
};
