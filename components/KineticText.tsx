
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface KineticTextProps {
  text: string;
  startFrame: number;
  duration: number;
  style?: "bold" | "glow" | "crazy" | "neon" | "inflated" | "glitch";
}

export const KineticText: React.FC<KineticTextProps> = ({ text, startFrame, duration, style = "bold" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame - startFrame;
  if (time < 0 || time > duration) return null;

  const opacity = interpolate(time, [0, 5, duration - 5, duration], [0, 1, 1, 0]);
  const s = spring({
    frame: time,
    fps,
    config: { damping: 10, stiffness: 150 }
  });

  const scale = style === 'inflated' 
    ? interpolate(Math.sin(time / 5), [-1, 1], [1, 1.1]) * s
    : interpolate(s, [0, 1], [0.5, 1.2]);

  const styleClasses = {
    bold: "text-[320px] font-black text-white drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]",
    glow: "text-[350px] font-black text-white drop-shadow-[0_0_80px_#00ffcc] [text-shadow:8px_8px_0px_#00ccff]",
    crazy: "text-[380px] font-black text-yellow-400 italic tracking-tighter [text-shadow:15px_15px_0px_#ff0000] -rotate-3",
    neon: "text-[350px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_40px_#ff00ff]",
    inflated: "text-[400px] font-black text-white [text-shadow:0_10px_0_#ccc,0_20px_0_#bbb,0_30px_0_#aaa,0_40px_50px_rgba(0,0,0,0.5)]",
    glitch: "text-[380px] font-black text-white relative mix-blend-difference"
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]"
      style={{ opacity, transform: `scale(${scale})` }}
    >
      {style === 'glitch' ? (
        <div className="relative">
           <h1 className={`${styleClasses.glitch} translate-x-1 text-red-500`}>{text}</h1>
           <h1 className={`${styleClasses.glitch} absolute inset-0 -translate-x-1 text-cyan-500 opacity-70`}>{text}</h1>
           <h1 className={`${styleClasses.glitch} absolute inset-0 text-white`}>{text}</h1>
        </div>
      ) : (
        <h1 className={`${styleClasses[style]} text-center leading-none italic`}>{text}</h1>
      )}
    </div>
  );
};
