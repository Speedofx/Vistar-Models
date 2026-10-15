import { Link } from 'react-router';
import { ArrowUpRight, MapPin, Building2, CheckCircle2, ShieldCheck, Phone, MessageSquare, Star, Navigation } from 'lucide-react';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { units } from '@/data/units';
import { PageHeading } from '@/components/page-heading';
import { ContactCta } from '@/components/contact-cta';

export function meta({ matches, location }: { matches: any[]; location: { pathname: string } }) {
	const origin = siteOriginFrom(matches);
	return seo(
		{ matches, location },
		{
			title: 'My Branches & Operating Units Across India | Vistar Models',
			description:
				'Explore Vistar Models\' 9 registered branch locations across Jaipur, Mumbai, Gurugram, Delhi, Bengaluru, Pune, Hyderabad, Ahmedabad, and Noida. UDYAM-RJ-17-0536099.',
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
						{ '@type': 'ListItem', position: 2, name: 'My Branches', item: absoluteUrl(origin, '/units') },
					],
				},
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Vistar Models',
					url: absoluteUrl(origin, '/'),
					identifier: 'UDYAM-RJ-17-0536099',
					telephone: '+918302806913',
					email: 'vistarmodels@gmail.com',
					founder: {
						'@type': 'Person',
						name: 'Yogendra Yogi',
					},
					hasPart: units.map(u => ({
						'@type': 'LocalBusiness',
						name: u.name,
						url: absoluteUrl(origin, `/units/${u.slug}`),
						address: {
							'@type': 'PostalAddress',
							streetAddress: u.address,
							addressLocality: u.city,
							addressRegion: u.state,
							postalCode: u.pincode,
							addressCountry: 'IN',
						},
						telephone: '+918302806913',
						priceRange: '₹₹–₹₹₹',
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: u.rating,
							reviewCount: u.reviewCount,
						},
					})),
				},
			],
		},
	);
}

