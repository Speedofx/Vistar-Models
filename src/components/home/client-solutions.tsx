import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Compass, Building2, Landmark, Factory, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface PersonaSolution {
	id: string;
	tabTitle: string;
	roleLabel: string;
	icon: any;
	hook: string;
	description: string;
	deliverables: string[];
	specs: { label: string; value: string }[];
	ctaText: string;
	ctaLink: string;
	image: string;
}

const PERSONA_SOLUTIONS: PersonaSolution[] = [
	{
		id: 'architects',
		tabTitle: '01 / Architects & Design Studios',
		roleLabel: 'PRIMARY PARTNER — 50%+ OF SOURCING',
		icon: Compass,
		hook: 'Sub-Millimeter Fidelity to Your CAD & Revit BIM Models.',
		description:
			'You spend months perfecting facade mullions, cantilevered rooflines, and spatial circulation. We connect you with master craftsmen who fabricate with 0.1mm laser precision, natural timber louvers, and museum-grade finishes that honor your exact architectural vision.',
		deliverables: [
			'Design-Review & Competition Scale Vitrines',
			'Double-Curved & Parametric Façade Prototyping',
			'Sub-Millimeter Laser-Etched Acrylic & Teak Wood Assembly',
			'Monolithic Floorplate Cutaways with Multi-Tier Warm LED',
		],
		specs: [
			{ label: 'CNC & Tooling Tolerance', value: '±0.05 mm' },
			{ label: 'Compatible Design Formats', value: 'CAD, Revit BIM, Rhino, PDF' },
			{ label: 'Primary Mediums', value: 'Cast Acrylic, Natural Teak, PU' },
		],
		ctaText: 'Submit Architectural Drawings',
		ctaLink: '/find-a-model-maker?role=architect',
		image: '/images/cmd_hero_3.webp',
	},
	{
		id: 'builders',
		tabTitle: '02 / Builders & Developers',
		roleLabel: 'COMMERCIAL SALES ACCELERATOR',
		icon: Building2,
		hook: 'Sales Gallery Vitrines That Close Buyers Before Ground is Broken.',
		description:
			'A high-rise tower or luxury villa model is your most potent sales tool. Featuring wireless iPad-controlled DMX lighting to highlight specific phases, luxury presentation plinths, and pristine museum acrylic covers that convert VIP buyers instantly.',
		deliverables: [
			'High-Impact Residential & Commercial Sales Vitrines',
			'Interactive Tablet DMX Lighting (Phasing & Zonal Illumination)',
			'Full Township Topography & Amenity Landscaping',
			'Shockproof Crating & Guaranteed Launch Gallery Installation',
		],
		specs: [
			{ label: 'Sales Gallery Scales', value: '1:50 to 1:150' },
			{ label: 'Lighting Systems', value: 'Programmable iPad / DMX-512' },
			{ label: 'Transit Protection', value: 'Custom Shockproof Flight Cases' },
		],
		ctaText: 'Request Sales Gallery Sourcing',
		ctaLink: '/find-a-model-maker?role=builder',
		image: '/images/cmd_hero_1.webp',
	},
	{
		id: 'governments',
		tabTitle: '03 / Governments & Civic',
		roleLabel: 'INFRASTRUCTURE & SCALE MASTERPLANS',
		icon: Landmark,
		hook: 'Civic Scale & Regional Infrastructure Built for High-Stakes Summits.',
		description:
			'From metro corridors and airport interchanges to 50,000+ sq.ft regional riverfront masterplans. Engineered with modular bases for easy transport, public exhibition durability, and strict compliance with government procurement standards.',
		deliverables: [
			'Metro Corridors, Highways & Transit Interchanges',
			'Regional Masterplans (Up to 50,000+ sq.ft Modular Base)',
			'Museum & Civic Center Public Educational Exhibits',
			'Government MSME Registered (UDYAM-RJ-17-0536099)',
		],
		specs: [
			{ label: 'Masterplan Scope', value: '1:500 to 1:2000 Regional' },
			{ label: 'Base Construction', value: 'Modular Hardwood Interlocks' },
			{ label: 'Verification', value: 'GOI MSME Registered UDYAM' },
		],
		ctaText: 'Consult on Civic Infrastructure',
		ctaLink: '/find-a-model-maker?role=government',
		image: '/images/cmd_hero_2.webp',
	},
	{
		id: 'industrialists',
		tabTitle: '04 / Industrial Leaders',
		roleLabel: 'TECHNICAL CLARITY & PROCESS FLOW',
		icon: Factory,
		hook: 'Cutaway Engineering Models Explaining Complex Plants with Tangible Clarity.',
		description:
			'Explaining multi-crore chemical refineries, automated packaging lines, and power grids to investors and boards. Features color-coded processing lines, removable cutaway roofs, and strict commercial confidentiality for proprietary plant schematics.',
		deliverables: [
			'Chemical, Power & Processing Facility Scale Models',
			'Color-Coded Piping Networks & Equipment Cutaways',
			'Removable Sectional Enclosures for Internal Inspection',
			'Confidential NDA Handling of Proprietary Plant Schematics',
		],
		specs: [
			{ label: 'Plant Scales', value: '1:50 to 1:250' },
			{ label: 'Process Systems', value: 'Color-Coded Technical Flow' },
			{ label: 'Security Protocol', value: 'Strict Commercial NDA Standard' },
		],
		ctaText: 'Submit Industrial Sourcing Brief',
		ctaLink: '/find-a-model-maker?role=industrial',
		image: '/images/cmd_hero_4.webp',
	},
];

