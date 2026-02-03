
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Character } from '../components/Character';

export const Scene1_Empathy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconCount = 15;
  const icons = Array.from({ length: iconCount }).map((_, i) => {
    const startFrame = i * 5;
    const progress = (frame - startFrame) / 60;
    const y = interpolate(progress, [0, 1], [800, -200], { extrapolateLeft: 'clamp' });
    const x = 500 + Math.sin(i * 100) * 1000;
    const scale = interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });
    return { x, y, scale, id: i };
  });

  return (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <Character expression="stressed" className="scale-[2.5]" />
      
      {icons.map(icon => (
        <div 
          key={icon.id}
          className="absolute bg-red-500 text-white font-bold p-6 rounded-2xl shadow-xl text-4xl"
          style={{ 
            left: icon.x, 
            top: icon.y, 
            transform: `scale(${icon.scale}) rotate(${icon.id * 45}deg)`,
            opacity: icon.scale 
          }}
        >
          WPS
        </div>
      ))}

      <div className="absolute bottom-20 text-white text-[120px] font-black italic">
        你们有没有过那种感觉？
      </div>
    </div>
  );
};
