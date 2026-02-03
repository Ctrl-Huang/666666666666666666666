
import React, { useState, useRef, useCallback } from 'react';
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
   * 增强型递归画布扫描器
   * 特别针对 Remotion Player 的 Shadow DOM 结构进行穿透
   */
  const findCanvas = (root: Document | HTMLElement | ShadowRoot): HTMLCanvasElement | null => {
    // 1. 直接搜索当前层级
    const canvas = (root instanceof HTMLElement || root instanceof Document) 
      ? root.querySelector('canvas') 
      : (root as any).querySelector?.('canvas');
      
    if (canvas) return canvas;

    // 2. 搜索子元素及其 ShadowRoot
    const children = root instanceof Document ? Array.from(root.children) : Array.from(root.querySelectorAll('*'));
    for (const el of children) {
      if (el.shadowRoot) {
        const found = findCanvas(el.shadowRoot);
        if (found) return found;
      }
      // 特殊处理 IFRAME
      if (el.tagName === 'IFRAME') {
        try {
          const iframeDoc = (el as HTMLIFrameElement).contentDocument || (el as HTMLIFrameElement).contentWindow?.document;
          if (iframeDoc) {
            const found = findCanvas(iframeDoc);
            if (found) return found;
          }
        } catch (e) { /* 忽略跨域 Iframe */ }
      }
    }
    return null;
  };

  const startProRender = useCallback(async () => {
    if (!playerRef.current || !containerRef.current) return;
    
    // 1. 初始化
    setError(null);
    setStatus("WARMING_UP");
    setIsRendering(true);
    setRenderProgress(0);
    setRenderComplete(false);
    chunksRef.current = [];

    // 2. 确保播放器处于初始帧并处于活跃状态
    playerRef.current.pause();
    playerRef.current.seekTo(0);
    
    // 关键等待：给渲染器一点时间生成初始像素
    await new Promise(r => setTimeout(r, 2000));

    // 3. 画布深度搜索
    let canvas = findCanvas(containerRef.current);
    
    // 如果在容器内没找到，尝试全局搜索（最后的尝试）
    if (!canvas) {
      canvas = findCanvas(document.body);
    }

    if (!canvas) {
      setError("错误：未能捕获到渲染画布。请检查浏览器是否支持 Canvas 录制或尝试刷新页面。");
      setIsRendering(false);
      return;
    }

    // 4. 环境安全预检
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError("录制功能仅支持 HTTPS 环境（Vercel 默认支持）。");
        setIsRendering(false);
        return;
    }

    // 5. 配置编码器
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
        ? 'video/webm;codecs=vp9,opus' 
        : 'video/webm';
    
    try {
        const stream = (canvas as any).captureStream(fps);
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 100000000 // 100Mbps 兼顾质量与稳定性
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          setStatus("PACKAGING_ASSETS");
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Kimi_K2.5_Master_${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setIsRendering(false);
          setRenderComplete(true);
          setStatus("IDLE");
        };

        // 6. 启动录制流程
        setStatus("MASTERING_4K_STREAM");
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
            setStatus("FLUSHING_BUFFER");
            // 额外延迟 1 秒确保最后一帧被录制
            setTimeout(() => recorder.stop(), 1000);
          }
        }, 100);

    } catch (e: any) {
        setError(`渲染引擎初始化失败: ${e.message}`);
        setIsRendering(false);
    }
  }, [durationInFrames, fps]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#000] text-white p-4 md:p-10 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 顶部标题栏 */}
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
                    High-End Mastering Node
                </p>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Encrypted SSL</span>
            </div>
        </div>
      </div>

      {/* 核心播放器区域 */}
      <div 
        ref={containerRef}
        className="w-full max-w-7xl aspect-[2.4/1] bg-neutral-950 rounded-[60px] overflow-hidden border border-white/10 relative shadow-2xl"
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

        {/* 渲染 UI 层 */}
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

        {/* 成功状态 */}
        {renderComplete && !isRendering && (
            <div className="absolute inset-0 bg-emerald-500 z-[110] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-48 h-48 text-white mb-10 drop-shadow-2xl" />
                <h2 className="text-7xl font-black italic tracking-tighter mb-4 text-white uppercase text-center px-4">Render Successful</h2>
                <button 
                    onClick={() => setRenderComplete(false)}
                    className="px-16 py-6 bg-white text-emerald-600 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-xl"
                >
                    返回控制台
                </button>
            </div>
        )}

        {/* 错误拦截层 */}
        {error && (
            <div className="absolute inset-0 bg-red-600/20 backdrop-blur-md z-[120] flex items-center justify-center p-6">
                <div className="bg-neutral-900 border-2 border-red-500 p-10 rounded-[40px] max-w-2xl shadow-2xl flex flex-col items-center text-center">
                    <AlertTriangle className="w-20 h-20 text-red-500 mb-6" />
                    <h3 className="text-3xl font-black italic text-white mb-4 uppercase">Capture Interrupted</h3>
                    <p className="text-neutral-400 mb-10 leading-relaxed font-medium">{error}</p>
                    <button 
                        onClick={() => setError(null)} 
                        className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xl transition-colors"
                    >
                        重试录制
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* 底部操作区 */}
      <div className="w-full max-w-7xl mt-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-4 text-neutral-500">
                <HardDrive className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-400">Disk Status: Ready</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-500">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-neutral-400">Mastering: 4K @ 60FPS</span>
            </div>
        </div>

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
                    {isRendering ? '录制中...' : '启动 4K 极清录制'}
                </span>
            </div>
            {!isRendering && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
            )}
        </button>

        <div className="text-right hidden md:block">
            <div className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.5em] mb-2">Mastering Engine</div>
            <div className="text-white font-black italic text-2xl uppercase tracking-tighter">
                Vercel <span className="text-emerald-400">Production</span>
            </div>
        </div>
      </div>
      
      <footer className="mt-16 text-neutral-800 text-[9px] font-mono tracking-[0.6em] uppercase text-center max-w-4xl leading-loose">
        Optimal Performance: Use Chrome or Edge. Ensure stable power supply during 4K mastering. v3.1-STABLE
      </footer>
    </div>
  );
};

export default App;
