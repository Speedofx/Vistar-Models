import { Link } from 'react-router';
import { ArrowUpRight, Award, ShieldCheck, Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function Founder() {
	return (
		<section className="lux-founder" aria-label="Founder and Consultancy Heritage">
			<div className="lux-founder-container">
				<div className="lux-founder-grid">
					{/* Left: Founder Quote & Credentials */}
					<ScrollReveal animation="slide-left-3d" className="lux-founder-left">
						<div className="lux-section-badge">
							<ShieldCheck size={13} className="lux-badge-icon" />
							<span>AN INDEPENDENT CONSULTANCY &middot; EST. 2026</span>
						</div>

						<h2 className="lux-founder-title">
							Building Better Connections in Scale Model Sourcing.
						</h2>

						<div className="lux-founder-quote-box">
							<Quote size={24} className="lux-quote-icon" />
							<p className="lux-quote-text">
								“A scale model is not merely a miniaturized structure; it is the ultimate tactile proof of an architect’s intent and a developer’s commercial ambition. Our mission is ensuring every brief finds the single workshop in India best equipped to build it.”
							</p>
							<div className="lux-founder-meta">
								<span className="lux-founder-name">Yogendra Yogi</span>
								<span className="lux-founder-role">Founder &amp; Principal Consultant, Vistar Models</span>
							</div>
						</div>
					</ScrollReveal>

					{/* Right: Operational Values & UDYAM MSME Verification */}
					<ScrollReveal animation="slide-right-3d" delay={100} className="lux-founder-right">
						<div className="lux-founder-card">
							<h3 className="lux-founder-card-title">Consultancy, Not a Workshop</h3>
							<p className="lux-founder-card-desc">
								Vistar Models operates as an independent consultancy — not a factory or broker.
								We do not impose middleman markups. We clarify technical tolerances, ensure commercial
								confidentiality on CAD submissions, and connect clients directly with vetted fabrication specialists.
							</p>

							<div className="lux-udyam-badge">
								<Award size={18} className="lux-udyam-icon" />
								<div>
									<span className="lux-udyam-label">GOVERNMENT OF INDIA MSME REGISTERED</span>
									<span className="lux-udyam-val">UDYAM-RJ-17-0536099 &middot; JAIPUR, RAJASTHAN</span>
								</div>
							</div>

							<div className="lux-founder-actions">
								<Link to="/about" className="cmd-btn mini">
									<span>About Vistar Models</span>
									<ArrowUpRight size={14} style={{ marginLeft: 4 }} />
								</Link>
								<Link to="/units" className="lux-glass-link">
									Explore Our 9 Metropolitan Units &rarr;
								</Link>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
