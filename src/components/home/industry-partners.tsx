import { Link } from 'react-router';
import { ArrowUpRight, Building, Award } from 'lucide-react';
import { industries } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function IndustryPartners() {
	return (
		<section className="lux-industries" aria-label="Industries Served">
			<div className="lux-industries-container">
				{/* Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-industries-header">
						<div className="lux-section-badge">
							<Building size={13} className="lux-badge-icon" />
							<span>06 / ACROSS SECTORS &middot; ACROSS INDIA</span>
						</div>
						<h2 className="lux-industries-title">
							For Visionaries Who Shape Physical Landscapes.
						</h2>
						<p className="lux-industries-subtitle">
							Connecting architectural masters, infrastructure authorities, and heavy industry
							with vetted model-making artisans.
						</p>
					</div>
				</ScrollReveal>

				{/* 8 Industry Luxury Chips with Staggered 3D Reveals */}
				<div className="lux-industry-chips">
					{industries.map(([name, desc], idx) => (
						<ScrollReveal
							key={name}
							animation="domino-flip"
							delay={idx * 70}
							className="lux-ind-scroll-wrap"
						>
							<div className="lux-industry-card">
								<div className="lux-industry-header">
									<span className="lux-ind-num">0{idx + 1}</span>
									<h3 className="lux-ind-name">{name}</h3>
								</div>
								<p className="lux-ind-desc">{desc}</p>
								<div className="lux-ind-accent" />
							</div>
						</ScrollReveal>
					))}
				</div>

				{/* Workshop Network Onboarding Dock */}
				<ScrollReveal animation="zoom-in-3d" delay={150}>
					<div className="lux-maker-dock">
						<div className="lux-maker-left">
							<div className="lux-maker-badge">
								<Award size={13} />
								<span>MAKER NETWORK ONBOARDING</span>
							</div>
							<h3 className="lux-maker-title">Are You a Scale Model Workshop?</h3>
							<p className="lux-maker-desc">
								Submit your workshop capabilities, laser/CNC machine specifications, and verified portfolio to receive qualified architectural briefs across our pan-India network.
							</p>
						</div>
						<div className="lux-maker-right">
							<Link to="/become-a-partner" className="cmd-btn">
								<span>Join the Maker Network</span>
								<ArrowUpRight size={15} style={{ marginLeft: 6 }} />
							</Link>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
