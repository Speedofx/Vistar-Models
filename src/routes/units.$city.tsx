import { useState, useMemo } from 'react';
import { Link, useLoaderData } from 'react-router';
import {
	MapPin,
	Building2,
	Phone,
	MessageSquare,
	ArrowUpRight,
	Search,
	ShieldCheck,
	Award,
	ChevronRight,
	Star,
	Navigation,
	Compass,
} from 'lucide-react';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { getUnit, units, type Unit } from '@/data/units';
import { categories } from '@/data/site';
import { ContactCta } from '@/components/contact-cta';

export function loader({ params }: { params: { city?: string } }) {
	const slug = params.city || '';
	const unit = getUnit(slug);
	if (!unit) {
		throw new Response('Unit not found', { status: 404 });
	}
	return { unit };
}

export function meta({
	matches,
	location,
	loaderData,
}: {
	matches: any[];
	location: { pathname: string };
	loaderData: { unit?: Unit };
}) {
	const origin = siteOriginFrom(matches);
	if (!loaderData?.unit) {
		return seo(
			{ matches, location },
			{
				title: 'Unit Not Found | Vistar Models',
				description: 'The requested operating unit could not be found.',
				noindex: true,
			},
		);
	}

	const { unit } = loaderData;
	const canonicalUrl = absoluteUrl(origin, `/units/${unit.slug}`);

	return seo(
		{ matches, location },
		{
			title: `Scale Model Maker in ${unit.city} | Vistar Models — UDYAM Registered`,
			description: unit.description,
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
						{ '@type': 'ListItem', position: 2, name: 'My Branches', item: absoluteUrl(origin, '/units') },
						{ '@type': 'ListItem', position: 3, name: unit.name, item: canonicalUrl },
					],
				},
				{
					'@context': 'https://schema.org',
					'@type': ['LocalBusiness', 'ProfessionalService'],
					name: unit.name,
					description: unit.description,
					address: {
						'@type': 'PostalAddress',
						streetAddress: unit.address,
						addressLocality: unit.city,
						addressRegion: unit.state,
						postalCode: unit.pincode,
						addressCountry: 'IN',
					},
					telephone: '+918302806913',
					email: 'vistarmodels@gmail.com',
					url: canonicalUrl,
					areaServed: {
						'@type': 'City',
						name: unit.city,
					},
					serviceType: 'Architectural Scale Model Consultancy & Manufacturing Sourcing',
					priceRange: '₹₹–₹₹₹',
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: unit.rating,
						reviewCount: unit.reviewCount,
					},
					identifier: {
						'@type': 'PropertyValue',
						name: 'MSME UDYAM Registration',
						value: 'UDYAM-RJ-17-0536099',
					},
				},
				{
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: unit.faqs.map(faq => ({
						'@type': 'Question',
						name: faq.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: faq.answer,
						},
					})),
				},
			],
		},
	);
}

