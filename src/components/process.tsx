import { steps } from '@/data/site';

export function Process() {
	return (
		<section className="section process">
			<p className="label">04 / How it works</p>
			<h2>A structured search.<br/>A straightforward conversation.</h2>
			<ol className="process-list">
				{steps.map(([name, copy], i) => (
					<li key={name}>
						<span className="step-number">0{i + 1}</span>
						<h3>{name}</h3>
						<p>{copy}</p>
					</li>
				))}
			</ol>
			<div className="process-summary" style={{
				marginTop: '2.5rem',
				padding: '1.75rem',
				border: '1px solid var(--border, #262626)',
				borderRadius: '8px',
				background: 'var(--surface-subtle, rgba(255,255,255,0.02))'
			}}>
				<h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-primary, #fff)' }}>Sourcing at a Glance</h3>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
					<div>
						<p className="label" style={{ color: 'var(--accent, #eab308)', marginBottom: '0.25rem' }}>1. What You Provide</p>
						<p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a3a3a3)' }}>Project brief, site CAD/Revit/PDF drawings, target scale (1:50 to 1:1000), and delivery deadline.</p>
					</div>
					<div>
						<p className="label" style={{ color: 'var(--accent, #eab308)', marginBottom: '0.25rem' }}>2. What Vistar Models Delivers</p>
						<p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a3a3a3)' }}>Technical scope clarification, material matching, machine tolerance vetting, and direct introduction to proven specialist makers.</p>
					</div>
					<div>
						<p className="label" style={{ color: 'var(--accent, #eab308)', marginBottom: '0.25rem' }}>3. What You Control</p>
						<p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a3a3a3)' }}>Commercial terms, stage-wise fabrication milestones, quality sign-offs, and final gallery installation.</p>
					</div>
				</div>
			</div>
			<p className="process-note" style={{ marginTop: '1.5rem' }}>Operating with precision engineering standards across 9 metropolitan units in India.</p>
		</section>
	);
}

