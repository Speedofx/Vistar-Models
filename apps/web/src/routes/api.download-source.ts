import { spawn } from 'node:child_process';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { withApi } from '@/lib/api.server';
import logger from '@/lib/logger.server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// apps/web/src/routes/api.download-source.ts -> workspace root
const workspaceRoot = path.resolve(__dirname, '../../../..');

/**
 * Streams a gzipped tar archive of the full website source code as a download.
 * Excludes build artifacts, dependencies, caches and runtime data so the
 * download stays small and contains only authored source.
 */
export const loader = withApi(async () => {
	const excludes = [
		'node_modules',
		'.git',
		'dist',
		'build',
		'.cache',
		'.react-router',
		'pb_data',
		'.env',
		'.h5g_env',
		'*.log',
	];

	const args = [
		'-czf',
		'-',
		...excludes.flatMap((e) => ['--exclude', e]),
		'-C',
		workspaceRoot,
		'.',
	];

	const tar = spawn('tar', args);

	tar.on('error', (err) => {
		logger.error('source download tar spawn error', err.message);
	});

	tar.stderr.on('data', (chunk) => {
		logger.error('source download tar stderr', chunk.toString('utf8'));
	});

	const headers = new Headers({
		'Content-Type': 'application/gzip',
		'Content-Disposition': 'attachment; filename="vistar-models-source.tar.gz"',
		'Cache-Control': 'no-store',
	});

	return new Response(Readable.toWeb(tar.stdout) as ReadableStream<Uint8Array>, { headers });
});
