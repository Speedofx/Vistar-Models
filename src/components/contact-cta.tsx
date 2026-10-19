import { Link } from 'react-router';
import { ArrowUpRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { whatsapp } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function ContactCta() {
	return (
		<section className="lux-cta" aria-label="Executive Briefing Consultation">
			<div className="lux-cta-container">
				{/* The Executive Glowing Frame with 3D Zoom In */}
				<ScrollReveal animation="zoom-in-3d">
					<div className="lux-cta-card">
						<div className="lux-cta-ambient-glow" />
						<div className="lux-cta-inner">
							<div className="lux-section-badge">
								<Sparkles size={13} className="lux-badge-icon" />
								<span>EXECUTIVE SCALE-MODEL CONSULTATION</span>
							</div>

							<h2 className="lux-cta-title">
								Bring Your Architectural Vision to Life.
							</h2>

							<p className="lux-cta-subtitle">
								Submit your project drawings, scale targets, or technical parameters.
								Our consultants in Jaipur, Mumbai, Delhi, and Bengaluru will evaluate your scope
								and introduce verified fabrication studios with proven machine precision.
							</p>

							{/* Action Buttons: Minimalist Outline & Glass WhatsApp */}
							<div className="lux-cta-actions">
								<Link to="/find-a-model-maker" className="cmd-btn large">
									<span>Submit Your Project Brief</span>
									<ArrowUpRight size={16} style={{ marginLeft: 8 }} />
								</Link>

								<a
									href={whatsapp}
									target="_blank"
									rel="noreferrer"
									className="lux-whatsapp-btn"
								>
									<MessageSquare size={16} />
									<span>Connect on WhatsApp Desk</span>
								</a>
							</div>

							{/* Reassurance Tags */}
							<div className="lux-cta-reassurance">
								<div className="lux-reassurance-item">
									<ShieldCheck size={14} className="lux-reassurance-icon" />
									<span>Strict Commercial Confidentiality (NDA on Request)</span>
								</div>
								<div className="lux-reassurance-item">
									<ShieldCheck size={14} className="lux-reassurance-icon" />
									<span>Direct Maker Milestones &middot; Zero Hidden Broker Fees</span>
								</div>
								<div className="lux-reassurance-item">
									<ShieldCheck size={14} className="lux-reassurance-icon" />
									<span>Pan-India Crated Transit &middot; On-Site Gallery Installation</span>
								</div>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
