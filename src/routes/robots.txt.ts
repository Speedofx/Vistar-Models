import type { Route } from './+types/robots.txt';
import { siteOrigin } from '@/lib/site-origin.server';

/**
 * Hostinger-provided hosts: the editor sandbox preview, and the domain a site is
 * published on before its owner connects one of their own. Neither should reach a
 * search index — the site is not on its final URL yet.
 */
const UNPUBLISHED_HOST_SUFFIXES = [
	'.app-preview.com',
	'.app-preview.io',
	'.hostingersite.com',
	'.hostingersite.dev',
];

/**
 * The assistants and answer engines that fetch a page to answer someone's
 * question and cite the site back. They are listed by name, rather than left to
 * the wildcard group, so the site's stance on AI access is explicit to anyone —
 * or anything — reading the file.
 *
 * Each vendor splits the work the same way: one crawler builds the index the
 * answers are drawn from, another fetches the single page a person just asked
 * about. Meta and Amazon both document that second kind as free to skip
 * robots.txt, since a human asked for the page — naming them records the site's
 * answer, it does not enforce it.
 */
const AI_AGENTS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-SearchBot',
	'Claude-User',
	'anthropic-ai',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot-Extended',
	'Amazonbot',
	'Amzn-SearchBot',
	'Amzn-User',
	'DuckAssistBot',
	'MistralAI-User',
	'meta-webindexer',
	'meta-externalfetcher',
	'meta-externalagent',
	'FacebookBot',
];

const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';

function publishedRules(origin: string): string[] {
	return [
		'User-agent: *',
		CONTENT_SIGNAL,
		'Allow: /',
		'',
		...AI_AGENTS.flatMap(agent => [`User-agent: ${agent}`, CONTENT_SIGNAL, 'Allow: /', '']),
		'User-agent: Bytespider',
		'Disallow: /',
		'',
		`Sitemap: ${origin}/sitemap.xml`,
	];
}

export function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);
	const { hostname } = new URL(origin);
	const isUnpublished = UNPUBLISHED_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix));
	const lines = isUnpublished
		? ['User-agent: *', 'Disallow: /']
		: publishedRules(origin);

	return new Response(`${lines.join('\n')}\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
