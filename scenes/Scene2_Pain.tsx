
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Character } from '../components/Character';

export const Scene2_Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const windowCount = Math.min(Math.floor(frame), 80);

  return (
    <div className="w-full h-full bg-[#1a0000] overflow-hidden relative">
      {/* Moving Warning Tapes */}
      <div className="absolute top-0 w-full h-24 bg-yellow-400 flex items-center overflow-hidden z-[60] border-b-8 border-black">
          <div className="flex whitespace-nowrap animate-scroll" style={{ transform: `translateX(${-frame * 10}px)` }}>
              {Array.from({length: 20}).map((_, i) => (
                  <span key={i} className="text-black text-6xl font-black mx-10 italic">WARNING! 太麻烦了! ERROR! 崩溃!</span>
              ))}
          </div>
      </div>
      <div className="absolute bottom-0 w-full h-24 bg-yellow-400 flex items-center overflow-hidden z-[60] border-t-8 border-black">
          <div className="flex whitespace-nowrap animate-scroll" style={{ transform: `translateX(${frame * 10}px)` }}>
              {Array.from({length: 20}).map((_, i) => (
                  <span key={i} className="text-black text-6xl font-black mx-10 italic">OUTDATED SOFTWARE! 效率低下! </span>
              ))}
          </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
         <Character expression="stressed" className="scale-[4] z-50 drop-shadow-[0_0_100px_rgba(255,0,0,0.5)]" />
      </div>

      {Array.from({ length: windowCount }).map((_, i) => {
        const x = (Math.sin(i * 333) * 0.5 + 0.5) * 3840;
        const y = (Math.cos(i * 999) * 0.5 + 0.5) * 1600;
        const s = spring({ frame: frame - i, fps });
        
        return (
          <div 
            key={i}
            className="absolute bg-white border-4 border-black rounded-xl shadow-[20px_20px_0px_rgba(0,0,0,0.2)] overflow-hidden"
            style={{ 
              width: 700, 
              height: 500, 
              left: x - 350, 
              top: y - 250, 
              transform: `scale(${s}) rotate(${i * 5}deg)`,
              zIndex: i 
            }}
          >
            <div className="h-14 bg-neutral-200 border-b-4 border-black flex items-center px-6 justify-between">
                <div className="flex gap-3"><div className="w-5 h-5 bg-red-500 rounded-full border-2 border-black" /><div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-black" /></div>
                <div className="text-xl font-bold text-neutral-800 italic">SYSTEM FAILURE v2026</div>
            </div>
            <div className="p-16 flex flex-col items-center justify-center h-full gap-8">
                <div className="text-8xl">💩</div>
                <div className="text-5xl font-black text-neutral-900 text-center leading-tight">
                    由于过于麻烦<br/>系统已拒绝工作
                </div>
            </div>
          </div>
        );
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none">
          <h2 className="text-white text-[300px] font-black drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] leading-none italic uppercase">
              谁发明的？！
          </h2>
      </div>
    </div>
  );
};
