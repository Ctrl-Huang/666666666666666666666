
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerRoot, Composition } from 'remotion';
import App from './App';
import { Video } from './Video';

/**
 * 1. Remotion Root for Studio/CLI
 * Using registerRoot + Composition is the standard way in Remotion 4.
 */
const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Video"
        component={Video}
        durationInFrames={60 * 34} // 34 seconds
        fps={60}
        width={3840}
        height={2160}
      />
    </>
  );
};

// This registers the project with Remotion Studio
registerRoot(RemotionRoot);

/**
 * 2. Browser Preview UI
 * Renders the custom Player interface when viewed as a standard web page.
 */
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