export default function UnitsHub() {
	return (
		<main className="units-hub-page">
			<PageHeading
				title="Our Registered Branches & Operating Units Across India."
				eyebrow="MSME Registered · UDYAM-RJ-17-0536099 · 9 Strategic Hubs"
				intro="Explore Vistar Models' 9 regional branch units in India's leading metropolitan and industrial centers. Select your city below to inspect complete physical location details, Google Map navigation, verified client ratings, local authority alignment, and 200 specialized FAQs."
			/>

			{/* Branches Grid */}
			<section className="section-container" style={{ padding: '0 1.5rem 4rem' }}>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
						gap: '2rem',
						maxWidth: '1240px',
						margin: '0 auto',
					}}
				>
					{units.map(unit => (
						<article
							key={unit.slug}
							style={{
								background: 'var(--card, #12141a)',
								border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
								borderRadius: '16px',
								padding: '2.25rem',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
							}}
						>
							<div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '1rem',
									}}
								>
									<span
										style={{
											fontSize: '0.75rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											fontWeight: 700,
											color: 'var(--accent, #e5a93c)',
											background: 'rgba(229, 169, 60, 0.12)',
											padding: '4px 10px',
											borderRadius: '6px',
										}}
									>
										{unit.city} Branch
									</span>

									{/* Google Review Trust Badge */}
									<div
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											gap: '4px',
											fontSize: '0.75rem',
											fontWeight: 600,
											color: '#ffc107',
											background: 'rgba(255, 193, 7, 0.1)',
											padding: '4px 8px',
											borderRadius: '6px',
										}}
									>
										<Star size={13} fill="#ffc107" />
										<span>{unit.rating} ({unit.reviewCount} Reviews)</span>
									</div>
								</div>

								<h2
									style={{
										fontSize: '1.4rem',
										fontWeight: 600,
										margin: '0 0 0.75rem',
										color: 'var(--foreground, #f0f6fc)',
									}}
								>
									{unit.name}
								</h2>

								{/* Area Highlights */}
								<p
									style={{
										fontSize: '0.85rem',
										color: 'var(--muted, #cbd5e0)',
										lineHeight: 1.6,
										margin: '0 0 1.25rem',
										background: 'rgba(255, 255, 255, 0.03)',
										padding: '0.75rem',
										borderRadius: '8px',
										borderLeft: '3px solid var(--accent, #e5a93c)',
									}}
								>
									{unit.areaHighlights}
								</p>

								{/* Physical Office Address */}
								<div
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										gap: '0.5rem',
										fontSize: '0.825rem',
										color: 'var(--foreground, #f0f6fc)',
										marginBottom: '0.75rem',
									}}
								>
									<MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent, #e5a93c)' }} />
									<span>
										<strong>Office Address:</strong> {unit.address}, {unit.city}, {unit.state} – {unit.pincode}
									</span>
								</div>

								{/* Authority Tag */}
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										fontSize: '0.78rem',
										color: 'var(--muted, #8b949e)',
										marginBottom: '1.25rem',
									}}
								>
									<Building2 size={14} style={{ flexShrink: 0 }} />
									<span>Authority: {unit.authority}</span>
								</div>
							</div>

							<div>
								{/* Direct Google Maps & Action Buttons */}
								<div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<a
										href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`}
										target="_blank"
										rel="noreferrer"
										style={{
											flex: 1,
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '0.4rem',
											padding: '0.65rem 0.75rem',
											background: 'rgba(255, 255, 255, 0.05)',
											color: 'var(--foreground, #f0f6fc)',
											fontSize: '0.8rem',
											fontWeight: 600,
											borderRadius: '8px',
											textDecoration: 'none',
											border: '1px solid rgba(255, 255, 255, 0.1)',
										}}
									>
										<Navigation size={14} style={{ color: 'var(--accent, #e5a93c)' }} />
										Google Maps
									</a>

									<a
										href={`https://wa.me/918302806913?text=${encodeURIComponent(`Hello Vistar Models, I am inquiring about scale model services at the ${unit.city} branch.`)}`}
										target="_blank"
										rel="noreferrer"
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '0.4rem',
											padding: '0.65rem 1rem',
											background: 'rgba(37, 211, 102, 0.15)',
											color: '#25d366',
											fontSize: '0.8rem',
											fontWeight: 600,
											borderRadius: '8px',
											textDecoration: 'none',
											border: '1px solid rgba(37, 211, 102, 0.25)',
										}}
									>
										<MessageSquare size={14} />
										WhatsApp
									</a>
								</div>

								{/* Main City Detail Page Link */}
								<Link
									to={`/units/${unit.slug}`}
									style={{
										width: '100%',
										boxSizing: 'border-box',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '0.5rem',
										padding: '0.8rem 1rem',
										background: 'var(--accent, #e5a93c)',
										color: '#000',
										fontWeight: 700,
										fontSize: '0.9rem',
										borderRadius: '8px',
										textDecoration: 'none',
									}}
								>
									Explore {unit.city} Branch & 200 FAQs <ArrowUpRight size={16} />
								</Link>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* National Capability & Trust Badges */}
			<section
				style={{
					background: 'rgba(255, 255, 255, 0.02)',
					borderTop: '1px solid rgba(255, 255, 255, 0.06)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
					padding: '3rem 1.5rem',
					margin: '2rem 0',
				}}
			>
				<div
					style={{
						maxWidth: '1240px',
						margin: '0 auto',
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
						gap: '2rem',
					}}
				>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent, #e5a93c)' }}>
							<ShieldCheck size={20} />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
								MSME UDYAM Registered
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							Officially verified under UDYAM-RJ-17-0536099 by Ministry of Micro, Small & Medium Enterprises, Government of India.
						</p>
					</div>

					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent, #e5a93c)' }}>
							<Building2 size={20} />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
								Pan-India Logistics & Crating
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							Heavy-duty shock-insulated plywood export crating with on-site technician delivery and assembly across all 9 regions.
						</p>
					</div>

					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent, #e5a93c)' }}>
							<Phone size={20} />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
								24/6 Technical Desk
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #a0aec0)', lineHeight: 1.5 }}>
							Round-the-clock requirement consultation and rapid CAD file vectorization from Monday through Saturday.
						</p>
					</div>
				</div>
			</section>

			<ContactCta />
		</main>
	);
}
