
import React, { useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';

export const AssetLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Waiting for fonts and assets'));

  useEffect(() => {
    // 模拟等待字体加载和所有 DOM 准备就绪
    document.fonts.ready.then(() => {
      console.log('Fonts loaded, starting render...');
      continueRender(handle);
    });
  }, [handle]);

  return <>{children}</>;
};
