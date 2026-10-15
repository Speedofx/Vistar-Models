import type { Route } from './+types/blog';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { blogPosts } from '@/data/blog-posts';
import { images } from '@/data/site';
import { PageHeading } from '@/components/page-heading';
import { BlogIndex } from '@/components/blog/blog-index';
import { ContactCta } from '@/components/contact-cta';

export function meta({ matches, location }: Route.MetaArgs) {
	const origin = siteOriginFrom(matches);
	return seo({ matches, location }, {
		title: 'The Vistar Journal | Scale Model Sourcing Guides',
		description:
			'Practical, honest articles on sourcing scale models in India — choosing a maker, preparing a quotation brief, matching capabilities, timelines and budgets, and what a sourcing consultancy does.',
		image: images.architectural,
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: 'The Vistar Journal',
				description:
					'Practical, honest articles on sourcing scale models in India.',
				url: absoluteUrl(origin, '/blog'),
			},
			{
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				itemListElement: blogPosts.map((post, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					url: absoluteUrl(origin, `/blog/${post.slug}`),
					name: post.title,
				})),
			},
		],
	});
}

export default function Blog() {
	return (
		<main>
			<PageHeading
				title="The Vistar Journal."
				eyebrow="Scale model sourcing · Articles"
				intro="Practical, honest guidance for buyers and makers of scale models in India. Written to answer the real questions — not to sell."
			/>
			<BlogIndex />
			<ContactCta />
		</main>
	);
}
