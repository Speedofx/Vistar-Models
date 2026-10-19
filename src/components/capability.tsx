import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Cpu, Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const CAPABILITIES = [
	{
		id: 'cnc',
		tab: '01 / CNC Multi-Axis Milling',
		title: 'Sub-Millimeter CNC Facade & Structural Milling',
		lead: 'Machining monolithic acrylic blocks, metals, and composite substrates with 0.05mm precision.',
		desc: 'Ideal for complex curtain walls, parametric roofs, and razor-sharp floorplates. Every joint and interlocking module fits with museum-grade tolerances, eliminating visible seams in high-scrutiny presentations.',
		image: '/images/cmd_hero_1.jpg',
		alt: 'Precision CNC milled architectural facade model showing sharp mullions',
		badge: '±0.05mm Tooling Tolerance',
		specs: [
			{ label: 'Substrates', value: 'Cast Acrylic, Aluminium, PU' },
			{ label: 'Applications', value: 'Double-Curved Facades & Spire Details' },
			{ label: 'Finishing', value: 'Automotive Grade Polyurethane' },
		],
		features: [
			'Continuous multi-axis contour milling',
			'Monolithic acrylic floorplates without joints',
			'Laser-calibrated structural interlocks',
		],
	},
	{
		id: 'sla',
		tab: '02 / High-Res SLA/SLS Printing',
		title: 'Micro-Detail Additive Polymer Fabrication',
		lead: 'Capturing microscopic balustrades, organic sculptural canopies, and miniature statuary.',
		desc: 'When geometric complexity exceeds traditional subtractive tooling, industrial SLA & SLS stereolithography reproduces intricate parametric forms, landscape furniture, and interior fixtures with micro-level surface fidelity.',
		image: '/images/printing.webp',
		alt: 'High resolution 3D printed architectural facade and stair components',
		badge: '25-Micron Layer Resolution',
		specs: [
			{ label: 'Technology', value: 'Industrial SLA / SLS Polymers' },
			{ label: 'Applications', value: 'Complex Geometries & Micro Foliage' },
			{ label: 'Post-Cure', value: 'Hand-Smoothed & Matte Lacquered' },
		],
		features: [
			'Zero support artifact surface finishing',
			'High-tensile architectural resin components',
			'Extreme overhang and cantilever reproduction',
		],
	},
	{
		id: 'dmx',
		tab: '03 / Multi-Zone DMX Illumination',
		title: 'Smart Tablet-Controlled LED Choreography',
		lead: 'Bringing static architecture alive with dynamic lighting zones and interactive storytelling.',
		desc: 'Multi-circuit DMX controllers illuminate distinct towers, amenities, transport lines, or phasing zones independently. Controlled via custom iPad/tablet interface during high-stakes sales gallery walkthroughs and board reviews.',
		image: '/images/cmd_hero_2.jpg',
		alt: 'Illuminated stadium and masterplan scale model with glowing LED zones',
		badge: 'Programmable DMX Circuits',
		specs: [
			{ label: 'Color Temp', value: '2700K Warm — 6500K Cool White' },
			{ label: 'Control', value: 'Wireless iPad App & DMX-512' },
			{ label: 'Integration', value: 'Concealed Sub-Plinth Power Rails' },
		],
		features: [
			'Independent apartment and podium circuit zoning',
			'Pulsing transit corridor and arterial light paths',
			'Day-to-night ambient dimming automation',
		],
	},
	{
		id: 'joinery',
		tab: '04 / Joinery & Plinth Craft',
		title: 'Fine Timber Bases & Archival Vitrine Glazing',
		lead: 'The pedestal is as critical as the model. Hardwood plinths built for permanence.',
		desc: 'Crafted from solid seasoned teak, walnut, or brushed stainless steel. Fitted with optically pure, anti-reflective, UV-filtering acrylic covers that protect the investment from dust and UV discoloration across decades of exhibition.',
		image: '/images/cmd_hero_3.jpg',
		alt: 'Contemporary pavilion model on finished hardwood base with vertical louvers',
		badge: 'Archival Vitrine Pedestals',
		specs: [
			{ label: 'Timbers', value: 'Burma Teak, American Walnut, Oak' },
			{ label: 'Glazing', value: 'Opti-Clear UV Filtering Acrylic' },
			{ label: 'Transport', value: 'Reinforced Flightcases with Shock Foam' },
		],
		features: [
			'CNC routed chamfered edge hardwood plinths',
			'Embedded brass attribution and scale plaques',
			'Integrated cable management and ventilation',
		],
	},
];

