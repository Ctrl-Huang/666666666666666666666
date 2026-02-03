
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setConcurrency(8);
Config.setMuted(false);

// 默认导出配置以供 CLI 使用
export default Config;
