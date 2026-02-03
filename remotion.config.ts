
import { Config } from '@remotion/cli/config';

// 针对浏览器端导出优化
Config.setVideoImageFormat('jpeg');
Config.setMuted(false);

export default Config;
