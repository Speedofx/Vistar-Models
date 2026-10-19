import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const HOMEPAGE_FAQS = [
	{
		question: 'What does Vistar Models do?',
		answer:
			'Vistar Models is a specialized scale-model consultancy — not a factory or broker. We help architects, developers, and infrastructure clients evaluate technical scope, identify verified specialist makers, and facilitate direct introductions to relevant workshops across India with zero broker markups.',
	},
	{
		question: 'How much does an architectural scale model cost in India?',
		answer:
			'Costs vary based on scale (1:50 to 1:1000), material palette (cast acrylic, brass, natural hardwood), and illumination (multi-zone DMX LEDs). A basic residential review model starts around ₹50,000–₹1,50,000. An elaborate sales-gallery high-rise vitrine or township masterplan ranges from ₹3,00,000 to ₹18,00,000+. We help structure your brief so makers quote accurately without surprise add-ons.',
	},
	{
		question: 'Which cities do you coordinate scale-model sourcing in?',
		answer:
			'We coordinate scale-model sourcing across 9 major metropolitan units: Mumbai, Delhi, Bengaluru, Jaipur, Gurugram, Pune, Hyderabad, Ahmedabad, and Noida, handling pan-India transport in custom shockproof flight cases and on-site gallery installation.',
	},
	{
		question: 'How long does a scale model take to manufacture?',
		answer:
			'Standard fabrication timelines range from 3–4 weeks for residential villas and design review cutaways, to 6–10 weeks for high-rise towers with illuminated interiors, and up to 12 weeks for complex regional infrastructure or airport masterplans.',
	},
	{
		question: 'What design files can we submit for consultation?',
		answer:
			'We accept AutoCAD (.DWG/.DXF), SketchUp (.SKP), Revit BIM models, Rhino, 3ds Max, or high-resolution architectural PDFs. All client data and drawings are handled with strict commercial confidentiality under Non-Disclosure agreements.',
	},
	{
		question: 'Do you work with government and infrastructure projects?',
		answer:
			'Yes. We source physical models for public-sector authorities, infrastructure and civil engineering firms, technical universities, and municipal/MMRDA bodies, in addition to private real estate developers and architectural studios.',
	},
];

export function HomepageFaq() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

	return (
		<section className="lux-faq" aria-label="Frequently Asked Questions">
			{/* JSON-LD Schema for AI & Search Parsers */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: HOMEPAGE_FAQS.map(faq => ({
							'@type': 'Question',
							name: faq.question,
							acceptedAnswer: {
								'@type': 'Answer',
								text: faq.answer,
							},
						})),
					}),
				}}
			/>

			<div className="lux-faq-container">
				{/* Section Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-faq-header">
						<div className="lux-section-badge">
							<HelpCircle size={13} className="lux-badge-icon" />
							<span>08 / CLARITY BEFORE COMMITMENT</span>
						</div>
						<h2 className="lux-faq-title">Frequently Addressed Inquiries.</h2>
						<p className="lux-faq-subtitle">
							Straightforward guidance on scale-model procurement, pricing parameters,
							lead times, and technical scope across India.
						</p>
					</div>
				</ScrollReveal>

				{/* Luxury Glass Accordion with Staggered 3D Reveal */}
				<div className="lux-faq-list">
					{HOMEPAGE_FAQS.map((faq, idx) => {
						const isOpen = openIndex === idx;
						return (
							<ScrollReveal key={idx} animation="tilt-in" delay={idx * 60}>
								<div className={`lux-faq-item ${isOpen ? 'open' : ''}`}>
									<button
										className="lux-faq-trigger"
										onClick={() => toggle(idx)}
										aria-expanded={isOpen}
										id={`faq-btn-${idx}`}
										aria-controls={`faq-panel-${idx}`}
									>
										<span className="lux-faq-num">0{idx + 1}</span>
										<span className="lux-faq-q">{faq.question}</span>
										<span className="lux-faq-chevron">
											<ChevronDown size={18} />
										</span>
									</button>
									<div
										id={`faq-panel-${idx}`}
										role="region"
										aria-labelledby={`faq-btn-${idx}`}
										className={`lux-faq-panel ${isOpen ? 'open' : ''}`}
									>
										<p className="lux-faq-answer">{faq.answer}</p>
									</div>
								</div>
							</ScrollReveal>
						);
					})}
				</div>

				<div className="lux-faq-footer">
					<span>Have a custom municipal, defence, or high-rise enquiry?</span>
					<Link to="/contact" className="lux-glass-link">
						Speak Directly with a Senior Consultant &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
