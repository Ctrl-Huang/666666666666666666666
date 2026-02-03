
import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { Scene0_Intro } from './scenes/Scene0_Intro';
import { Scene1_Empathy } from './scenes/Scene1_Empathy';
import { Scene2_Pain } from './scenes/Scene2_Pain';
import { Scene3_Boss } from './scenes/Scene3_Boss';
import { Scene6_Delete } from './scenes/Scene6_Delete';
import { SceneKimi } from './scenes/SceneKimi';
import { Scene8_Features } from './scenes/Scene8_Features';
import { KineticText } from './components/KineticText';
import { Character } from './components/Character';
import { AssetLoader } from './components/AssetLoader';

export const Video: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AssetLoader>
      <div className="w-full h-full bg-black font-sans">
        {/* 0:00 - 0:02 | 开场震撼 */}
        <Sequence from={0} durationInFrames={fps * 2}>
          <Scene0_Intro />
        </Sequence>

        {/* 0:02 - 0:05 | 情感切入 */}
        <Sequence from={fps * 2} durationInFrames={fps * 3}>
          <Scene1_Empathy />
          <KineticText text="这种感觉？" startFrame={fps * 2.5} duration={fps * 2} style="glitch" />
        </Sequence>

        {/* 0:05 - 0:10 | 系统崩溃痛点 */}
        <Sequence from={fps * 5} durationInFrames={fps * 5}>
          <Scene2_Pain />
          <KineticText text="谁发明的？" startFrame={fps * 7} duration={fps * 3} style="inflated" />
        </Sequence>

        {/* 0:10 - 0:15 | 夺命消息 */}
        <Sequence from={fps * 10} durationInFrames={fps * 5}>
          <Scene3_Boss />
          <KineticText text="老板消息炸弹" startFrame={fps * 11} duration={fps * 3} style="crazy" />
        </Sequence>

        {/* 0:15 - 0:17 | 崩溃极限 */}
        <Sequence from={fps * 15} durationInFrames={fps * 2}>
           <div className="w-full h-full bg-red-600 flex items-center justify-center overflow-hidden">
              <Character expression="crushed" className="scale-[6]" />
              <KineticText text="周末报销" startFrame={fps * 15} duration={fps * 2} style="glitch" />
           </div>
        </Sequence>

        {/* 0:17 - 0:20 | 准备反击 */}
        <Sequence from={fps * 17} durationInFrames={fps * 3}>
           <div className="w-full h-full bg-black flex items-center justify-center">
              <Character expression="mystery" className="scale-[4]" />
              <KineticText text="我有大招" startFrame={fps * 17.5} duration={fps * 2.5} style="glow" />
           </div>
        </Sequence>

        {/* 0:20 - 0:23 | 爽快删除 */}
        <Sequence from={fps * 20} durationInFrames={fps * 3}>
          <Scene6_Delete />
        </Sequence>

        {/* 0:23 - 0:25 | Kimi K2.5 降临 */}
        <Sequence from={fps * 23} durationInFrames={fps * 2}>
          <SceneKimi />
        </Sequence>

        {/* 0:25 - 0:30 | 核心功能演示 */}
        <Sequence from={fps * 25} durationInFrames={fps * 5}>
          <Scene8_Features />
          <KineticText text="再见 Office" startFrame={fps * 27} duration={fps * 3} style="neon" />
        </Sequence>

        {/* 0:30 - 0:34 | 极致收尾 */}
        <Sequence from={fps * 30} durationInFrames={fps * 4}>
           <div className="w-full h-full bg-emerald-500 flex items-center justify-center relative overflow-hidden">
              <div className="flex gap-40">
                  <Character expression="shocked" className="scale-[5]" />
                  <Character expression="shocked" className="scale-[5]" />
              </div>
              <KineticText text="走起！" startFrame={fps * 30.5} duration={fps * 3.5} style="inflated" />
           </div>
        </Sequence>
      </div>
    </AssetLoader>
  );
};
