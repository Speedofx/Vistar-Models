import type { Route } from './+types/rss.xml';
import { siteOrigin } from '@/lib/site-origin.server';
import { blogPosts } from '@/data/blog-posts';
import { business } from '@/data/business';
import { images } from '@/data/site';

const coverMap: Record<string, string> = images;

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);
	const items = blogPosts
		.map(post => {
			const url = `${origin}/blog/${post.slug}`;
			const cover = coverMap[post.cover] ?? images.architectural;
			return `\t\t<item>
\t\t\t<title>${escapeXml(post.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
\t\t\t<dc:creator>${escapeXml(post.author)}</dc:creator>
\t\t\t<description>${escapeXml(post.excerpt)}</description>
\t\t\t<enclosure url="${cover}" type="image/png" />
\t\t</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
\t<channel>
\t\t<title>${escapeXml(business.name + ' — The Vistar Journal')}</title>
\t\t<link>${origin}/blog</link>
\t\t<description>Practical, honest articles on sourcing scale models in India.</description>
\t\t<language>en</language>
\t\t<atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${items}
\t</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
