import type { Route } from './+types/blog.$slug';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { blogPostBySlug } from '@/data/blog-posts';
import { images } from '@/data/site';
import { business } from '@/data/business';
import { ArticleBody } from '@/components/blog/article-body';
import { ContactCta } from '@/components/contact-cta';

export function loader({ params }: Route.LoaderArgs) {
	const post = blogPostBySlug(params.slug);
	if (!post) {
		throw new Response('Article not found', { status: 404 });
	}
	return { post };
}

export function meta({ matches, location, loaderData }: Route.MetaArgs) {
	if (!loaderData) {
		return seo({ matches, location }, {
			title: 'Article not found | Vistar Models',
			description: 'This article is no longer published.',
			noindex: true,
		});
	}
	const { post } = loaderData;
	const origin = siteOriginFrom(matches);
	const url = absoluteUrl(origin, `/blog/${post.slug}`);
	const cover = images[post.cover as keyof typeof images] ?? images.architectural;

	return seo({ matches, location }, {
		title: `${post.title} | Vistar Models`,
		description: post.excerpt,
		image: cover,
		type: 'article',
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: post.title,
				description: post.excerpt,
				url,
				image: absoluteUrl(origin, cover),
				datePublished: post.publishedAt,
				dateModified: post.updatedAt,
				author: { '@type': 'Person', name: post.author },
				publisher: {
					'@type': 'Organization',
					name: business.name,
					url: origin,
					email: business.email,
					telephone: business.phoneE164,
				},
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
					{ '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteUrl(origin, '/blog') },
					{ '@type': 'ListItem', position: 3, name: post.title, item: url },
				],
			},
		],
	});
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<ArticleBody post={loaderData.post} />
			<ContactCta />
		</main>
	);
}
