import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, CheckCircle, Loader2 } from 'lucide-react';
import { categories } from '@/data/site';

type Field = {
	name: string;
	label: string;
	required?: boolean;
	type?: string;
	wide?: boolean;
	options?: string[];
};

const clientFields: Field[] = [
	{ name: 'name', label: 'Full name', required: true },
	{ name: 'company', label: 'Company / organisation' },
	{ name: 'email', label: 'Email', type: 'email', required: true },
	{ name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true },
	{ name: 'location', label: 'City / state', required: true },
	{
		name: 'category',
		label: 'Model category',
		required: true,
		options: [
			...categories.map(c => c.name),
			'Defence / technical demonstration',
			'Museum / educational',
			'Custom physical model',
			'Not sure yet',
		],
	},
	{ name: 'project', label: 'Project name' },
	{ name: 'dimensions', label: 'Approximate dimensions' },
	{ name: 'scale', label: 'Scale, if known' },
	{
		name: 'detail',
		label: 'Detail level',
		options: ['Not sure yet', 'Conceptual', 'Presentation detail', 'Detailed technical'],
	},
	{ name: 'features', label: 'Lighting / working features' },
	{ name: 'budget', label: 'Approximate budget (optional)' },
	{ name: 'required_date', label: 'Required date', type: 'date' },
	{
		name: 'contact_method',
		label: 'Preferred contact method',
		options: ['Phone', 'WhatsApp', 'Email'],
	},
	{ name: 'description', label: 'Describe your requirement', type: 'textarea', required: true, wide: true },
	{ name: 'additional', label: 'Additional requirements', type: 'textarea', wide: true },
];

const partnerFields: Field[] = [
	{ name: 'company', label: 'Company / workshop', required: true },
	{ name: 'name', label: 'Contact person', required: true },
	{ name: 'email', label: 'Business email', type: 'email', required: true },
	{ name: 'phone', label: 'Phone', type: 'tel', required: true },
	{ name: 'location', label: 'City / state', required: true },
	{ name: 'website', label: 'Website / portfolio URL', type: 'url' },
	{ name: 'category', label: 'Model categories you support', required: true },
	{ name: 'materials', label: 'Materials and techniques', required: true },
	{ name: 'size', label: 'Typical project size / complexity' },
	{ name: 'capacity', label: 'Current capacity' },
	{ name: 'equipment', label: 'Specialised equipment (if relevant)' },
	{ name: 'coverage', label: 'Service coverage' },
	{ name: 'description', label: 'Project examples and portfolio context', type: 'textarea', wide: true, required: true },
	{ name: 'additional', label: 'Additional information', type: 'textarea', wide: true },
];

