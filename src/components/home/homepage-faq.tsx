import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const HOMEPAGE_FAQS = [
	{
		question: 'What does Vistar Models do?',
		answer:
			'Vistar Models is a scale-model consultancy — not a manufacturer. We help architects, developers, and infrastructure clients clarify their model requirements, identify verified specialist makers, and facilitate direct introductions to relevant workshops across India.',
	},
	{
		question: 'How much does a scale model cost in India?',
		answer:
			'Costs vary by scale, size, materials, and detailing. A basic 1:200 residential model starts from approximately ₹50,000–₹1,50,000. A detailed sales-gallery high-rise model with LED lighting can range from ₹3,00,000–₹15,00,000 or more. We help you clarify scope so makers can quote accurately.',
	},
	{
		question: 'Which cities do you serve?',
		answer:
			'We source scale models across 9 cities: Mumbai, Delhi, Jaipur, Gurugram, Bengaluru, Pune, Hyderabad, Ahmedabad, and Noida, with pan-India transport and installation coordination.',
	},
	{
		question: 'How long does a scale model take to make?',
		answer:
			'Production timelines range from 3–4 weeks for simpler residential models to 6–12 weeks for large township masterplans or detailed LED-lit high-rise models. Share your delivery deadline when submitting your brief.',
	},
	{
		question: 'What files should I prepare?',
		answer:
			'2D CAD (DWG/DXF), 3D BIM/Revit, SketchUp, Rhino, or high-resolution architectural PDFs. All drawings are handled with commercial confidentiality.',
	},
	{
		question: 'Do you work with government and infrastructure projects?',
		answer:
			'Yes. We source scale models for public-sector buyers, infrastructure and engineering firms, educational institutions, and municipal/MMRDA projects, in addition to private developers and architects.',
	},
];

export function HomepageFaq() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

	return (
		<section className="homepage-faq section" aria-label="Frequently asked questions">
			{/* Hidden FAQPage JSON-LD for AI parsers — duplicates the visible accordion */}
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

			<div className="homepage-faq-inner">
				<div className="homepage-faq-header">
					<p className="label">
						<span className="yellow-square" /> Common Questions
					</p>
					<h2>
						Everything You Need to Know
						<span>.</span>
					</h2>
					<p className="homepage-faq-sub">
						Straightforward answers about how scale-model sourcing works, what it costs, and what to
						prepare before you reach out.
					</p>
				</div>

				<div className="homepage-faq-list" role="list">
					{HOMEPAGE_FAQS.map((faq, i) => {
						const isOpen = openIndex === i;
						return (
							<div key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`} role="listitem">
								<button
									type="button"
									aria-expanded={isOpen}
									aria-controls={`faq-answer-${i}`}
									id={`faq-question-${i}`}
									className="faq-trigger"
									onClick={() => toggle(i)}
								>
									<span className="faq-q-number">Q{i + 1}</span>
									<span className="faq-q-text">{faq.question}</span>
									<ChevronDown
										size={20}
										className="faq-chevron"
										aria-hidden="true"
									/>
								</button>
								<div
									id={`faq-answer-${i}`}
									role="region"
									aria-labelledby={`faq-question-${i}`}
									className="faq-answer"
									hidden={!isOpen}
								>
									<p>{faq.answer}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
