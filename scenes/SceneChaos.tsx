
import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SpringBox } from '../components/SpringBox';

// Define explicit interface for Icon props
interface IconProps {
  name: string;
  color: string;
  delay: number;
  // Added key to satisfy TS when component is used in a map within JSX
  key?: React.Key;
}

const Icon = ({ name, color, delay }: IconProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const moveX = interpolate(frame, [0, 240], [Math.random() * 3840, Math.random() * 3840]);
  const moveY = interpolate(frame, [0, 240], [Math.random() * 1600, Math.random() * 1600]);
  const rotate = interpolate(frame, [0, 240], [0, 360]);

  return (
    <div 
      className="absolute p-8 rounded-3xl flex items-center justify-center font-bold text-6xl text-white shadow-2xl"
      style={{ 
        backgroundColor: color, 
        left: moveX, 
        top: moveY,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.8
      }}
    >
      {name}
    </div>
  );
};

export const SceneChaos: React.FC = () => {
  const icons = [
    { name: "WPS", color: "#FF4D4F" },
    { name: "Excel", color: "#21A366" },
    { name: "PPT", color: "#D24726" },
    { name: "Word", color: "#2B579A" },
    { name: "DOCX", color: "#2B579A" },
    { name: "XLSX", color: "#21A366" },
  ];

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden relative">
      {/* Fixed: Use explicit prop assignment to satisfy TypeScript's strictness with the 'key' reserved property */}
      {Array.from({ length: 40 }).map((_, i) => {
        const iconData = icons[i % icons.length];
        return (
          // Add comment: Fix TS error by ensuring 'key' is handled correctly in the component's props definition
          <Icon 
            key={i} 
            name={iconData.name} 
            color={iconData.color} 
            delay={i * 2} 
          />
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-md p-20 rounded-[80px] border border-white/10">
            <h2 className="text-white text-[100px] font-bold text-center">
                嘿，兄弟姐妹们！
            </h2>
        </div>
      </div>
    </div>
  );
};
