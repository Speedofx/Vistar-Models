import { Link } from 'react-router';
import { GitCommit, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { steps } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function Process() {
	return (
		<section className="lux-process" aria-label="Scale Model Sourcing Process">
			<div className="lux-process-container">
				{/* Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-process-header">
						<div className="lux-section-badge">
							<GitCommit size={13} className="lux-badge-icon" />
							<span>05 / THE 5-STAGE ORCHESTRATION</span>
						</div>
						<h2 className="lux-process-title">
							From Complex Architectural Brief to Museum Reality.
						</h2>
						<p className="lux-process-subtitle">
							A structured, confidential sourcing process designed for architects,
							developers, and civic agencies across India.
						</p>
					</div>
				</ScrollReveal>

				{/* 5-Step Kinetic Timeline Grid with Staggered 3D Tilt Reveals */}
				<div className="lux-timeline">
					<ScrollReveal animation="circuit-pulse" className="lux-timeline-track" />
					<div className="lux-timeline-steps">
						{steps.map(([name, copy], i) => (
							<ScrollReveal
								key={name}
								animation="tilt-in"
								delay={i * 90}
								className="lux-step-scroll-wrap"
							>
								<div className="lux-step-card">
									<div className="lux-step-node">
										<span className="lux-step-num">0{i + 1}</span>
										<span className="lux-step-halo" />
									</div>
									<div className="lux-step-body">
										<h3 className="lux-step-name">{name}</h3>
										<p className="lux-step-copy">{copy}</p>
									</div>
									<div className="lux-step-bottom-accent" />
								</div>
							</ScrollReveal>
						))}
					</div>
				</div>

				{/* Reassurance Banner */}
				<ScrollReveal animation="fade-up-3d" delay={200}>
					<div className="lux-process-guarantee">
						<div className="lux-guarantee-left">
							<ShieldCheck size={20} className="lux-guarantee-icon" />
							<div>
								<h4 className="lux-guarantee-title">Zero Broker Markup &amp; Direct Maker Contracts</h4>
								<p className="lux-guarantee-desc">
									We consult on scope and facilitate verified introductions. You and the chosen maker contract directly for milestones, staged inspections, and final delivery.
								</p>
							</div>
						</div>
						<Link to="/how-it-works" className="cmd-btn mini">
							<span>Read Full Protocol</span>
							<ArrowUpRight size={13} style={{ marginLeft: 4 }} />
						</Link>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
