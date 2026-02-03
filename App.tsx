
import React, { useState, useRef, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Video } from './Video';
import { 
  Activity, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle, 
  ShieldCheck, 
  Layers,
  MonitorCheck,
  Zap,
  Maximize
} from 'lucide-react';

const App: React.FC = () => {
  const width = 3840;
  const height = 1600;
  const fps = 60;
  const durationInFrames = 60 * 34;
  
  const playerRef = useRef<PlayerRef>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");
  
  const chunksRef = useRef<Blob[]>([]);

  /**
   * 资深导演级：Mastering Stream Capture
   * 由于 Remotion 是基于 DOM 的，我们使用浏览器原生的 Tab 捕获能力
   * 这种方式可以 1:1 还原 CSS 滤镜、混和模式和 SVG 动画
   */
  const startProMastering = useCallback(async () => {
    if (!playerRef.current) return;
    
    setError(null);
    setStatus("INITIALIZING_CAMERA");
    setIsRendering(true);
    setRenderProgress(0);
    setRenderComplete(false);
    chunksRef.current = [];

    // 1. 强制播放器回零，准备好第一帧
    playerRef.current.pause();
    playerRef.current.seekTo(0);

    try {
        // 2. 引导用户选择“当前页签”进行 4K 捕获
        // 注意：这是目前浏览器录制 HTML/DOM 视频的最稳健方式
        setStatus("WAITING_FOR_USER_PERMISSION");
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: 'browser',
                width: { ideal: width },
                height: { ideal: height },
                frameRate: { ideal: fps }
            } as any,
            audio: false
        });

        // 3. 配置高码率 WebM 编码器 (100Mbps)
        const mimeType = 'video/webm;codecs=vp9';
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 100000000 
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          // 停止所有轨道
          stream.getTracks().forEach(track => track.stop());
          
          setStatus("EXPORTING_MASTER_FILE");
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Kimi_K2.5_Master_4K_${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setIsRendering(false);
          setRenderComplete(true);
          setStatus("IDLE");
        };

        // 4. 倒计时准备，确保录制时 UI 已消失
        setStatus("STABILIZING_STREAM_3");
        await new Promise(r => setTimeout(r, 1000));
        setStatus("STABILIZING_STREAM_2");
        await new Promise(r => setTimeout(r, 1000));
        setStatus("STABILIZING_STREAM_1");
        await new Promise(r => setTimeout(r, 1000));

        // 5. 启动录制与播放
        setStatus("MASTER_RECORDING_ON_AIR");
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
            setTimeout(() => recorder.stop(), 500);
          }
        }, 100);

    } catch (e: any) {
        setError(`Mastering 引擎启动失败: ${e.message || "用户取消了授权"}`);
        setIsRendering(false);
    }
  }, [durationInFrames, fps, width, height]);

  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500 selection:text-white ${isRendering ? 'overflow-hidden cursor-none' : ''}`}>
      
      {/* 仅在非录制状态显示 UI */}
      {!isRendering && !renderComplete && (
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-10 p-6 md:p-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl">
                    <Layers className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                        KIMI <span className="text-cyan-400">STUDIO</span> MASTER
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-mono tracking-[0.4em] uppercase mt-2 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-cyan-500 fill-cyan-500" /> 
                        Pro-Level Programmatic Renderer v3.1
                    </p>
                </div>
            </div>
            <div className="hidden md:flex gap-4">
                <div className="px-4 py-2 bg-neutral-900 border border-white/5 rounded-xl flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Bitrate: 100Mbps</span>
                </div>
                <div className="px-4 py-2 bg-neutral-900 border border-white/5 rounded-xl flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">4K 3840x1600</span>
                </div>
            </div>
        </div>
      )}

      {/* 渲染画布容器 */}
      <div 
        className={`
            relative shadow-2xl transition-all duration-1000 ease-in-out
            ${isRendering ? 'w-full h-screen scale-100 rounded-0 border-0' : 'w-full max-w-[90%] aspect-[2.4/1] bg-neutral-950 rounded-[40px] border border-white/10 overflow-hidden'}
        `}
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
          autoPlay={!isRendering}
          loop={!isRendering}
        />

        {/* 录制覆盖层 - 仅显示在录制开始前 */}
        {isRendering && status.includes("STABILIZING") && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-[200] flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="text-cyan-500 font-mono text-xl tracking-[1em] uppercase mb-8 animate-pulse">Mastering Impending</div>
                <div className="text-[200px] font-black italic text-white leading-none">
                    {status.split("_").pop()}
                </div>
                <p className="text-neutral-500 mt-10 text-xl font-medium max-w-xl leading-relaxed">
                    正在锁定 4K 极清流。请确保浏览器页签处于焦点状态，不要切换窗口。
                </p>
            </div>
        )}

        {/* 进度提示器 - 录制时仅在角落微弱显示 */}
        {isRendering && !status.includes("STABILIZING") && (
            <div className="absolute bottom-10 left-10 z-[200] flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-white">
                    Mastering: {renderProgress}% | {status}
                </div>
            </div>
        )}

        {/* 成功状态 */}
        {renderComplete && (
            <div className="absolute inset-0 bg-emerald-600 z-[210] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <CheckCircle2 className="w-32 h-32 text-white mb-8" />
                <h2 className="text-5xl font-black italic tracking-tighter mb-4 text-white uppercase">4K Master Exported</h2>
                <p className="text-emerald-100 mb-10 font-medium">大师级极清母带已下载至您的本地设备。</p>
                <button 
                    onClick={() => setRenderComplete(false)}
                    className="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-black uppercase hover:scale-105 transition-transform"
                >
                    返回工作室
                </button>
            </div>
        )}

        {/* 错误显示 */}
        {error && (
            <div className="absolute inset-0 bg-black/90 z-[220] flex items-center justify-center p-6 backdrop-blur-xl">
                <div className="bg-neutral-900 border border-red-500/50 p-12 rounded-[40px] max-w-xl text-center shadow-2xl">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-black italic text-white mb-4 uppercase">Mastering Error</h3>
                    <p className="text-neutral-400 mb-10 leading-relaxed text-sm">{error}</p>
                    <button 
                        onClick={() => setError(null)} 
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase transition-colors"
                    >
                        重试
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* 底部操作区 */}
      {!isRendering && !renderComplete && (
        <div className="mt-12 w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-10 p-6">
            <button 
                onClick={startProMastering}
                className="group relative flex items-center gap-6 px-16 py-10 bg-white text-black rounded-full transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]"
            >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-cyan-500 transition-colors">
                    <MonitorCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <div className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">启动极清录制</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] mt-1 opacity-50 font-bold">Recommended: Select "This Tab" in 4K</div>
                </div>
            </button>
        </div>
      )}
      
      {!isRendering && !renderComplete && (
        <footer className="mt-auto mb-10 text-neutral-800 text-[10px] font-mono tracking-[0.5em] uppercase text-center max-w-2xl leading-loose">
            Note: Due to DOM-based programmatic rendering, we use internal stream capture to ensure 1:1 pixel fidelity of CSS filters & SVG effects.
        </footer>
      )}
    </div>
  );
};

export default App;