export function EnquiryForm({ partner = false }: { partner?: boolean }) {
	const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
	// Inline error — rendered directly above submit button, NOT as a distant toast
	const [error, setError] = useState('');
	const [lastWaUrl, setLastWaUrl] = useState('https://wa.me/918302806913');

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const fd = new FormData(form);
		setError('');

		// Honeypot check
		if (fd.get('website_check')) {
			setError('Please leave the anti-spam field empty.');
			setStatus('error');
			return;
		}

		// Phone validation — inline error, not toast
		const phone = String(fd.get('phone') || '');
		if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) {
			setError('Please enter a valid phone number (7–20 characters, digits only).');
			setStatus('error');
			return;
		}

		setStatus('sending');

		try {
			const lines = [
				`*New ${partner ? 'Maker Partner Application' : 'Scale Model Requirement'} - Vistar Models*`,
				`------------------------------------------`,
				`*Name:* ${fd.get('name') || ''}`,
				fd.get('company') ? `*Company:* ${fd.get('company')}` : '',
				`*Phone:* ${phone}`,
				fd.get('email') ? `*Email:* ${fd.get('email')}` : '',
				fd.get('location') ? `*City/State:* ${fd.get('location')}` : '',
				fd.get('category') ? `*Category:* ${fd.get('category')}` : '',
				fd.get('project') ? `*Project:* ${fd.get('project')}` : '',
				fd.get('dimensions') ? `*Dimensions:* ${fd.get('dimensions')}` : '',
				fd.get('scale') ? `*Scale:* ${fd.get('scale')}` : '',
				fd.get('detail') ? `*Detail Level:* ${fd.get('detail')}` : '',
				fd.get('features') ? `*Features:* ${fd.get('features')}` : '',
				fd.get('budget') ? `*Budget:* ${fd.get('budget')}` : '',
				fd.get('required_date') ? `*Required Date:* ${fd.get('required_date')}` : '',
				fd.get('materials') ? `*Materials:* ${fd.get('materials')}` : '',
				fd.get('website') ? `*Website:* ${fd.get('website')}` : '',
				fd.get('capacity') ? `*Capacity:* ${fd.get('capacity')}` : '',
				fd.get('description') ? `*Details:*\n${fd.get('description')}` : '',
				fd.get('additional') ? `*Additional Notes:*\n${fd.get('additional')}` : '',
			]
				.filter(Boolean)
				.join('\n');

			const targetUrl = `https://wa.me/918302806913?text=${encodeURIComponent(lines)}`;
			setLastWaUrl(targetUrl);
			window.open(targetUrl, '_blank');
			setStatus('success');
			form.reset();
		} catch {
			setStatus('error');
			setError(
				'Unable to prepare WhatsApp message. Please contact us directly on +91 83028 06913.',
			);
		}
	}

	if (status === 'success')
		return (
			<section className="form-success" role="status">
				<CheckCircle size={34} />
				<h2>{partner ? 'Application prepared!' : 'Your requirement has been prepared!'}</h2>
				<p>
					{partner
						? 'Thank you for sharing your capabilities. Your details have been formatted for WhatsApp (+91 8302806913).'
						: 'Thank you. Your project brief has been formatted for WhatsApp (+91 8302806913) so our team can review it instantly.'}
				</p>
				<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
					<a className="button" href={lastWaUrl} target="_blank" rel="noopener noreferrer">
						Open WhatsApp Chat <ArrowUpRight size={18} />
					</a>
					<button
						className="button"
						style={{ background: 'transparent', border: '1px solid currentColor', color: 'inherit' }}
						onClick={() => setStatus('idle')}
					>
						Submit another {partner ? 'application' : 'requirement'}
					</button>
				</div>
			</section>
		);

	const submitLabel = partner
		? 'Send Partner Application via WhatsApp'
		: 'Send Requirement via WhatsApp';

	return (
		<section className="section form-section">
			<div className="form-intro">
				<p className="label">{partner ? 'Maker application' : 'Client enquiry'}</p>
				<h2>{partner ? 'Share your capabilities.' : 'Start with your brief.'}</h2>
				<p>
					{partner
						? 'Be specific about materials, model categories and the work you can support. Portfolio information helps us understand relevance.'
						: "An early-stage idea is welcome. If you don't know the scale or dimensions yet, simply tell us what the model should communicate."}
				</p>
				<p>Submitting opens a direct WhatsApp conversation with your brief pre-filled for instant review.</p>
				<a className="text-link" href="tel:+918302806913">
					Prefer to talk? +91 8302806913
				</a>
			</div>

			<form onSubmit={submit} className="enquiry-form">
				<div className="form-grid">
					{(partner ? partnerFields : clientFields).map(f => (
						<label key={f.name} className={f.wide ? 'wide' : ''}>
							{f.label}
							{f.required ? ' *' : ''}
							{f.options ? (
								<select name={f.name} required={f.required} defaultValue="">
									<option value="" disabled>
										Select an option
									</option>
									{f.options.map(o => (
										<option key={o}>{o}</option>
									))}
								</select>
							) : f.type === 'textarea' ? (
								<textarea name={f.name} required={f.required} rows={4} maxLength={5000} />
							) : (
								<input
									name={f.name}
									type={f.type || 'text'}
									required={f.required}
									maxLength={500}
									autoComplete={
										f.name === 'email'
											? 'email'
											: f.name === 'name'
												? 'name'
												: f.name === 'phone'
													? 'tel'
													: 'off'
									}
								/>
							)}
						</label>
					))}

					{/* Honeypot — hidden from users and assistive tech */}
					<label className="honeypot" aria-hidden="true">
						Leave this field empty
						<input name="website_check" tabIndex={-1} autoComplete="off" />
					</label>

					<label className="consent wide">
						<input type="checkbox" name="consent" required />
						<span>
							I consent to Vistar Models using these details to review my{' '}
							{partner ? 'application' : 'requirement'} and contact me via WhatsApp / Phone. I have
							read the <Link to="/privacy">Privacy Policy</Link>. *
						</span>
					</label>
				</div>

				{/*
				 * VERCEL GUIDELINE FIX #1: Error rendered directly above the submit button
				 * (inline, next to the action — not a distant toast at the bottom of the page).
				 */}
				{error && (
					<p className="form-error" role="alert" aria-live="assertive">
						{error}
					</p>
				)}

				{/*
				 * VERCEL GUIDELINE FIX #2: Loading button keeps original label + shows spinner.
				 * Guideline: "Show a loading indicator & keep the original label."
				 * Previous code replaced the entire label with 'Opening WhatsApp…' — now fixed.
				 */}
				<button
					disabled={status === 'sending'}
					className="button"
					type="submit"
					aria-busy={status === 'sending'}
				>
					{status === 'sending' && (
						<Loader2 size={16} className="spin" aria-hidden="true" />
					)}
					{submitLabel} <ArrowUpRight size={18} />
				</button>

				<p className="field-note">
					Directly connects you to our consultant on WhatsApp with your project brief.
				</p>
			</form>
		</section>
	);
}
