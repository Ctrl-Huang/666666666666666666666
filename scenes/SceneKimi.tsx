
import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { Card3D } from '../components/Card3D';
import { ParticleEmitter } from '../components/ParticleEmitter';
import { Emoji3D } from '../components/Emoji3D';

export const SceneKimi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const rotation = frame * 1;
  const logoScale = spring({ frame, fps, config: { damping: 10 } });

  return (
    <div className="w-full h-full bg-[#020005] flex items-center justify-center overflow-hidden relative">
      <BackgroundDecor theme="tech" />
      <ParticleEmitter type="float" color="#00ffcc" count={150} />
      
      {/* 全息环系统 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        {Array.from({length: 8}).map((_, i) => (
            <div 
                key={i}
                className="absolute border-[2px] border-cyan-500/30 rounded-full"
                style={{
                    width: 800 + i * 300,
                    height: 800 + i * 300,
                    transform: `rotateX(75deg) rotateY(${Math.sin(frame/50)*20}deg) rotateZ(${rotation * (i % 2 ? 1 : -1)}deg)`,
                }}
            />
        ))}
      </div>

      {/* 侧边 3D 悬浮组件 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          <Card3D delay={10} className="absolute left-[5%] top-[15%] w-[600px] h-[350px] p-12">
              <div className="flex justify-between items-center mb-6">
                <div className="text-cyan-400 font-mono text-3xl">AI_NEURAL_NET</div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 animate-ping" />
              </div>
              <div className="space-y-4">
                  {Array.from({length: 3}).map((_, i) => (
                      <div key={i} className="h-4 bg-white/10 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${70 + i * 10}%` }} />
                      </div>
                  ))}
              </div>
              <div className="mt-8 text-white text-5xl font-black italic">多模态全进化</div>
          </Card3D>
          
          <Card3D delay={20} className="absolute right-[5%] bottom-[15%] w-[600px] h-[350px] p-12">
              <div className="text-emerald-400 font-mono text-3xl mb-6 italic">LOGIC_ENGINE_v2.5</div>
              <div className="grid grid-cols-8 gap-3">
                  {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-12 bg-emerald-500/20 rounded-lg border border-emerald-500/30" 
                           style={{ opacity: interpolate(Math.sin(frame/10 + i), [-1, 1], [0.2, 1]) }} />
                  ))}
              </div>
              <div className="mt-8 text-white text-5xl font-black text-right">逻辑推理无敌</div>
          </Card3D>
      </div>

      {/* 装饰表情 */}
      <Emoji3D emoji="🤖" className="left-[20%] bottom-[10%] opacity-80" size={180} />
      <Emoji3D emoji="🧠" className="right-[25%] top-[10%] opacity-80" size={180} />

      {/* 中心 Logo 爆发 */}
      <div className="relative z-[100] flex flex-col items-center">
         <div 
            className="w-[700px] h-[700px] bg-gradient-to-tr from-[#00F2FE] via-[#4FACFE] to-[#00F2FE] rounded-[150px] shadow-[0_0_250px_rgba(79,172,254,1)] flex items-center justify-center relative mb-12 border-[10px] border-white/20"
            style={{ transform: `scale(${logoScale}) rotate(${Math.sin(frame/15)*8}deg)` }}
         >
            <span className="text-white text-[320px] font-black italic drop-shadow-2xl">Kimi</span>
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-[150px]" />
            <ParticleEmitter type="explode" color="#ffffff" count={30} />
         </div>
         
         <div className="relative">
            <h1 className="text-white text-[300px] font-black tracking-tighter [text-shadow:0_0_100px_#00ccff,0_0_200px_#00ccff]">
                革命性登场
            </h1>
            <div className="absolute -bottom-10 left-0 w-full h-4 bg-cyan-500 shadow-[0_0_50px_#00ccff]" />
         </div>
      </div>
    </div>
  );
};