export function Capability() {
	const [activeIdx, setActiveIdx] = useState(0);
	const active = CAPABILITIES[activeIdx];

	return (
		<section className="lux-capability" aria-label="Precision Scale Model Capabilities">
			<div className="lux-capability-container">
				{/* Section Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-capability-header">
						<div className="lux-section-badge">
							<Cpu size={13} className="lux-badge-icon" />
							<span>04 / SPECIALIST FABRICATION TOOLING</span>
						</div>
						<h2 className="lux-capability-title">
							Machined Precision Meets Master Craft.
						</h2>
						<p className="lux-capability-subtitle">
							The right scale-model partner is defined by equipment caliber, material mastery,
							and lighting integration. Explore our network's specialized fabrication spectrum.
						</p>
					</div>
				</ScrollReveal>

				{/* Interactive Tab Switcher */}
				<ScrollReveal animation="fade-up-3d" delay={80}>
					<div className="lux-cap-tabs" role="tablist" aria-label="Fabrication Capabilities">
						{CAPABILITIES.map((cap, idx) => (
							<button
								key={cap.id}
								onClick={() => setActiveIdx(idx)}
								className={`lux-cap-tab ${idx === activeIdx ? 'active' : ''}`}
								role="tab"
								aria-selected={idx === activeIdx}
							>
								<Sliders size={13} className="lux-tab-icon" />
								<span>{cap.tab}</span>
							</button>
						))}
					</div>
				</ScrollReveal>

				{/* Active Capability Display Frame with 3D Depth */}
				<ScrollReveal animation="zoom-in-3d" delay={120}>
					<div className="lux-cap-stage">
						{/* Left: Technical Specs & Description */}
						<div className="lux-cap-details">
							<span className="lux-cap-badge-tag">{active.badge}</span>
							<h3 className="lux-cap-headline">{active.title}</h3>
							<p className="lux-cap-lead">{active.lead}</p>
							<p className="lux-cap-desc">{active.desc}</p>

							{/* 3 Spec Cards */}
							<div className="lux-cap-specs">
								{active.specs.map((sp, sIdx) => (
									<div key={sIdx} className="lux-cap-spec-item">
										<span className="lux-cap-spec-label">{sp.label}</span>
										<span className="lux-cap-spec-val">{sp.value}</span>
									</div>
								))}
							</div>

							{/* Feature Bullet Points */}
							<div className="lux-cap-features">
								{active.features.map((ft, fIdx) => (
									<div key={fIdx} className="lux-cap-feature">
										<CheckCircle2 size={13} className="lux-cap-check" />
										<span>{ft}</span>
									</div>
								))}
							</div>

							<div className="lux-cap-actions">
								<Link to="/find-a-model-maker" className="cmd-btn mini">
									<span>Request Capability Briefing</span>
									<ArrowUpRight size={14} style={{ marginLeft: 4 }} />
								</Link>
							</div>
						</div>

						{/* Right: Studio Visual Showcase Frame with Laser Scanner Effect */}
						<div className="lux-cap-visual">
							<ScrollReveal animation="laser-scan" className="lux-cap-visual-frame">
								<img
									src={active.image}
									alt={active.alt}
									className="lux-cap-img"
									loading="lazy"
								/>
								<div className="lux-cap-img-overlay" />
								<div className="lux-cap-scanner-beam" />
								<div className="lux-cap-floating-chip">
									<Layers size={12} />
									<span>{active.badge}</span>
								</div>
							</ScrollReveal>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
