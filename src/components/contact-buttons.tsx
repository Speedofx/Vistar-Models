import { Phone, MessageCircle } from 'lucide-react';
import { business } from '@/data/business';

/**
 * Prominent call and WhatsApp action buttons plus the visible phone number.
 * Used on contact, FAQ and other high-intent surfaces so the number is
 * discoverable by people and by answer engines reading the page.
 */
export function ContactButtons({
	variant = 'light',
}: {
	variant?: 'light' | 'dark';
}) {
	const dark = variant === 'dark';
	return (
		<div className="contact-buttons">
			<a
				className={`button call-button${dark ? ' dark' : ''}`}
				href={business.phoneTel}
				aria-label={`Call Vistar Models at ${business.phone}`}
			>
				<Phone size={18} />
				<span>
					<span className="cb-label">Call now</span>
					<span className="cb-number">{business.phone}</span>
				</span>
			</a>
			<a
				className={`button whatsapp-button${dark ? ' dark' : ''}`}
				href={business.whatsapp}
				target="_blank"
				rel="noreferrer"
				aria-label="Message Vistar Models on WhatsApp"
			>
				<MessageCircle size={18} />
				<span>WhatsApp</span>
			</a>
		</div>
	);
}
