
# 🎥 Remotion 2026: 本地部署与渲染指南

## 1. 快速开始
1. **安装依赖**: `npm install`
2. **启动预览**: `npm start` (启动 Remotion Studio 预览)
3. **命令行渲染**: `npm run render` (导出 4K MP4)

## 2. 资源加载保障机制 (Rendering Lock)
本项目集成了 `AssetLoader.tsx`。
- **原理**: 调用 `delayRender()` 挂起渲染进程。
- **触发点**: 等待 `document.fonts.ready` (确保 Noto Sans SC 加载完成)。
- **效果**: 即使在低速网络下，渲染器也会等待所有 3D 材质和字体就位，绝对不会出现“字体闪烁”或“资源丢失”的情况。

## 3. 硬件建议
- **内存**: 建议 16GB+ (处理 4K 纹理)
- **GPU**: 渲染 3D 卡片 (`Card3D`) 建议开启硬件加速。
- **FFMPEG**: 请确保系统已安装 FFMPEG。

## 4. 视频元数据
- **ID**: `Video`
- **尺寸**: 3840x1600
- **总时长**: 2040 帧 (34秒 @ 60fps)
