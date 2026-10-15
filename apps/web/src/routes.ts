import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('blog', 'routes/blog.tsx'),
	route('blog/:slug', 'routes/blog.$slug.tsx'),
	route(':slug', 'routes/page.tsx'),
	route('rss.xml', 'routes/rss.xml.ts'),
	route('llms.txt', 'routes/llms.txt.ts'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/download-source', 'routes/api.download-source.ts'),
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;
