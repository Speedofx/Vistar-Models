import { Link } from 'react-router';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, Compass } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface ShowcaseItem {
	id: string;
	number: string;
	category: string;
	headline: string;
	lead: string;
	description: string;
	image: string;
	alt: string;
	badge: string;
	stats: { label: string; value: string }[];
	tags: string[];
	ctaText: string;
	ctaLink: string;
	reverse?: boolean;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
	{
		id: 'architectural',
		number: '01',
		category: 'RESIDENTIAL & COMMERCIAL TOWERS',
		headline: 'Architectural Elegance in Microcosm.',
		lead: 'Machined with sub-millimeter tolerances for developer sales vitrines and design-review summits.',
		description:
			'Every floor plate, curved balustrade, and etched facade mullion is fabricated to perfection. Features warm multi-tier micro-LED illumination that transforms high-rises into captivating focal points in any presentation suite or corporate lobby.',
		image: '/images/cmd_hero_1.webp',
		alt: 'Museum quality high-rise architectural tower scale model with glowing interior lighting',
		badge: '0.1mm Laser Precision',
		stats: [
			{ label: 'Standard Scale', value: '1:50 to 1:150' },
			{ label: 'Finishing', value: 'Matte PU & Brass' },
			{ label: 'Illumination', value: 'Multi-zone Warm LED' },
		],
		tags: ['Curved Glazing', 'Floorplate Cutaways', 'Sales Gallery Vitrines', 'Bespoke Balconies'],
		ctaText: 'Explore Architectural Sourcing',
		ctaLink: '/categories/architectural-makers',
		reverse: false,
	},
	{
		id: 'township',
		number: '02',
		category: 'TOWNSHIP & REGIONAL MASTERPLANS',
		headline: 'Expansive Horizons, Tactile Realism.',
		lead: 'Translating hundreds of acres and dense infrastructure into an intuitive physical spectacle.',
		description:
			'Modular exhibition bases with integrated contour topography, arterial highway grids, and interactive programmable LED lighting. Clients and buyers can illuminate specific development phases, sports complexes, or transport hubs with single-touch tablet controls.',
		image: '/images/cmd_hero_2.webp',
		alt: 'Expansive circular stadium and township masterplan architectural scale model with illuminated arena',
		badge: 'Interactive Tablet DMX',
		stats: [
			{ label: 'Masterplan Scope', value: 'Up to 50,000+ sq.ft' },
			{ label: 'Base Construction', value: 'Modular CNC Hardwood' },
			{ label: 'Lighting Control', value: 'Programmable DMX' },
		],
		tags: ['Topography Relief', 'Micro Landscape Foliage', 'Zonal Lighting', 'Phased Construction'],
		ctaText: 'Consult on Masterplan Models',
		ctaLink: '/categories/township-makers',
		reverse: true,
	},
	{
		id: 'pavilion',
		number: '03',
		category: 'BESPOKE PAVILIONS & CULTURAL LANDMARKS',
		headline: 'Complex Geometries & Timber Louvers.',
		lead: 'Sculptural architecture, parametric roofs, and museum-grade archival display craftsmanship.',
		description:
			'Double-curved envelopes, intricate vertical louvers, cantilevered canopies, and exposed steel trusses rendered with absolute structural fidelity. Engineered for international architectural competitions, museums, and civic presentations.',
		image: '/images/cmd_hero_3.webp',
		alt: 'Contemporary architectural pavilion scale model with intricate vertical wooden louvers and cantilever roof',
		badge: 'Archival Museum Grade',
		stats: [
			{ label: 'Precision Scale', value: '1:20 to 1:100' },
			{ label: 'Primary Mediums', value: 'Natural Teak & Acrylic' },
			{ label: 'Enclosure', value: 'Museum-Grade UV Glazing' },
		],
		tags: ['Natural Timber Louvers', 'Cantilever Structures', 'Exhibition Pedestals', 'Parametric Forms'],
		ctaText: 'View Bespoke Sourcing',
		ctaLink: '/categories/villa-commercial-makers',
		reverse: false,
	},
	{
		id: 'industrial',
		number: '04',
		category: 'INDUSTRIAL PLANTS & HEAVY INFRASTRUCTURE',
		headline: 'Cutaway Engineering for Heavy Industry.',
		lead: 'Explaining complex piping networks, automated machinery, and power grids with tangible clarity.',
		description:
			'Built for global industrial expos, stakeholder reviews, and safety training. Featuring color-coded processing flow lines, transparent acrylic vessels, and removable sectional roofs that expose the inner workings of heavy industrial facilities.',
		image: '/images/cmd_hero_4.webp',
		alt: 'Detailed industrial processing facility scale model with cutaway piping and equipment',
		badge: 'Technical Cutaway Systems',
		stats: [
			{ label: 'Plant Scales', value: '1:50 to 1:250' },
			{ label: 'Process Types', value: 'Chemical, Energy & Power' },
			{ label: 'Crating', value: 'Shockproof Flight Cases' },
		],
		tags: ['Removable Enclosures', 'Color-Coded Flow Lines', 'Machinery Cutaways', 'Transport Flightcases'],
		ctaText: 'Industrial Sourcing Consultation',
		ctaLink: '/categories/industrial-makers',
		reverse: true,
	},
];

