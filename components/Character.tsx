
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type Expression = 'neutral' | 'stressed' | 'crushed' | 'shocked' | 'mystery';

interface CharacterProps {
  expression: Expression;
  className?: string;
}

export const Character: React.FC<CharacterProps> = ({ expression, className = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating animation
  const float = Math.sin(frame / 10) * 10;
  
  const mouthPath = {
    neutral: "M 40 65 Q 50 70 60 65",
    stressed: "M 35 70 Q 50 60 65 70",
    crushed: "M 30 75 Q 50 75 70 75",
    shocked: "M 40 75 A 10 15 0 1 0 60 75 A 10 15 0 1 0 40 75",
    mystery: "M 45 68 L 55 68"
  }[expression];

  const eyeScale = expression === 'shocked' ? 1.5 : 1;

  return (
    <div className={`relative ${className}`} style={{ transform: `translateY(${float}px)` }}>
      <svg width="200" height="200" viewBox="0 0 100 100">
        {/* Head */}
        <circle cx="50" cy="50" r="45" fill="#FFD54F" stroke="#F57F17" strokeWidth="2" />
        
        {/* Eyes */}
        <g style={{ transform: `scale(${eyeScale})`, transformOrigin: 'center' }}>
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            {expression === 'stressed' && (
                <path d="M 30 38 L 40 42 M 60 42 L 70 38" stroke="#333" strokeWidth="2" />
            )}
        </g>

        {/* Mouth */}
        <path d={mouthPath} fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        
        {/* Sweat drops for stressed */}
        {expression === 'stressed' && (
             <circle cx="80" cy="30" r="3" fill="#4FC3F7" className="animate-bounce" />
        )}
      </svg>
    </div>
  );
};