export default function CityUnitPage() {
	const { unit } = useLoaderData<typeof loader>();
	const [faqSearch, setFaqSearch] = useState('');

	// Client-side instant filter for the 200 FAQs
	const filteredFaqs = useMemo(() => {
		if (!faqSearch.trim()) return unit.faqs;
		const query = faqSearch.toLowerCase();
		return unit.faqs.filter(
			f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query),
		);
	}, [unit.faqs, faqSearch]);

	return (
		<main className="unit-city-detail-page">
			{/* Breadcrumb Bar */}
			<div
				style={{
					background: 'rgba(255, 255, 255, 0.02)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
					padding: '0.75rem 1.5rem',
					fontSize: '0.8rem',
					color: 'var(--muted, #8b949e)',
				}}
			>
				<div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
						Home
					</Link>
					<ChevronRight size={14} />
					<Link to="/units" style={{ color: 'inherit', textDecoration: 'none' }}>
						My Branches
					</Link>
					<ChevronRight size={14} />
					<span style={{ color: 'var(--foreground, #f0f6fc)', fontWeight: 500 }}>{unit.city}</span>
				</div>
			</div>

			{/* Quick-Switch Branch Navigation Bar */}
			<div
				style={{
					background: 'rgba(255, 255, 255, 0.03)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
					padding: '0.75rem 1.5rem',
					overflowX: 'auto',
				}}
			>
				<div
					style={{
						maxWidth: '1240px',
						margin: '0 auto',
						display: 'flex',
						alignItems: 'center',
						gap: '0.6rem',
						fontSize: '0.82rem',
					}}
				>
					<span style={{ fontWeight: 600, color: 'var(--accent, #e5a93c)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
						<Compass size={14} /> Switch Branch:
					</span>
					{units.map(u => (
						<Link
							key={u.slug}
							to={`/units/${u.slug}`}
							style={{
								padding: '4px 10px',
								borderRadius: '6px',
								textDecoration: 'none',
								flexShrink: 0,
								fontWeight: u.slug === unit.slug ? 700 : 500,
								background: u.slug === unit.slug ? 'var(--accent, #e5a93c)' : 'rgba(255, 255, 255, 0.05)',
								color: u.slug === unit.slug ? '#000' : 'var(--muted, #a0aec0)',
								border: u.slug === unit.slug ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
							}}
						>
							{u.city}
						</Link>
					))}
				</div>
			</div>

			{/* Hero Section */}
			<header
				style={{
					padding: '3rem 1.5rem 2.5rem',
					maxWidth: '1240px',
					margin: '0 auto',
				}}
			>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							fontSize: '0.8rem',
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							fontWeight: 700,
							color: 'var(--accent, #e5a93c)',
							background: 'rgba(229, 169, 60, 0.12)',
							padding: '6px 14px',
							borderRadius: '20px',
						}}
					>
						<ShieldCheck size={16} />
						<span>MSME Registered · UDYAM-RJ-17-0536099 · {unit.city}, {unit.state}</span>
					</div>

					{/* Google Review Badge */}
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '6px',
							fontSize: '0.8rem',
							fontWeight: 600,
							color: '#ffc107',
							background: 'rgba(255, 193, 7, 0.1)',
							padding: '6px 12px',
							borderRadius: '20px',
							border: '1px solid rgba(255, 193, 7, 0.2)',
						}}
					>
						<Star size={14} fill="#ffc107" />
						<span>{unit.rating} Google Rating ({unit.reviewCount} Verified Client Reviews)</span>
					</div>
				</div>

				<h1
					style={{
						fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
						fontWeight: 700,
						lineHeight: 1.15,
						margin: '0 0 1.25rem',
						color: 'var(--foreground, #f0f6fc)',
						letterSpacing: '-0.02em',
					}}
				>
					Scale Model Maker & Architectural Model Consultancy in {unit.city}
				</h1>

				{/* Atomic Address & Direct Fact Block (Engineered for Instant LLM Extraction) */}
				<address
					style={{
						fontStyle: 'normal',
						background: 'rgba(255, 255, 255, 0.03)',
						border: '1px solid rgba(255, 255, 255, 0.08)',
						borderLeft: '4px solid var(--accent, #e5a93c)',
						borderRadius: '8px',
						padding: '1.25rem',
						margin: '0 0 1.75rem',
						fontSize: '0.95rem',
						lineHeight: 1.6,
						color: 'var(--foreground, #f0f6fc)',
						maxWidth: '960px',
					}}
				>
					<strong>Official Branch Address:</strong> {unit.name}, {unit.address}, {unit.city}, {unit.state} – {unit.pincode}, India.
					<br />
					<strong>Area Coverage:</strong> {unit.areaHighlights}
					<br />
					<strong>Direct Phone / Inquiry:</strong> <a href="tel:+918302806913" style={{ color: 'var(--accent, #e5a93c)' }}>+91 83028 06913</a> · <strong>Email:</strong> <a href="mailto:vistarmodels@gmail.com" style={{ color: 'var(--accent, #e5a93c)' }}>vistarmodels@gmail.com</a> · <strong>UDYAM:</strong> UDYAM-RJ-17-0536099.
				</address>

				<p
					style={{
						fontSize: '1.05rem',
						color: 'var(--muted, #a0aec0)',
						maxWidth: '900px',
						lineHeight: 1.6,
						margin: '0 0 2rem',
					}}
				>
					{unit.description}
				</p>

				{/* Quick Contact & Action Buttons */}
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
					<a
						href={`https://wa.me/918302806913?text=${encodeURIComponent(`Hello Vistar Models ${unit.city}, I have a scale model requirement for a project in ${unit.city}.`)}`}
						target="_blank"
						rel="noreferrer"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							padding: '0.85rem 1.5rem',
							background: 'var(--accent, #e5a93c)',
							color: '#000',
							fontWeight: 700,
							fontSize: '0.95rem',
							borderRadius: '8px',
							textDecoration: 'none',
						}}
					>
						<MessageSquare size={18} />
						Enquire on WhatsApp <ArrowUpRight size={16} />
					</a>

					<a
						href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`}
						target="_blank"
						rel="noreferrer"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							padding: '0.85rem 1.5rem',
							background: 'rgba(255, 255, 255, 0.05)',
							color: 'var(--foreground, #f0f6fc)',
							border: '1px solid rgba(255, 255, 255, 0.15)',
							fontWeight: 600,
							fontSize: '0.95rem',
							borderRadius: '8px',
							textDecoration: 'none',
						}}
					>
						<Navigation size={18} style={{ color: 'var(--accent, #e5a93c)' }} />
						Open in Google Maps
					</a>

					<a
						href="tel:+918302806913"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							padding: '0.85rem 1.5rem',
							background: 'rgba(255, 255, 255, 0.03)',
							color: 'var(--foreground, #f0f6fc)',
							fontWeight: 600,
							fontSize: '0.95rem',
							borderRadius: '8px',
							textDecoration: 'none',
						}}
					>
						<Phone size={18} />
						Call +91 83028 06913
					</a>
				</div>
			</header>

			{/* Unit Address & Authority Overview Card */}
			<section style={{ maxWidth: '1240px', margin: '0 auto 3.5rem', padding: '0 1.5rem' }}>
				<div
					style={{
						background: 'var(--card, #12141a)',
						border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
						borderRadius: '16px',
						padding: '2rem',
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
						gap: '2rem',
					}}
				>
					<div>
						<span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent, #e5a93c)', fontWeight: 700 }}>
							Registered Branch Location
						</span>
						<h2 style={{ fontSize: '1.25rem', margin: '0.5rem 0', color: 'var(--foreground, #f0f6fc)' }}>
							{unit.name}
						</h2>
						<p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							<MapPin size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent, #e5a93c)' }} />
							{unit.address}, {unit.city}, {unit.state} – {unit.pincode}
						</p>
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`}
							target="_blank"
							rel="noreferrer"
							style={{ fontSize: '0.85rem', color: 'var(--accent, #e5a93c)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
						>
							<Navigation size={14} /> Get Directions on Google Maps <ArrowUpRight size={14} />
						</a>
					</div>

					<div>
						<span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent, #e5a93c)', fontWeight: 700 }}>
							Governing Authority & Compliance
						</span>
						<h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--foreground, #f0f6fc)', fontWeight: 600 }}>
							{unit.authority}
						</h3>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							<strong>Regulatory Framework:</strong> {unit.rera}
							<br />
							<strong>MSME Registration:</strong> UDYAM-RJ-17-0536099
							<br />
							<strong>Operating Desk:</strong> Mon–Sat · 24 Hours Open (Sunday Closed)
						</p>
					</div>

					<div>
						<span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent, #e5a93c)', fontWeight: 700 }}>
							Verified Customer Satisfaction
						</span>
						<h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--foreground, #f0f6fc)', fontWeight: 600 }}>
							★★★★★ {unit.rating} / 5.0 Rating
						</h3>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							Backed by {unit.reviewCount}+ verified client reviews from real estate developers, architects, and industrial plant managers across {unit.city} and {unit.state}.
						</p>
					</div>
				</div>
			</section>

			{/* Deep Market & Editorial Context */}
			<section
				style={{
					background: 'rgba(255, 255, 255, 0.02)',
					borderTop: '1px solid rgba(255, 255, 255, 0.06)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
					padding: '3.5rem 1.5rem',
					marginBottom: '3.5rem',
				}}
			>
				<div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent, #e5a93c)', marginBottom: '0.75rem' }}>
							<Building2 size={20} />
							<h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
								About Our {unit.city} Branch
							</h2>
						</div>
						<p style={{ fontSize: '0.95rem', color: 'var(--muted, #cbd5e0)', lineHeight: 1.7, margin: 0 }}>
							{unit.intro}
						</p>
					</div>

					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent, #e5a93c)', marginBottom: '0.75rem' }}>
							<Award size={20} />
							<h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
								Why {unit.city} Builders Demand Physical Scale Models
							</h2>
						</div>
						<p style={{ fontSize: '0.95rem', color: 'var(--muted, #cbd5e0)', lineHeight: 1.7, margin: 0 }}>
							{unit.marketContext}
						</p>
					</div>
				</div>
			</section>

			{/* Sourced Model Categories in this City */}
			<section style={{ maxWidth: '1240px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
				<div style={{ marginBottom: '2rem' }}>
					<span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent, #e5a93c)', fontWeight: 700 }}>
						Capabilities Sourced in {unit.city}
					</span>
					<h2 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0.5rem 0 0', color: 'var(--foreground, #f0f6fc)' }}>
						Specialist Scale Model Categories
					</h2>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
						gap: '1.25rem',
					}}
				>
					{categories.map(cat => (
						<Link
							key={cat.slug}
							to={`/${cat.slug}`}
							style={{
								background: 'var(--card, #12141a)',
								border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
								borderRadius: '12px',
								padding: '1.5rem',
								textDecoration: 'none',
								color: 'inherit',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
						>
							<div>
								<h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--foreground, #f0f6fc)' }}>
									{cat.name}
								</h3>
								<p style={{ fontSize: '0.8rem', color: 'var(--muted, #8b949e)', lineHeight: 1.5, margin: 0 }}>
									{cat.description}
								</p>
							</div>
							<span style={{ fontSize: '0.8rem', color: 'var(--accent, #e5a93c)', fontWeight: 600, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
								Explore Category <ArrowUpRight size={14} />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* 200 FAQs Section (AEO, GEO, AI Snippet Engine) */}
			<section id="faqs" style={{ maxWidth: '1240px', margin: '0 auto 5rem', padding: '0 1.5rem' }}>
				<div
					style={{
						background: 'var(--card, #12141a)',
						border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
						borderRadius: '16px',
						padding: '2.5rem',
						boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
							gap: '1.5rem',
							marginBottom: '2rem',
							borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
							paddingBottom: '1.5rem',
						}}
					>
						<div>
							<span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent, #e5a93c)', fontWeight: 700 }}>
								Knowledge Base & Technical Guide
							</span>
							<h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, margin: '0.5rem 0 0', color: 'var(--foreground, #f0f6fc)' }}>
								200 Questions & Answers — Scale Model Makers in {unit.city}
							</h2>
							<p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--muted, #8b949e)' }}>
								Showing {filteredFaqs.length} of {unit.faqs.length} verified technical questions for {unit.city}.
							</p>
						</div>

						{/* Instant Filter Search Bar */}
						<div style={{ position: 'relative', minWidth: '280px', maxWidth: '400px', width: '100%' }}>
							<Search
								size={18}
								style={{
									position: 'absolute',
									left: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									color: 'var(--muted, #8b949e)',
								}}
							/>
							<input
								type="text"
								value={faqSearch}
								onChange={e => setFaqSearch(e.target.value)}
								placeholder={`Search ${unit.city} questions (e.g. cost, acrylic, scale)...`}
								aria-label={`Search scale model questions for ${unit.city}`}
								style={{
									width: '100%',
									padding: '0.75rem 1rem 0.75rem 2.5rem',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.15)',
									borderRadius: '8px',
									color: 'var(--foreground, #f0f6fc)',
									fontSize: '0.875rem',
									outline: 'none',
								}}
							/>
						</div>
					</div>

					{/* Native zero-JS CLS Accordions */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
						{filteredFaqs.map((faq, index) => (
							<details
								key={index}
								style={{
									background: 'rgba(255, 255, 255, 0.02)',
									border: '1px solid rgba(255, 255, 255, 0.06)',
									borderRadius: '10px',
									padding: '1rem 1.25rem',
								}}
							>
								<summary
									style={{
										fontSize: '0.98rem',
										fontWeight: 600,
										color: 'var(--foreground, #f0f6fc)',
										cursor: 'pointer',
										lineHeight: 1.5,
										listStyle: 'none',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<span>
										<strong style={{ color: 'var(--accent, #e5a93c)', marginRight: '8px' }}>
											Q{index + 1}.
										</strong>
										{faq.question}
									</span>
									<span style={{ color: 'var(--accent, #e5a93c)', fontSize: '1.2rem', marginLeft: '1rem' }}>
										+
									</span>
								</summary>
								<div
									style={{
										marginTop: '0.85rem',
										paddingTop: '0.85rem',
										borderTop: '1px solid rgba(255, 255, 255, 0.05)',
										fontSize: '0.92rem',
										color: 'var(--muted, #cbd5e0)',
										lineHeight: 1.65,
									}}
								>
									{faq.answer}
								</div>
							</details>
						))}

						{filteredFaqs.length === 0 && (
							<p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted, #8b949e)' }}>
								No questions matched "{faqSearch}". Try searching for terms like "price", "laser", "materials", or "{unit.city}".
							</p>
						)}
					</div>
				</div>
			</section>

			{/* Other Regional Branches Directory */}
			<section style={{ maxWidth: '1240px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
				<h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)', marginBottom: '1.25rem' }}>
					Explore Other Vistar Models Branches in India:
				</h3>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
					{units
						.filter(u => u.slug !== unit.slug)
						.map(other => (
							<Link
								key={other.slug}
								to={`/units/${other.slug}`}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: '0.5rem',
									padding: '0.5rem 1rem',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
									borderRadius: '6px',
									color: 'var(--muted, #cbd5e0)',
									fontSize: '0.85rem',
									textDecoration: 'none',
								}}
							>
								{other.city} Branch <ArrowUpRight size={12} />
							</Link>
						))}
				</div>
			</section>

			<ContactCta />
		</main>
	);
}