export function LuxuryShowcase() {
	return (
		<section className="luxury-showcase" id="perspective" aria-label="Scale Model Craftsmanship Showcase">
			{/* Curated Section Header with 3D Reveal */}
			<ScrollReveal animation="fade-up-3d">
				<div className="luxury-showcase-header">
					<div className="lux-section-badge">
						<Sparkles size={13} className="lux-badge-icon" />
						<span>01 / SIGNATURE CRAFTSMANSHIP &amp; SCOPE</span>
					</div>
					<h2 className="luxury-showcase-title">
						Precision Engineered at Every Scale.
					</h2>
					<p className="luxury-showcase-subtitle">
						From intimate 1:50 luxury sales vitrines to sprawling 1:1000 regional masterplans,
						experience the pinnacle of scale model artistry and technical fabrication.
					</p>
				</div>
			</ScrollReveal>

			{/* Alternating Showcase Rows with 3D Scroll-Triggered Transitions */}
			<div className="luxury-showcase-list">
				{SHOWCASE_ITEMS.map((item, idx) => (
					<article
						key={item.id}
						className={`luxury-row ${item.reverse ? 'luxury-row-reversed' : ''}`}
					>
						{/* Text / Editorial Column (Slides in with 3D depth) */}
						<ScrollReveal
							animation={item.reverse ? 'slide-right-3d' : 'slide-left-3d'}
							delay={60}
							className="luxury-col-text"
						>
							<div className="luxury-item-meta">
								<span className="luxury-item-number">{item.number}</span>
								<span className="luxury-item-divider" />
								<span className="luxury-item-cat">{item.category}</span>
							</div>

							<h3 className="luxury-item-headline">{item.headline}</h3>

							<p className="luxury-item-lead">{item.lead}</p>

							<p className="luxury-item-desc">{item.description}</p>

							{/* Specs Grid */}
							<div className="luxury-specs-grid">
								{item.stats.map((stat, sIdx) => (
									<div key={sIdx} className="luxury-spec-card">
										<span className="luxury-spec-label">{stat.label}</span>
										<span className="luxury-spec-value">{stat.value}</span>
									</div>
								))}
							</div>

							{/* Tags Pill Row */}
							<div className="luxury-tags">
								{item.tags.map((tag, tIdx) => (
									<span key={tIdx} className="luxury-tag">
										<CheckCircle2 size={11} className="luxury-tag-check" />
										{tag}
									</span>
								))}
							</div>

							{/* Action Buttons: Minimalist Outline CMD Style */}
							<div className="luxury-item-actions">
								<Link to={item.ctaLink} className="cmd-btn">
									<span>{item.ctaText}</span>
									<ArrowUpRight size={15} style={{ marginLeft: 6 }} />
								</Link>
								<Link to="/find-a-model-maker" className="lux-glass-link">
									Discuss Brief &rarr;
								</Link>
							</div>
						</ScrollReveal>

						{/* Photo Column with Shutter Wipe & Light Flare */}
						<ScrollReveal
							animation="shutter-reveal"
							delay={60}
							className="luxury-col-media"
						>
							<div className="luxury-media-frame">
								<div className="luxury-media-ambient" />
								<img
									src={item.image}
									alt={item.alt}
									className="luxury-media-img"
									loading="eager"
									decoding="async"
									width={720}
									height={450}
								/>
								<div className="luxury-media-overlay" />

								{/* Floating Glass Badge */}
								<div className="luxury-media-badge">
									<Layers size={13} />
									<span>{item.badge}</span>
								</div>

								{/* Scale & Compass Marker */}
								<div className="luxury-media-corner">
									<Compass size={14} />
									<span>100% Bespoke Physical Craft</span>
								</div>
							</div>
						</ScrollReveal>
					</article>
				))}
			</div>
		</section>
	);
}
