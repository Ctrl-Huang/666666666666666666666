
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface SpringBoxProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  config?: any;
}

export const SpringBox: React.FC<SpringBoxProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  config = { stiffness: 100, damping: 10 } 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config,
  });

  return (
    <div className={className} style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
