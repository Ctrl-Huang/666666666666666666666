
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { ParticleEmitter } from '../components/ParticleEmitter';
import { Emoji3D } from '../components/Emoji3D';

export const Scene0_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { stiffness: 100 } });
  const moveIn = spring({ frame, fps, delay: 10, config: { damping: 12 } });

  return (
    <div className="w-full h-full bg-[#050010] flex items-center justify-center overflow-hidden relative">
      <BackgroundDecor theme="chaos" />
      <ParticleEmitter type="float" color="#ff0088" count={50} />
      <ParticleEmitter type="float" color="#00ccff" count={50} />
      
      {/* 极高密度的漂浮物 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Emoji3D 
          key={i} 
          emoji={['🚀', '🔥', '✨', '💻', '⚡️'][i % 5]} 
          delay={i * 3}
          size={150 + Math.random() * 100}
          className="opacity-60"
          style={{
            left: (i * 267) % width,
            top: (i * 345) % height,
          } as any}
        />
      ))}

      {/* Hero Content */}
      <div className="relative z-[100] flex flex-col items-center">
          <div style={{ transform: `scale(${titleSpring}) rotate(${Math.sin(frame/20)*3}deg)` }} className="relative">
              {/* 多重描边花字 */}
              <h1 className="text-[450px] font-black text-white leading-none italic [text-shadow:10px_10px_0_#ff0088,20px_20px_0_#00ccff,30px_30px_60px_rgba(0,0,0,0.8)]">
                  嘿，兄弟姐妹！
              </h1>
              
              <div 
                className="absolute -top-32 -right-40 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-7xl px-16 py-6 font-black rounded-[60px] rotate-12 shadow-2xl"
                style={{ transform: `scale(${moveIn}) rotate(12deg)` }}
              >
                  K2.5 发布！
              </div>
          </div>
          
          <div className="mt-16 flex gap-16">
              {['王炸归来', '告别繁琐', 'AI 新纪元'].map((word, i) => (
                  <div 
                    key={i} 
                    className="px-20 py-8 bg-white text-black text-6xl font-black rounded-[40px] shadow-[10px_10px_0_#00ccff]"
                    style={{ transform: `translateY(${Math.sin(frame/10 + i)*20}px) skewX(-10deg)` }}
                  >
                      {word}
                  </div>
              ))}
          </div>
      </div>
      
      {/* 底部代码流填充 */}
      <div className="absolute bottom-10 left-10 opacity-20 font-mono text-cyan-400 text-3xl whitespace-pre">
        {Array.from({length: 5}).map((_, i) => (
            <div key={i}>SCANNING_DATA_CLUSTER_{i}... OK</div>
        ))}
      </div>
    </div>
  );
};
