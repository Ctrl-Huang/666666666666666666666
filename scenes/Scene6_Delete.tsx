
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { ParticleEmitter } from '../components/ParticleEmitter';

export const Scene6_Delete: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isExploded = frame > 35;
  const shake = isExploded && frame < 50 ? Math.random() * 50 - 25 : 0;
  
  const moveUp = spring({ frame, fps, config: { stiffness: 50 } });

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative" style={{ transform: `translate(${shake}px, ${shake}px)` }}>
      {!isExploded ? (
        <div className="flex flex-col items-center">
            <div 
                className="w-96 h-[500px] bg-neutral-700 rounded-3xl border-8 border-neutral-600 relative p-10 flex flex-col items-center shadow-[0_50px_100px_rgba(0,0,0,1)]"
                style={{ transform: `translateY(${(1-moveUp)*1000}px) rotate(${-frame}deg)` }}
            >
                <div className="w-full h-full bg-red-600 rounded-2xl flex items-center justify-center text-white text-9xl font-black">
                    WPS
                </div>
                <div className="mt-8 text-white/50 font-mono text-2xl">TRASH_BIN_READY</div>
            </div>
            <div className="mt-12 text-white text-6xl font-black animate-pulse italic">
                正在彻底抹除旧时代...
            </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-full">
            <ParticleEmitter type="explode" count={200} color="#FFD700" />
            <ParticleEmitter type="explode" count={200} color="#FF4500" />
            
            <div className="z-10 flex flex-col items-center">
                <h1 className="text-[600px] font-black italic text-white drop-shadow-[0_0_100px_#ff0000] rotate-[-5deg]">
                    爽！
                </h1>
                <div className="bg-red-600 text-white text-8xl px-20 py-8 font-black rounded-[50px] mt-[-100px] shadow-2xl">
                    卸载成功 100%
                </div>
            </div>
        </div>
      )}

      {/* Moving Background Grid during deletion */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array.from({length: 20}).map((_, i) => (
              <div key={i} className="h-2 bg-red-500 w-full mb-10" style={{ transform: `translateX(${(frame * (i % 2 ? 10 : -10)) % 100}%)` }} />
          ))}
      </div>
    </div>
  );
};
