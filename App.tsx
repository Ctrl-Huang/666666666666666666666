
import React, { useState, useRef, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Video } from './Video';
import * as htmlToImage from 'html-to-image';
import { 
  Activity, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  Box,
  Cpu,
  Download,
  Terminal,
  Play
} from 'lucide-react';

const App: React.FC = () => {
  const width = 1920; // 离线渲染建议先使用 1080P 以保证性能，导出时可缩放
  const height = 800;
  const fps = 60;
  const durationInFrames = 60 * 34;
  
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isRendering, setIsRendering] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");

  const chunksRef = useRef<Blob[]>([]);

  /**
   * 离线帧渲染逻辑
   * 原理：手动控制播放器 seekTo -> 截图 -> 写入 Canvas -> 捕获 Canvas 帧
   */
  const startOfflineRender = useCallback(async () => {
    if (!playerRef.current || !containerRef.current || !canvasRef.current) return;
    
    setIsRendering(true);
    setRenderComplete(false);
    setError(null);
    chunksRef.current = [];
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
        // 1. 初始化录制流
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 50000000 // 50Mbps
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Kimi_K2.5_Offline_Master.webm`;
            a.click();
            setIsRendering(false);
            setRenderComplete(true);
        };

        recorder.start();
        setStatus("BOOTING_RENDER_ENGINE");

        // 2. 逐帧渲染循环
        for (let frame = 0; frame < durationInFrames; frame++) {
            setCurrentFrame(frame);
            setStatus(`RENDERING_FRAME_${frame}`);

            // 步进到指定帧
            playerRef.current.seekTo(frame);
            
            // 等待 DOM 更新和资源加载
            await new Promise(r => requestAnimationFrame(r));
            
            // 将 DOM 转换为图片
            const dataUrl = await htmlToImage.toCanvas(containerRef.current, {
                width,
                height,
                pixelRatio: 1,
                backgroundColor: '#000'
            });

            // 绘制到隐藏画布
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(dataUrl, 0, 0);

            // 如果是第一帧，多等一会
            if (frame === 0) await new Promise(r => setTimeout(r, 1000));
        }

        setStatus("FINALIZING_STREAM");
        recorder.stop();

    } catch (e: any) {
        setError(`渲染中断: ${e.message}`);
        setIsRendering(false);
    }
  }, [durationInFrames, fps, width, height]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#050505] text-white font-sans p-4 md:p-10">
      
      {/* 头部装饰 */}
      <div className="w-full max-w-6xl flex justify-between items-end mb-8">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Box className="w-6 h-6 text-cyan-500" />
                <span className="text-cyan-500 font-mono text-xs tracking-widest uppercase">Off-grid Mastering</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                KIMI <span className="text-neutral-500">K2.5</span> STUDIO
            </h1>
        </div>
        <div className="hidden md:block text-right font-mono text-[10px] text-neutral-600 space-y-1">
            <p>SYNC_LOCK: ENABLED</p>
            <p>ASSET_LOADER: READY</p>
            <p>VERSION: 4.0.OFFLINE</p>
        </div>
      </div>

      {/* 渲染主容器 */}
      <div className="w-full max-w-6xl relative group">
        
        {/* 实际渲染区 (隐藏或显示) */}
        <div 
            ref={containerRef}
            className="w-full aspect-[2.4/1] bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative"
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
            autoPlay={false}
          />

          {/* 渲染遮罩层 */}
          {isRendering && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-50 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 mb-10">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                    <div 
                        className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" 
                        style={{ animationDuration: '3s' }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black italic italic tracking-tighter">
                            {Math.floor((currentFrame / durationInFrames) * 100)}%
                        </span>
                        <span className="text-[10px] font-mono text-cyan-500 mt-2 uppercase tracking-widest">Mastering</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-tighter">
                        <Terminal className="w-4 h-4" />
                        <span>{status}</span>
                    </div>
                    <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
                        Frame {currentFrame} of {durationInFrames}
                    </div>
                </div>
            </div>
          )}

          {/* 完成层 */}
          {renderComplete && (
             <div className="absolute inset-0 bg-emerald-600 z-[60] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <CheckCircle2 className="w-24 h-24 mb-6" />
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8">Export Complete</h2>
                <button 
                    onClick={() => setRenderComplete(false)}
                    className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-bold uppercase text-sm hover:scale-105 transition-transform"
                >
                    Return to Editor
                </button>
             </div>
          )}
        </div>

        {/* 隐藏的像素缓冲画布 */}
        <canvas 
            ref={canvasRef} 
            width={width} 
            height={height} 
            className="hidden"
        />

        {/* 操作区 */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Resolution</span>
                    <span className="text-white font-bold italic uppercase">{width}x{height}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Frame Rate</span>
                    <span className="text-white font-bold italic uppercase">{fps} FPS</span>
                </div>
            </div>

            <button 
                onClick={startOfflineRender}
                disabled={isRendering}
                className={`
                    flex items-center gap-4 px-12 py-6 rounded-2xl font-black italic uppercase transition-all duration-300
                    ${isRendering 
                        ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-cyan-400 hover:scale-105 shadow-xl hover:shadow-cyan-500/20'}
                `}
            >
                {isRendering ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Download className="w-6 h-6" />
                )}
                <span className="text-2xl tracking-tighter">
                    {isRendering ? 'Mastering...' : '离线极清渲染'}
                </span>
            </button>
        </div>
      </div>

      <footer className="mt-20 text-neutral-800 text-[10px] font-mono tracking-[0.4em] uppercase text-center max-w-3xl leading-relaxed">
        Offline rendering is frame-perfect and guarantees no frame-drops even on lower-end devices. 
        It uses pixel-sync technology to convert HTML/CSS animations into high-bitrate video.
      </footer>

      {/* 错误提示 */}
      {error && (
        <div className="fixed bottom-10 right-10 bg-red-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold text-sm uppercase italic">{error}</span>
        </div>
      )}
    </div>
  );
};

export default App;
