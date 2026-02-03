
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ParticleEmitter: React.FC<{ count?: number; color?: string; type?: 'explode' | 'float' }> = ({ 
  count = 50, 
  color = "#00CCFF",
  type = 'explode' 
}) => {
  const frame = useCurrentFrame();
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const randomDir = Math.sin(i * 999);
        const velocity = 10 + Math.random() * 20;
        
        let x, y, opacity, scale;

        if (type === 'explode') {
          const dist = interpolate(frame, [0, 60], [0, 1500 * velocity / 20]);
          x = 1920 + Math.cos(angle) * dist;
          y = 800 + Math.sin(angle) * dist;
          opacity = interpolate(frame, [40, 60], [1, 0], { extrapolateLeft: 'clamp' });
          scale = interpolate(frame, [0, 60], [2, 0.5]);
        } else {
          // Floating background particles
          x = (i * 1234 + frame * (2 + randomDir)) % 3840;
          y = (i * 5678 + frame * (1 + Math.cos(i))) % 1600;
          opacity = 0.3 + Math.sin(frame / 20 + i) * 0.2;
          scale = 0.5 + Math.random();
        }

        return (
          <div 
            key={i}
            className="absolute rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            style={{
              width: 20 * scale,
              height: 20 * scale,
              backgroundColor: color,
              left: x,
              top: y,
              opacity,
              transform: `rotate(${frame * 5}deg)`
            }}
          />
        );
      })}
    </div>
  );
};
