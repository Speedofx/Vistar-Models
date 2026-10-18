import type { Route } from './+types/page';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { pages, categories, images, faqs } from '@/data/site';
import { PageHeading } from '@/components/page-heading';
import { PageContent } from '@/components/page-content';
import { CategoryContent } from '@/components/category-content';
import { CategoryGallery } from '@/components/category-gallery';
import { EnquiryForm } from '@/components/enquiry-form';
import { Process } from '@/components/process';
import { Founder } from '@/components/founder';
import { Capability } from '@/components/capability';
import { ContactCta } from '@/components/contact-cta';

/**
 * Per-slug meta description overrides (Step 7 of SEO audit).
 * Falls back to page.intro when not specified here.
 */
const META_DESCRIPTION_OVERRIDES: Record<string, string> = {
	about:
		"Vistar Models, founded by Yogendra Yogi in 2026, is India's dedicated scale-model consultancy — structured sourcing, capability matching and maker introductions for architects, developers and engineers.",
	faq: "Common questions about Vistar Models' scale-model sourcing process — consultancy role, scales covered (1:50 to 1:1000), file formats accepted, costs, timelines and maker vetting.",
};

/** Page display names used in BreadcrumbList labels. */
const BREADCRUMB_NAMES: Record<string, string> = {
	about: 'About Vistar Models',
	faq: 'FAQ',
	services: 'Services',
	categories: 'Model Categories',
	'how-it-works': 'How It Works',
	industries: 'Industries',
	'for-manufacturers': 'For Manufacturers',
	'become-a-partner': 'Become a Partner',
	contact: 'Contact',
	privacy: 'Privacy Policy',
	terms: 'Terms of Use',
	'find-a-model-maker': 'Find a Model Maker',
};

export function loader({ params }: Route.LoaderArgs) {
	const slug = params.slug || '';
	const c = categories.find(c => c.slug === slug);
	const page = c
		? {
				title: 'Find ' + c.name + ' Makers in India',
				eyebrow: 'Specialist model sourcing',
				intro: c.description + ' We help clarify your brief and explore relevant fabrication partners.',
			}
		: pages[slug];
	if (!page) throw new Response('Page not found', { status: 404 });
	return { slug, page, category: !!c, image: c?.image || images.architectural };
}

export function meta({ matches, location, loaderData }: Route.MetaArgs) {
	if (!loaderData)
		return seo(
			{ matches, location },
			{
				title: 'Page not found | Vistar Models',
				description:
					'This page is not available. Explore Vistar Models for scale-model consultancy and sourcing across India.',
				noindex: true,
			},
		);

	const { slug, page, image } = loaderData;
	const origin = siteOriginFrom(matches);
	const canonicalUrl = absoluteUrl(origin, `/${slug}`);
	const description =
		META_DESCRIPTION_OVERRIDES[slug] ??
		(page.intro.length > 155 ? page.intro.slice(0, 152) + '…' : page.intro);

	// Build JSON-LD array — start with BreadcrumbList for all inner pages
	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
			{
				'@type': 'ListItem',
				position: 2,
				name: BREADCRUMB_NAMES[slug] ?? page.eyebrow.split(' · ')[0],
				item: canonicalUrl,
			},
		],
	};

	const faqSchema =
		slug === 'faq'
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqs.map(([q, a]) => ({
						'@type': 'Question',
						name: q,
						acceptedAnswer: { '@type': 'Answer', text: a },
					})),
				}
			: null;

	const serviceSchema =
		loaderData.category || slug === 'services'
			? {
					'@context': 'https://schema.org',
					'@type': 'Service',
					name: page.title,
					provider: { '@type': 'Organization', name: 'Vistar Models' },
					areaServed: 'India',
					serviceType: 'Scale-model consultancy and manufacturer sourcing',
				}
			: null;

	const jsonLd = [breadcrumb, faqSchema, serviceSchema].filter(Boolean);

	return seo(
		{ matches, location },
		{
			title: (loaderData.category ? page.title : page.eyebrow.split(' · ')[0]) + ' | Vistar Models',
			description,
			image,
			jsonLd,
		},
	);
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { slug, page, category } = loaderData;
	const form =
		slug === 'contact' || slug === 'find-a-model-maker' || slug === 'become-a-partner';
	return (
		<main>
			<PageHeading {...page} />
			{category ? (
				<CategoryContent slug={slug} />
			) : (
				<>
					{slug === 'categories' && <CategoryGallery />}
					{slug === 'about' && <Founder />}
					{slug === 'how-it-works' && <Process />}
					<PageContent slug={slug} />
					{slug === 'find-a-model-maker' && <Capability />}
					{form && <EnquiryForm partner={slug === 'become-a-partner'} />}
				</>
			)}
			{!form && !['privacy', 'terms'].includes(slug) && <ContactCta />}
		</main>
	);
}
