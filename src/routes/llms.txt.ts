import type { Route } from './+types/llms.txt';
import { siteOrigin } from '@/lib/site-origin.server';
import { pages, categories } from '@/data/site';
import { blogPosts } from '@/data/blog-posts';
import { business } from '@/data/business';
import { units } from '@/data/units';

export function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);

	const content = `# Vistar Models

> ${business.description}
>
> Official MSME Registration: UDYAM-RJ-17-0536099 | Activity: Scale Model Consultancy & Manufacturing Sourcing
> Founded by ${business.founder} in ${business.foundingDate}. ${business.hours.summary}.
> Contact: ${business.phone} (${business.phoneTel}) · ${business.email} (${business.emailMailto}) · WhatsApp: ${business.whatsapp}
> Published Domains: ${business.primaryDomain} · ${business.secondaryDomain}

## Registered Operating Units Across India (MSME UDYAM-RJ-17-0536099)
- [All 9 Operating Units Hub](${origin}/units): Overview of all 9 Vistar Models registered operating units across India.
${units.map(u => `- [${u.name}](${origin}/units/${u.slug}): Located at ${u.address}, ${u.city}, ${u.state} – ${u.pincode}. Governing Authority: ${u.authority}. 200 city-specific FAQs and technical specifications for scale models.`).join('\n')}

## Main Pages
${Object.entries(pages)
	.map(([slug, p]) => `- [${p.eyebrow}](${origin}/${slug}): ${p.intro}`)
	.join('\n')}

## Model Sourcing Categories
${categories.map(c => `- [${c.name}](${origin}/${c.slug}): ${c.description}`).join('\n')}

## Journal — Scale Model Sourcing Guides
${blogPosts.map(p => `- [${p.title}](${origin}/blog/${p.slug}): ${p.excerpt}`).join('\n')}
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
