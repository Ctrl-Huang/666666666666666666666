
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Character } from '../components/Character';

export const Scene3_Boss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vibrate = Math.sin(frame) * 15;
  const isWakingUp = frame > 60;
  
  const bgTranslate = spring({ frame: frame - 60, fps, config: { stiffness: 100 } });
  const bgY = interpolate(bgTranslate, [0, 1], [0, -1600]);

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden relative">
      {/* Bed Scene */}
      <div className="absolute inset-0 bg-[#2c3e50] flex flex-col items-center justify-center" style={{ transform: `translateY(${bgY}px)` }}>
         <div className="w-[1200px] h-40 bg-[#34495e] rounded-t-full mt-auto" />
         <Character expression="neutral" className="scale-[2]" />
         <div className="absolute bottom-40 right-40" style={{ transform: `translateX(${vibrate}px)` }}>
            <div className="w-48 h-80 bg-black rounded-[40px] border-4 border-neutral-600 p-4 relative overflow-hidden">
                <div className="absolute top-10 left-0 right-0 p-4 bg-green-500 text-white font-bold rounded-lg m-2 text-xl animate-pulse">
                    老板：做PPT！
                </div>
            </div>
         </div>
      </div>

      {/* Desk Scene (Sliding in) */}
      <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center" style={{ transform: `translateY(${bgY + 1600}px)` }}>
         <div className="w-full h-full flex items-center justify-center flex-col">
            <Character expression="stressed" className="scale-[4]" />
            <div className="mt-20 flex gap-10">
                <div className="p-10 bg-white/10 rounded-3xl border border-white/20 text-white text-6xl font-bold">PPT 分析</div>
                <div className="p-10 bg-white/10 rounded-3xl border border-white/20 text-white text-6xl font-bold">Excel 报表</div>
            </div>
         </div>
      </div>
    </div>
  );
};
