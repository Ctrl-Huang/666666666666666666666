
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Video } from './Video';
import { 
  Download, 
  Activity, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle, 
  ShieldCheck, 
  Cpu, 
  Terminal,
  Layers,
  Zap,
  HardDrive
} from 'lucide-react';

const App: React.FC = () => {
  const width = 3840;
  const height = 1600;
  const fps = 60;
  const durationInFrames = 60 * 34;
  
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");
  
  const chunksRef = useRef<Blob[]>([]);

  /**
   * 生产级递归扫描引擎
   */
  const findCanvas = (root: Document | HTMLElement | ShadowRoot): HTMLCanvasElement | null => {
    const canvas = root.querySelector('canvas');
    if (canvas) return canvas;
    const all = root.querySelectorAll('*');
    for (const el of Array.from(all)) {
      if (el.shadowRoot) {
        const found = findCanvas(el.shadowRoot);
        if (found) return found;
      }
      if (el.tagName === 'IFRAME') {
        try {
          const iframeDoc = (el as HTMLIFrameElement).contentDocument || (el as HTMLIFrameElement).contentWindow?.document;
          if (iframeDoc) {
            const found = findCanvas(iframeDoc);
            if (found) return found;
          }
        } catch (e) { /* Cross-origin protection */ }
      }
    }
    return null;
  };

  const startProRender = useCallback(async () => {
    if (!playerRef.current) return;
    
    // 1. 初始化与状态重置
    setError(null);
    setStatus("PRE-ROLLING");
    setIsRendering(true);
    setRenderProgress(0);
    setRenderComplete(false);
    chunksRef.current = [];

    // 2. 预加载：强制跳转并等待
    playerRef.current.pause();
    playerRef.current.seekTo(0);
    await new Promise(r => setTimeout(r, 1200));

    // 3. 画布捕获
    const canvas = findCanvas(document.body);
    if (!canvas) {
      setError("未检测到渲染画布。请确保页面已完全加载并处于 HTTPS 环境。");
      setIsRendering(false);
      return;
    }

    // 4. 编码器选择 (VP9 为 4K 首选)
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm';
    
    try {
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 150000000 // 150Mbps Ultra High Quality
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          setStatus("FINALIZING");
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Kimi_K2.5_4K_ProRender_${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setIsRendering(false);
          setRenderComplete(true);
          setStatus("IDLE");
        };

        // 5. 启动录制流
        setStatus("MASTERING_4K");
        recorder.start();
        playerRef.current.play();

        const monitor = setInterval(() => {
          if (!playerRef.current) return;
          const current = playerRef.current.getCurrentFrame();
          const progress = Math.min(Math.floor((current / durationInFrames) * 100), 100);
          setRenderProgress(progress);

          if (current >= durationInFrames - 1) {
            clearInterval(monitor);
            playerRef.current.pause();
            setStatus("PACKAGING");
            setTimeout(() => recorder.stop(), 1500);
          }
        }, 100);

    } catch (e: any) {
        setError(`渲染引擎报错: ${e.message}`);
        setIsRendering(false);
    }
  }, [durationInFrames, fps]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#000] text-white p-4 md:p-10 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 顶部专业控制栏 */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                <Layers className="w-10 h-10 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                    KIMI <span className="text-cyan-400">STUDIO</span> PRO
                </h1>
                <p className="text-neutral-500 text-xs font-mono tracking-[0.4em] uppercase mt-2 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> 
                    Local Mastering Environment v3.0
                </p>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-xl flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">GPU Accel: ON</span>
            </div>
            <div className="px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Vercel SSL: Active</span>
            </div>
        </div>
      </div>

      {/* 主画布预览区 */}
      <div 
        ref={containerRef}
        className="w-full max-w-7xl aspect-[2.4/1] bg-neutral-950 rounded-[60px] overflow-hidden border border-white/10 relative shadow-2xl group"
      >
        <Player
          ref={playerRef}
          component={Video}
          durationInFrames={durationInFrames}
          compositionWidth={width}
          compositionHeight={height}
          fps={fps}
          style={{ width: '100%', height: '100%' }}
          controls={!isRendering}
          autoPlay
          loop={!isRendering}
        />

        {/* 渲染覆盖层 */}
        {isRendering && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
                <div className="relative">
                    <svg className="w-80 h-80 md:w-[500px] md:h-[500px] rotate-[-90deg]">
                        <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="#111" strokeWidth="20" />
                        <circle 
                            cx="50%" cy="50%" r="42%" fill="transparent" stroke="url(#pro_grad)" strokeWidth="20" 
                            strokeDasharray="1000"
                            strokeDashoffset={1000 * (1 - renderProgress / 100)}
                            className="transition-all duration-300 ease-out"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="pro_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-white text-9xl font-black italic tracking-tighter tabular-nums leading-none">
                            {renderProgress}<span className="text-3xl text-cyan-400 font-normal">%</span>
                        </div>
                        <div className="mt-4 text-cyan-500 font-mono text-sm tracking-[0.5em] uppercase flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {status}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 成功反馈 */}
        {renderComplete && !isRendering && (
            <div className="absolute inset-0 bg-emerald-500 z-[110] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-48 h-48 text-white mb-10 drop-shadow-2xl" />
                <h2 className="text-7xl font-black italic tracking-tighter mb-4 text-white uppercase">Render Complete</h2>
                <p className="text-emerald-100 text-xl font-medium mb-12">4K Ultra HD 视频已成功封装并下载</p>
                <button 
                    onClick={() => setRenderComplete(false)}
                    className="px-16 py-6 bg-white text-emerald-600 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-xl"
                >
                    BACK TO STUDIO
                </button>
            </div>
        )}

        {/* 错误提示 */}
        {error && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md text-white px-10 py-6 rounded-3xl flex items-center gap-6 shadow-2xl z-[120] border border-red-400">
                <AlertTriangle className="w-10 h-10" />
                <div className="text-left">
                    <div className="font-bold text-lg leading-none mb-1">RECORDING_INTERRUPTED</div>
                    <div className="text-sm opacity-80">{error}</div>
                </div>
                <button onClick={() => setError(null)} className="ml-4 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/40 font-bold">DISMISS</button>
            </div>
        )}
      </div>

      {/* 底部功能区 */}
      <div className="w-full max-w-7xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-4 text-neutral-500">
                <HardDrive className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest">Target: LOCAL_DISK_BUFFER</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-500">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest">Processing: 3840x1600 @ 60FPS</span>
            </div>
        </div>

        <div className="flex justify-center">
            <button 
                onClick={startProRender}
                disabled={isRendering}
                className={`
                    group relative px-16 py-10 rounded-[40px] transition-all duration-500 active:scale-95 overflow-hidden
                    ${isRendering 
                        ? 'bg-neutral-900 text-neutral-700 pointer-events-none' 
                        : 'bg-white text-black hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]'}
                `}
            >
                <div className="relative z-10 flex items-center gap-6">
                    {isRendering ? <Loader2 className="w-10 h-10 animate-spin" /> : <PlayCircle className="w-10 h-10" />}
                    <span className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                        {isRendering ? 'Mastering...' : '启动 4K 极清录制'}
                    </span>
                </div>
                {!isRendering && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                )}
            </button>
        </div>

        <div className="text-right hidden md:block">
            <div className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.5em] mb-2">Network Profile</div>
            <div className="text-white font-black italic text-2xl uppercase tracking-tighter">
                Cloud <span className="text-emerald-400">Deployed</span>
            </div>
            <div className="text-neutral-500 text-xs mt-1">Ready for HQ Video Synthesis</div>
        </div>
      </div>
      
      <footer className="mt-16 text-neutral-700 text-[9px] font-mono tracking-[0.6em] uppercase text-center max-w-4xl leading-loose">
        Warning: High performance rendering detected. Do not close browser or switch tabs during mastering process. Optimized for Chromium-based browsers on Vercel Edge Network.
      </footer>
    </div>
  );
};

export default App;
