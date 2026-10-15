import { faqs } from '@/data/site';

export function HomeFaq() {
	return (
		<section className="section home-faq" id="faq">
			<p className="label">06 / Scale Model Sourcing FAQs</p>
			<h2>Frequently Asked Questions.<br />Clear answers for your project.</h2>
			<div className="faq-grid" style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
				gap: '1.5rem',
				marginTop: '2.5rem'
			}}>
				{faqs.slice(0, 8).map(([q, a]) => (
					<article
						key={q}
						style={{
							padding: '1.5rem',
							border: '1px solid var(--border, #262626)',
							borderRadius: '8px',
							background: 'var(--surface-subtle, rgba(255,255,255,0.02))'
						}}
					>
						<h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem', color: 'var(--text-primary, #fff)', lineHeight: '1.4' }}>
							{q}
						</h3>
						<p style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #a3a3a3)', lineHeight: '1.6' }}>
							{a}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
