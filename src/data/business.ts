/**
 * Single source of truth for Vistar Models' business identity, contact details
 * and operating information. Used by visible page content, structured data
 * (JSON-LD), the sitemap, llms.txt and machine-readable files so every surface
 * states the same facts.
 *
 * Only facts the business has actually supplied appear here. Nothing is
 * fabricated — no reviews, ratings, awards, verifications or rankings.
 */

export const business = {
	name: 'Vistar Models',
	legalName: 'Vistar Models',
	tagline: 'Scale Model Consultancy & Manufacturer Sourcing',
	description:
		'Vistar Models is an India-wide scale-model consultancy that helps clients clarify requirements, identify potentially suitable model makers and facilitate introductions. Vistar is a consultancy, not a manufacturer.',
	/** Primary published domain. */
	primaryDomain: 'https://vistarmodels.com',
	/** Secondary published domain. */
	secondaryDomain: 'https://vistarmodels.online',
	/** Phone number in international format for tel: links. */
	phone: '+91 83028 06913',
	phoneE164: '+918302806913',
	phoneTel: 'tel:+918302806913',
	/** WhatsApp deep link with a pre-filled message. */
	whatsapp:
		'https://wa.me/918302806913?text=' +
		encodeURIComponent(
			'Hello Vistar Models, I have a scale-model requirement and would like help finding a suitable manufacturing partner. Please let me know what project details you need.',
		),
	email: 'vistarmodels@gmail.com',
	emailMailto: 'mailto:vistarmodels@gmail.com',
	/** Service area. */
	areaServed: 'India',
	areaServedDetail: 'Pan-India',
	/** Founder. */
	founder: 'Yogendra Yogi',
	foundingDate: '2026',
	/**
	 * Operating hours exactly as supplied by the business.
	 * Open 24 hours Monday–Saturday, closed Sunday.
	 */
	hours: {
		summary: 'Open 24 hours · Closed Sundays',
		open24: true,
		schedule: [
			{ day: 'Monday', hours: 'Open 24 hours' },
			{ day: 'Tuesday', hours: 'Open 24 hours' },
			{ day: 'Wednesday', hours: 'Open 24 hours' },
			{ day: 'Thursday', hours: 'Open 24 hours' },
			{ day: 'Friday', hours: 'Open 24 hours' },
			{ day: 'Saturday', hours: 'Open 24 hours' },
			{ day: 'Sunday', hours: 'Closed' },
		],
	},
} as const;

/**
 * Schema.org openingHoursSpecification built from the supplied schedule.
 * Sunday is closed (omitted from the spec, which means closed by default).
 */
export const openingHoursSpec = business.hours.schedule
	.filter(s => s.hours === 'Open 24 hours')
	.map(s => ({
		'@type': 'OpeningHoursSpecification',
		dayOfWeek: s.day,
		opens: '00:00',
		closes: '23:59',
	}));
