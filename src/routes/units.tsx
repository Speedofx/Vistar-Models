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

			{/* Metro Corridor Quick Station Bar */}
			<section style={{ padding: '0 4% 2rem', maxWidth: '1240px', margin: '0 auto' }}>
				<div style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '8px',
					alignItems: 'center',
					padding: '14px 18px',
					background: 'rgba(32, 33, 36, 0.03)',
					border: '1px solid var(--line)',
				}}>
					<span className="label" style={{ marginRight: '10px', color: 'var(--ink)' }}>
						<span className="yellow-square" /> 9 ACTIVE HUBS:
					</span>
					{units.map((u, i) => (
						<a
							key={u.slug}
							href={`#unit-${u.slug}`}
							style={{
								fontSize: '11px',
								fontFamily: 'monospace',
								padding: '4px 10px',
								border: '1px solid var(--line)',
								background: 'var(--paper)',
								color: 'var(--ink)',
								textTransform: 'uppercase',
								display: 'inline-flex',
								alignItems: 'center',
								gap: '4px',
								textDecoration: 'none',
							}}
						>
							<span style={{ color: 'var(--yellow)', fontWeight: 700 }}>0{i + 1}</span> {u.city}
						</a>
					))}
				</div>
			</section>

			{/* Architectural Masterplan Directory — Clean Terminal Strips (No Cards) */}
			<section style={{ padding: '0 4% 5rem', maxWidth: '1240px', margin: '0 auto' }}>
				<div style={{ borderBottom: '1px solid var(--line)' }}>
					{units.map((unit, idx) => (
						<div
							key={unit.slug}
							id={`unit-${unit.slug}`}
							className="unit-terminal-row"
						>
							{/* Left Column: Station Code & Identity */}
							<div>
								<p className="label" style={{ marginBottom: '8px' }}>
									<span className="yellow-square" /> 0{idx + 1} / REGIONAL UNIT
								</p>
								<h2 style={{ fontSize: 'clamp(24px, 2.4vw, 32px)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.15 }}>
									{unit.city}
								</h2>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
									<span
										style={{
											fontFamily: 'monospace',
											fontSize: '10px',
											padding: '3px 7px',
											background: 'var(--yellow)',
											color: 'var(--ink)',
											fontWeight: 700,
											letterSpacing: '0.04em',
											textTransform: 'uppercase',
										}}
									>
										{unit.state}
									</span>
									<span
										style={{
											fontFamily: 'monospace',
											fontSize: '10px',
											padding: '3px 7px',
											border: '1px solid var(--line)',
											color: 'var(--ink)',
										}}
									>
										{unit.rera}
									</span>
								</div>
								<div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
									<Star size={13} fill="var(--yellow)" stroke="var(--yellow)" />
									<span>{unit.rating} Rating · {unit.reviewCount} Audited Projects</span>
								</div>
							</div>

							{/* Middle Column: Spatial Corridor & Strategic Presence */}
							<div>
								<p className="label" style={{ opacity: 0.7, marginBottom: '6px' }}>
									OFFICE LOCATION & INDUSTRIAL BELT
								</p>
								<p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
									<MapPin size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-1px' }} />
									{unit.address}, {unit.city}, {unit.state} – {unit.pincode}
								</p>
								<p style={{ fontSize: '13px', lineHeight: 1.65, margin: '0 0 12px', color: 'var(--ink)', opacity: 0.9 }}>
									{unit.areaHighlights}
								</p>
								<div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.75, fontFamily: 'monospace' }}>
									<Building2 size={13} />
									<span>Authority Jurisdiction: {unit.authority}</span>
								</div>
							</div>

							{/* Right Column: Direct Institutional Action Terminal */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
								<Link
									to={`/units/${unit.slug}`}
									className="button"
									style={{
										width: '100%',
										justifyContent: 'space-between',
										padding: '14px 18px',
										fontSize: '11px',
										minHeight: '46px',
									}}
								>
									<span>Explore {unit.city} & 200 FAQs</span>
									<ArrowUpRight size={16} />
								</Link>

								<div style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingLeft: '4px' }}>
									<a
										href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`}
										target="_blank"
										rel="noreferrer"
										className="text-link"
										style={{ fontSize: '11px', padding: '4px 0' }}
									>
										<span>Google Maps</span>
										<Navigation size={12} />
									</a>

									<a
										href={`https://wa.me/918302806913?text=${encodeURIComponent(`Hello Vistar Models, I am inquiring about scale model services at the ${unit.city} branch.`)}`}
										target="_blank"
										rel="noreferrer"
										className="text-link"
										style={{ fontSize: '11px', padding: '4px 0' }}
									>
										<span>WhatsApp Desk</span>
										<MessageSquare size={12} />
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* National Capability & Trust Badges */}
			<section
				style={{
					background: 'rgba(32, 33, 36, 0.02)',
					borderTop: '1px solid var(--line)',
					borderBottom: '1px solid var(--line)',
					padding: '3rem 4%',
					margin: '2rem 0',
				}}
			>
				<div
					style={{
						maxWidth: '1240px',
						margin: '0 auto',
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
						gap: '2.5rem',
					}}
				>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
							<ShieldCheck size={20} color="var(--yellow)" />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
								MSME UDYAM Registered
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6 }}>
							Officially verified under UDYAM-RJ-17-0536099 by Ministry of Micro, Small & Medium Enterprises, Government of India.
						</p>
					</div>

					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
							<Building2 size={20} color="var(--yellow)" />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
								Pan-India Logistics & Crating
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6 }}>
							Heavy-duty shock-insulated plywood export crating with on-site technician delivery and assembly across all 9 regions.
						</p>
					</div>

					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
							<Phone size={20} color="var(--yellow)" />
							<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
								24/6 Technical Desk
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6 }}>
							Round-the-clock requirement consultation and rapid CAD file vectorization from Monday through Saturday.
						</p>
					</div>
				</div>
			</section>

			<ContactCta />
		</main>
	);
}
