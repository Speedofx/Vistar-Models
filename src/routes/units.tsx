import { Link } from 'react-router';
import { ArrowUpRight, MapPin, Building2, CheckCircle2, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { seo, siteOriginFrom, absoluteUrl } from '@/lib/seo';
import { units } from '@/data/units';
import { PageHeading } from '@/components/page-heading';
import { ContactCta } from '@/components/contact-cta';
import { whatsapp } from '@/data/site';

export function meta({ matches, location }: { matches: any[]; location: { pathname: string } }) {
	const origin = siteOriginFrom(matches);
	return seo(
		{ matches, location },
		{
			title: 'Our 9 MSME Operating Units Across India | Vistar Models',
			description:
				'Vistar Models operates 9 registered regional units across Jaipur, Mumbai, Gurugram, Delhi, Bengaluru, Pune, Hyderabad, Ahmedabad, and Noida. UDYAM-RJ-17-0536099.',
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
						{ '@type': 'ListItem', position: 2, name: 'Operating Units', item: absoluteUrl(origin, '/units') },
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
				title="Our 9 Registered Operating Units Across India."
				eyebrow="MSME Registered · UDYAM-RJ-17-0536099"
				intro="Vistar Models operates 9 registered regional units in major Indian metropolitan and industrial hubs. Each unit coordinates architectural, township, industrial, and engineering scale model requirements with local authority, RERA, and market expertise."
			/>

			<section className="section-container" style={{ padding: '0 1.5rem 4rem' }}>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
						gap: '1.75rem',
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
								padding: '2rem',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
								transition: 'transform 0.2s ease, border-color 0.2s ease',
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
										{unit.city} Unit
									</span>
									<span
										style={{
											fontSize: '0.75rem',
											color: 'var(--muted, #8b949e)',
										}}
									>
										{unit.state}
									</span>
								</div>

								<h2
									style={{
										fontSize: '1.35rem',
										fontWeight: 600,
										margin: '0 0 0.75rem',
										color: 'var(--foreground, #f0f6fc)',
									}}
								>
									{unit.name}
								</h2>

								<p
									style={{
										fontSize: '0.875rem',
										color: 'var(--muted, #a0aec0)',
										lineHeight: 1.6,
										margin: '0 0 1.25rem',
									}}
								>
									{unit.description}
								</p>

								<div
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										gap: '0.5rem',
										fontSize: '0.8rem',
										color: 'var(--muted, #8b949e)',
										marginBottom: '0.75rem',
									}}
								>
									<MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent, #e5a93c)' }} />
									<span>
										{unit.address}, {unit.city} – {unit.pincode}
									</span>
								</div>

								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										fontSize: '0.75rem',
										color: 'var(--muted, #718096)',
										marginBottom: '1.25rem',
									}}
								>
									<Building2 size={14} style={{ flexShrink: 0 }} />
									<span>{unit.authority}</span>
								</div>
							</div>

							<div>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										padding: '0.5rem 0.75rem',
										background: 'rgba(255, 255, 255, 0.03)',
										borderRadius: '8px',
										marginBottom: '1.25rem',
										fontSize: '0.75rem',
										color: 'var(--accent, #e5a93c)',
									}}
								>
									<CheckCircle2 size={14} />
									<span>Includes 200 City-Specific FAQs & Tech Specs</span>
								</div>

								<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
									<Link
										to={`/units/${unit.slug}`}
										style={{
											flex: 1,
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '0.5rem',
											padding: '0.75rem 1rem',
											background: 'var(--accent, #e5a93c)',
											color: '#000',
											fontWeight: 600,
											fontSize: '0.875rem',
											borderRadius: '8px',
											textDecoration: 'none',
										}}
									>
										View {unit.city} Unit <ArrowUpRight size={16} />
									</Link>

									<a
										href={`https://wa.me/918302806913?text=${encodeURIComponent(`Hello Vistar Models, I am inquiring about scale model services for ${unit.city}.`)}`}
										target="_blank"
										rel="noreferrer"
										aria-label={`WhatsApp Vistar Models ${unit.city}`}
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '0.75rem',
											background: 'rgba(255, 255, 255, 0.05)',
											color: 'var(--foreground, #f0f6fc)',
											borderRadius: '8px',
											textDecoration: 'none',
											border: '1px solid rgba(255, 255, 255, 0.1)',
										}}
									>
										<MessageSquare size={16} />
									</a>
								</div>
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
