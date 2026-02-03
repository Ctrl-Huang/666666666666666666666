
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const Scene8_Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const FeatureBox = ({ title, sub, delay, color }: {title: string, sub: string, delay: number, color: string}) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
    
    return (
        <div 
          className="flex-1 h-full border-r-4 border-white/10 flex flex-col p-16 relative overflow-hidden group"
          style={{ 
              background: `linear-gradient(180deg, ${color}dd, #000)`,
              transform: `scaleX(${s})`,
              transformOrigin: 'left'
          }}
        >
            <div className="relative z-10">
                <span className="text-cyan-400 font-mono text-3xl block mb-4 tracking-[1em]">FEATURE_0{delay/10 + 1}</span>
                <h2 className="text-white text-[100px] font-black mb-2 italic">{title}</h2>
                <p className="text-white/60 text-4xl mb-12 font-bold">{sub}</p>
            </div>

            {/* Simulated UI Widget */}
            <div className="w-full grow bg-black/60 rounded-[40px] border-2 border-white/10 p-12 relative overflow-hidden flex flex-col shadow-inner">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-red-500" />
                        <div className="w-6 h-6 rounded-full bg-yellow-500" />
                        <div className="w-6 h-6 rounded-full bg-green-500" />
                    </div>
                    <div className="px-6 py-2 bg-white/10 rounded-full text-white/50 font-mono text-xl italic">SYSTEM_ACTIVE</div>
                 </div>
                 
                 {/* Decorative Graphs */}
                 <div className="flex items-end gap-2 grow">
                    {Array.from({length: 20}).map((_, i) => {
                        const h = interpolate(Math.sin((frame + i * 5) / 5), [-1, 1], [10, 80]);
                        return <div key={i} className="grow bg-cyan-500/50 rounded-t-lg" style={{ height: `${h}%` }} />
                    })}
                 </div>

                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cyan-500/10 to-transparent" />
                 <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-pulse" style={{ top: `${(frame * 5) % 100}%` }} />
            </div>
            
            {/* Background text filler */}
            <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-white/5 select-none rotate-12">
                {title}
            </div>
        </div>
    )
  }

  return (
    <div className="w-full h-full bg-black flex">
        <FeatureBox title="AI 识图" sub="瞬间解析万物视觉" delay={0} color="#1a1a2e" />
        <FeatureBox title="AI 识视频" sub="视频内容精准提取" delay={10} color="#16213e" />
        <FeatureBox title="全自动 Office" sub="PPT/Excel 一键成片" delay={20} color="#0f3460" />
    </div>
  );
};
