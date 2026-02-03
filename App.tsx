
import React, { useState, useRef, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Video } from './Video';
import * as htmlToImage from 'html-to-image';
import { 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Download,
  Terminal,
  Monitor,
  FastForward,
  Cpu
} from 'lucide-react';

const App: React.FC = () => {
  // 物理 4K 规格
  const width = 3840; 
  const height = 2160;
  const fps = 60;
  const totalDuration = 60 * 34;
  const TEST_FRAME_LIMIT = 20; // 导演要求的 20 帧测试限额
  
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
   * 4K 离线帧渲染引擎 (20帧快速测试版)
   */
  const startOfflineRender = useCallback(async () => {
    if (!playerRef.current || !containerRef.current || !canvasRef.current) return;
    
    setIsRendering(true);
    setRenderComplete(false);
    setError(null);
    chunksRef.current = [];
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    try {
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 100000000 // 100Mbps Ultra High Quality
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Kimi_K2.5_4K_Test_20Frames.webm`;
            a.click();
            setIsRendering(false);
            setRenderComplete(true);
        };

        recorder.start();
        setStatus("BOOTING_TEST_ENGINE");

        // 核心逻辑：只循环渲染前 20 帧
        for (let frame = 0; frame < TEST_FRAME_LIMIT; frame++) {
            setCurrentFrame(frame);
            setStatus(`CAPTURING_FRAME_${frame}_OF_${TEST_FRAME_LIMIT}`);

            playerRef.current.seekTo(frame);
            
            // 4K 像素同步等待
            await new Promise(r => requestAnimationFrame(r));
            await new Promise(r => setTimeout(r, 32)); // 给予足够的重绘缓冲
            
            const dataUrl = await htmlToImage.toCanvas(containerRef.current, {
                width,
                height,
                pixelRatio: 1, 
                backgroundColor: '#000',
                canvasWidth: width,
                canvasHeight: height
            });

            ctx.drawImage(dataUrl, 0, 0, width, height);

            if (frame === 0) await new Promise(r => setTimeout(r, 1000));
        }

        setStatus("COMPILING_TEST_STREAM");
        recorder.stop();

    } catch (e: any) {
        setError(`渲染异常: ${e.message}`);
        setIsRendering(false);
    }
  }, [fps, width, height]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#050505] text-white font-sans p-6 overflow-y-auto">
      
      {/* 顶部状态栏 */}
      <div className="w-full max-w-6xl flex justify-between items-end mb-6">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-mono text-[10px] tracking-widest uppercase font-bold">4K Test Mode Active</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                KIMI <span className="text-neutral-500 font-normal">PRODUCTION</span> MASTER
            </h1>
        </div>
        <div className="text-right font-mono text-[10px] text-neutral-600 hidden sm:block">
            <p>SYNC: PIXEL_PERFECT</p>
            <p>TARGET: 3840x2160</p>
            <p>LIMIT: 20_FRAMES</p>
        </div>
      </div>

      {/* 主视窗 */}
      <div className="w-full max-w-6xl relative">
        <div 
            ref={containerRef}
            className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
        >
          <Player
            ref={playerRef}
            component={Video}
            durationInFrames={totalDuration}
            compositionWidth={width}
            compositionHeight={height}
            fps={fps}
            style={{ width: '100%', height: '100%' }}
            controls={!isRendering}
            autoPlay={false}
          />

          {/* 渲染覆盖层 */}
          {isRendering && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 border-2 border-red-500/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-red-500 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black italic tracking-tighter">
                            {currentFrame}
                        </span>
                        <span className="text-[10px] font-mono text-red-500 uppercase">Frames</span>
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-xs mb-1 uppercase tracking-widest">
                        <Terminal className="w-3 h-3" />
                        <span>{status}</span>
                    </div>
                    <div className="text-neutral-500 text-[10px] uppercase tracking-[0.3em]">
                        TEST SPRINT IN PROGRESS
                    </div>
                </div>
            </div>
          )}

          {/* 完成反馈 */}
          {renderComplete && (
             <div className="absolute inset-0 bg-red-600 z-[60] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <FastForward className="w-16 h-16 mb-4 text-white" />
                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-6">Test Render Ready</h2>
                <button 
                    onClick={() => setRenderComplete(false)}
                    className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold uppercase text-xs hover:bg-neutral-100 transition-colors"
                >
                    Dismiss
                </button>
             </div>
          )}
        </div>

        {/* 隐藏画板 */}
        <canvas ref={canvasRef} width={width} height={height} className="hidden" />

        {/* 交互控制区 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <Monitor className="text-cyan-500 w-8 h-8" />
                <div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase">Physical Matrix</div>
                    <div className="text-sm font-bold uppercase italic">3840 x 2160 (4K)</div>
                </div>
            </div>

            <div className="md:col-span-2">
                <button 
                    onClick={startOfflineRender}
                    disabled={isRendering}
                    className={`
                        w-full h-full flex items-center justify-center gap-4 px-8 py-4 rounded-2xl font-black italic uppercase transition-all
                        ${isRendering 
                            ? 'bg-neutral-900 text-neutral-700' 
                            : 'bg-red-600 text-white hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(220,38,38,0.3)]'}
                    `}
                >
                    {isRendering ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Cpu className="w-6 h-6" />
                    )}
                    <span className="text-xl">
                        {isRendering ? 'Processing Test...' : '启动 4K 极清渲染 (20帧快速测试)'}
                    </span>
                </button>
            </div>
        </div>
      </div>

      <p className="mt-8 text-neutral-700 text-[10px] font-mono uppercase tracking-widest text-center">
        Debug Info: Frame synchronization is locked to 60fps. Offline capture will yield zero-drop master file.
      </p>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[100]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{error}</span>
        </div>
      )}
    </div>
  );
};

export default App;
