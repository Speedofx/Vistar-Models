import { Link } from 'react-router';
import { ArrowUpRight, Compass, ShieldCheck, Zap, Building2, CheckCircle2 } from 'lucide-react';
import { services } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const METRICS = [
	{
		number: '09',
		unit: 'Cities',
		title: 'Metropolitan Units',
		desc: 'Mumbai, Delhi, Bengaluru, Jaipur, Pune, Hyderabad, Ahmedabad, Gurugram, Noida.',
		icon: Building2,
	},
	{
		number: '0.1',
		unit: 'mm',
		title: 'Laser & CNC Tolerance',
		desc: 'Sub-millimeter machine accuracy on high-rise facades and masterplan details.',
		icon: Zap,
	},
	{
		number: '1:50',
		unit: 'to 1:1000',
		title: 'Scale Flexibility',
		desc: 'From intricate interior floorplates to regional 50,000+ sq.ft masterplans.',
		icon: Compass,
	},
	{
		number: '100%',
		unit: 'Verified',
		title: 'Portfolio Track Record',
		desc: 'Only vetted workshops with verified machine setups and delivery history.',
		icon: ShieldCheck,
	},
];

export function Perspective() {
	return (
		<section className="lux-perspective" aria-label="Scale Model Consultancy Perspective">
			<div className="lux-perspective-container">
				{/* Top Split: The Philosophy & Metric Cards */}
				<div className="lux-perspective-top">
					<ScrollReveal animation="slide-left-3d" className="lux-perspective-info">
						<div className="lux-section-badge">
							<Compass size={13} className="lux-badge-icon" />
							<span>02 / THE CONSULTANCY PARADIGM</span>
						</div>

						<h2 className="lux-perspective-headline">
							Finding the Right Maker Takes More Than a Search.
						</h2>

						<p className="lux-perspective-lead">
							Not every model maker is equipped for every type of scale model.
						</p>

						<p className="lux-perspective-desc">
							Machine tolerances, laser etching capabilities, specialized material palettes,
							multi-zone DMX lighting, and workshop delivery capacity all matter. We clarify
							your technical scope and connect you with specialist fabrication studios suited
							to your exact architectural vision.
						</p>

						<div className="lux-perspective-points">
							<div className="lux-point">
								<CheckCircle2 size={15} className="lux-point-check" />
								<span>Zero broker markups — direct maker quotes and milestone contracts</span>
							</div>
							<div className="lux-point">
								<CheckCircle2 size={15} className="lux-point-check" />
								<span>Strict commercial confidentiality on AutoCAD, SketchUp & Revit drawing submissions</span>
							</div>
							<div className="lux-point">
								<CheckCircle2 size={15} className="lux-point-check" />
								<span>Pan-India crated transport and white-glove gallery installation</span>
							</div>
						</div>

						<div className="lux-perspective-actions">
							<Link to="/find-a-model-maker" className="cmd-btn">
								<span>Tell Us What You Need</span>
								<ArrowUpRight size={15} style={{ marginLeft: 6 }} />
							</Link>
							<Link to="/about" className="lux-glass-link">
								Learn About Our Sourcing Model &rarr;
							</Link>
						</div>
					</ScrollReveal>

					{/* 4 Interactive Glass Metric Cards with 3D Staggered Reveal */}
					<div className="lux-metrics-grid">
						{METRICS.map((m, idx) => {
							const Icon = m.icon;
							return (
								<ScrollReveal key={idx} animation="tilt-in" delay={idx * 80}>
									<div className="lux-metric-card">
										<div className="lux-metric-header">
											<div className="lux-metric-num-wrap">
												<span className="lux-metric-num">{m.number}</span>
												<span className="lux-metric-unit">{m.unit}</span>
											</div>
											<div className="lux-metric-icon-wrap">
												<Icon size={16} />
											</div>
										</div>
										<h3 className="lux-metric-title">{m.title}</h3>
										<p className="lux-metric-desc">{m.desc}</p>
									</div>
								</ScrollReveal>
							);
						})}
					</div>
				</div>

				{/* Bottom Strip: Sourcing Services Roster with Scroll-Trigger */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-services-strip">
						<div className="lux-services-intro">
							<span className="lux-eyebrow-mini">CORE CONSULTANCY</span>
							<h3 className="lux-services-title">
								A Clearer Path from Brief to Maker.
							</h3>
							<p className="lux-services-desc">
								Structured technical scope evaluation before you commit to production.
							</p>
							<Link to="/services" className="cmd-btn mini">
								<span>Explore All Services</span>
								<ArrowUpRight size={13} style={{ marginLeft: 4 }} />
							</Link>
						</div>

						<div className="lux-services-roster">
							{services.slice(0, 4).map(([name, description], i) => (
								<Link to="/services" key={name} className="lux-service-item">
									<span className="lux-service-num">0{i + 1}</span>
									<div className="lux-service-content">
										<h4 className="lux-service-name">{name}</h4>
										<p className="lux-service-detail">{description}</p>
									</div>
									<div className="lux-service-arrow">
										<ArrowUpRight size={17} />
									</div>
								</Link>
							))}
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
