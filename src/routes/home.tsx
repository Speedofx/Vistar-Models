import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { images } from '@/data/site';
import { Hero } from '@/components/home/hero';
import { ClientSolutions } from '@/components/home/client-solutions';
import { LuxuryShowcase } from '@/components/home/luxury-showcase';
import { Perspective } from '@/components/home/perspective';
import { CategoryGallery } from '@/components/category-gallery';
import { Capability } from '@/components/capability';
import { Process } from '@/components/process';
import { Founder } from '@/components/founder';
import { IndustryPartners } from '@/components/home/industry-partners';
import { BlogTeaser } from '@/components/home/blog-teaser';
import { HomepageFaq } from '@/components/home/homepage-faq';
import { ContactCta } from '@/components/contact-cta';
import { business, openingHoursSpec } from '@/data/business';
import { useScrollProgress } from '@/hooks/use-scroll-reveal';

export const links: Route.LinksFunction = () => [
	{
		rel: 'preload',
		as: 'image',
		href: '/images/cmd_hero_1.webp',
		type: 'image/webp',
		fetchPriority: 'high',
	},
];

export function meta({ matches, location }: Route.MetaArgs) {
	return seo(
		{ matches, location },
		{
			title: 'Vistar Models | Scale Model Consultancy & Manufacturer Sourcing India',
			description:
				'Vistar Models — India\'s scale-model consultancy. Find verified architectural, township and industrial model makers across Mumbai, Delhi, Bengaluru, Jaipur and 5 more cities. Submit your brief today.',
			image: images.architectural,
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					'@id': business.primaryDomain + '/#website',
					name: business.name,
					url: business.primaryDomain,
					publisher: { '@id': business.primaryDomain + '/#organization' },
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: business.primaryDomain + '/find-a-model-maker?q={search_term_string}',
						},
						'query-input': 'required name=search_term_string',
					},
				},
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					'@id': business.primaryDomain + '/#organization',
					name: business.name,
					url: business.primaryDomain,
					logo: business.primaryDomain + '/favicon.png',
					foundingDate: business.foundingDate,
					founder: {
						'@type': 'Person',
						name: business.founder,
						jobTitle: 'Founder',
						url: business.primaryDomain + '/about',
					},
					telephone: business.phoneE164,
					email: business.email,
					description: business.description,
					address: {
						'@type': 'PostalAddress',
						addressCountry: 'IN',
						addressRegion: 'Rajasthan',
						addressLocality: 'Jaipur',
					},
					identifier: {
						'@type': 'PropertyValue',
						name: 'MSME UDYAM',
						value: 'UDYAM-RJ-17-0536099',
					},
					areaServed: [
						'Jaipur', 'Mumbai', 'Delhi', 'Gurugram', 'Bengaluru',
						'Pune', 'Hyderabad', 'Ahmedabad', 'Noida', 'India',
					],
					sameAs: [
						'https://msme.gov.in',
						business.whatsapp,
					],
					hasOfferCatalog: {
						'@type': 'OfferCatalog',
						name: 'Scale Model Consultancy Services',
						itemListElement: [
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'Architectural Scale Model Sourcing',
									description: 'Requirement consultation and maker matching for architectural presentation and sales-gallery models',
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'Township & Masterplan Model Sourcing',
									description: 'Specialist sourcing for large-scale masterplan and township development models',
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'Industrial Model Sourcing',
									description: 'Sourcing for industrial plant layouts and engineering demonstration models',
								},
							},
						],
					},
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
					address: {
						'@type': 'PostalAddress',
						addressLocality: 'Jaipur',
						addressRegion: 'Rajasthan',
						addressCountry: 'IN',
					},
					areaServed: { '@type': 'Country', name: business.areaServed },
					openingHoursSpecification: openingHoursSpec,
					currenciesAccepted: 'INR',
					priceRange: '₹₹₹',
					sameAs: ['https://msme.gov.in'],
				},
			],
		},
	);
}

export default function HomePage() {
	const progress = useScrollProgress();

	return (
		<main>
			{/* Top Luxury Scroll Progress Indicator */}
			<div
				className="lux-scroll-progress"
				style={{ width: `${progress}%` }}
				role="progressbar"
				aria-valuenow={progress}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label="Page scroll progress"
			/>
			<Hero />
			<ClientSolutions />
			<LuxuryShowcase />
			<Perspective />
			<CategoryGallery compact />
			<Capability />
			<Process />
			<Founder />
			<IndustryPartners />
			<BlogTeaser />
			<HomepageFaq />
			<ContactCta />
		</main>
	);
}



