import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
	appDirectory: 'src',
	buildDirectory: '../../dist/apps/web',
	ssr: true,
	presets: [vercelPreset()],
} satisfies Config;