export function ClientSolutions() {
	const [activeIdx, setActiveIdx] = useState(0);
	const active = PERSONA_SOLUTIONS[activeIdx];
	const ActiveIcon = active.icon;

	return (
		<section className="lux-solutions-section" aria-label="Solutions for 4 Key Decision Makers">
			<div className="lux-solutions-container">
				{/* Header with 3D Reveal */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-solutions-header">
						<div className="lux-section-badge">
							<ShieldCheck size={13} className="lux-badge-icon" />
							<span>BUILT FOR 4 DECISION MAKERS</span>
						</div>
						<h2 className="lux-solutions-title">
							Who We Build For. What You Get.
						</h2>
						<p className="lux-solutions-subtitle">
							Zero text bloat. Direct, precision physical solutions tailored to the exact commercial
							and architectural demands of your industry.
						</p>
					</div>
				</ScrollReveal>

				{/* 4 Persona Tabs Switcher */}
				<div className="lux-solutions-tabs" role="tablist" aria-label="Select your role">
					{PERSONA_SOLUTIONS.map((item, idx) => {
						const TabIcon = item.icon;
						const isSelected = idx === activeIdx;
						return (
							<button
								key={item.id}
								role="tab"
								aria-selected={isSelected}
								className={`lux-solution-tab ${isSelected ? 'active' : ''}`}
								onClick={() => setActiveIdx(idx)}
							>
								<TabIcon size={16} className="lux-tab-icon" />
								<span>{item.tabTitle}</span>
							</button>
						);
					})}
				</div>

				{/* Dynamic Showcase Stage */}
				<div className="lux-solution-stage">
					{/* Left: Solution & Deliverables */}
					<div className="lux-solution-content">
						<div className="lux-solution-role">
							<ActiveIcon size={14} className="lux-role-icon" />
							<span>{active.roleLabel}</span>
						</div>

						<h3 className="lux-solution-headline">{active.hook}</h3>
						<p className="lux-solution-desc">{active.description}</p>

						{/* 4 Key Deliverables */}
						<div className="lux-solution-deliverables">
							<span className="lux-deliverables-title">CORE PROJECT DELIVERABLES:</span>
							<ul className="lux-deliverables-list">
								{active.deliverables.map((del, dIdx) => (
									<li key={dIdx} className="lux-deliverable-item">
										<CheckCircle2 size={14} className="lux-del-check" />
										<span>{del}</span>
									</li>
								))}
							</ul>
						</div>

						{/* 3 Specs Cards */}
						<div className="lux-solution-specs">
							{active.specs.map((sp, sIdx) => (
								<div key={sIdx} className="lux-solution-spec-card">
									<span className="lux-spec-label">{sp.label}</span>
									<span className="lux-spec-value">{sp.value}</span>
								</div>
							))}
						</div>

						{/* Action Triggers */}
						<div className="lux-solution-actions">
							<Link to={active.ctaLink} className="cmd-btn">
								<span>{active.ctaText}</span>
								<ArrowUpRight size={15} style={{ marginLeft: 6 }} />
							</Link>
							<a
								href="https://wa.me/918302806913?text=Hello%20Vistar%20Models,%20I%20would%20like%20to%20discuss%20a%20scale%20model%20requirement."
								target="_blank"
								rel="noreferrer"
								className="lux-glass-link"
							>
								Instant WhatsApp Technical Review &rarr;
							</a>
						</div>
					</div>

					{/* Right: Visual Physical Model Exhibit */}
					<div className="lux-solution-visual">
						<div className="lux-solution-media-frame">
							<img
								src={active.image}
								alt={active.hook}
								className="lux-solution-img"
								loading="lazy"
								decoding="async"
								width={680}
								height={460}
							/>
							<div className="lux-solution-media-overlay" />
							<div className="lux-solution-floating-badge">
								<Zap size={13} />
								<span>0.1mm Tolerances &bull; Vetted Fabrication Network</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
