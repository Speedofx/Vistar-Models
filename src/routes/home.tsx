import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { images } from '@/data/site';
import { Hero } from '@/components/home/hero';
import { Perspective } from '@/components/home/perspective';
import { CategoryGallery } from '@/components/category-gallery';
import { Capability } from '@/components/capability';
import { Process } from '@/components/process';
import { Founder } from '@/components/founder';
import { IndustryPartners } from '@/components/home/industry-partners';
import { BlogTeaser } from '@/components/home/blog-teaser';
import { ContactCta } from '@/components/contact-cta';
import { HomeFaq } from '@/components/home/home-faq';
import { faqs } from '@/data/site';
import { business, openingHoursSpec } from '@/data/business';

export const links: Route.LinksFunction = () => [
	{
		rel: 'preload',
		as: 'image',
		href: images.architectural,
		type: 'image/webp',
		fetchPriority: 'high',
	},
];

export function meta({ matches, location }: Route.MetaArgs) {
	return seo(
		{ matches, location },
		{
			title: 'Vistar Models | The Right Model. The Right Maker.',
			description:
				'Find suitable scale-model makers across India with Vistar Models. Requirement consultation, capability-based sourcing and introductions for your project.',
			image: images.architectural,
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: business.name,
					url: business.primaryDomain,
				},
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: business.name,
					url: business.primaryDomain,
					foundingDate: business.foundingDate,
					founder: { '@type': 'Person', name: business.founder },
					telephone: business.phoneE164,
					email: business.email,
					description: business.description,
					areaServed: business.areaServed,
					sameAs: ['https://www.rdmodels.in', 'https://msme.gov.in'],
				},
				{
					'@context': 'https://schema.org',
					'@type': 'LocalBusiness',
					'@id': business.primaryDomain + '/#localbusiness',
					name: business.name,
					description: business.description,
					url: business.primaryDomain,
					telephone: business.phoneE164,
					email: business.email,
					areaServed: { '@type': 'Country', name: business.areaServed },
					openingHoursSpecification: openingHoursSpec,
					currenciesAccepted: 'INR',
					priceRange: '$$',
					sameAs: ['https://www.rdmodels.in', 'https://msme.gov.in'],
				},
				{
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqs.slice(0, 8).map(([q, a]) => ({
						'@type': 'Question',
						name: q,
						acceptedAnswer: {
							'@type': 'Answer',
							text: a,
						},
					})),
				},
			],
		},
	);
}

export default function HomePage() {
	return (
		<main>
			<Hero />
			<Perspective />
			<CategoryGallery compact />
			<Capability />
			<Process />
			<Founder />
			<IndustryPartners />
			<HomeFaq />
			<BlogTeaser />
			<ContactCta />
		</main>
	);
}

