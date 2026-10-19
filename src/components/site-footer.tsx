import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { whatsapp } from '@/data/site';

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-top">
				<div>
					<Link to="/" className="footer-logo-wrap" aria-label="Vistar Models home">
						<img
							src="/image.png"
							alt="Vistar Models"
							className="footer-logo-img"
							width={300}
							height={92}
						/>
					</Link>
					<p>
						Scale Model Consultancy &<br />
						Manufacturer Sourcing
					</p>
					<span className="label">Based in India. Connecting across India.</span>
				</div>

				<div>
					<h3>Explore</h3>
					<Link to="/services">Consultancy Services</Link>
					<Link to="/categories">Model Categories</Link>
					<Link to="/units">Operating Units (9 Cities)</Link>
					<Link to="/blog">The Vistar Journal</Link>
					<Link to="/industries">Industries</Link>
					<Link to="/how-it-works">How It Works</Link>
				</div>

				<div>
					<h3>Vistar Models</h3>
					<Link to="/about">About & Founder</Link>
					<Link to="/units">9 MSME Units</Link>
					<Link to="/for-manufacturers">For Manufacturers</Link>
					<Link to="/become-a-partner">Become a Partner</Link>
					<Link to="/faq">FAQ</Link>
				</div>

				<div>
					<h3>Start a conversation</h3>
					<a className="footer-phone" href="tel:+918302806913">
						+91 83028 06913
					</a>
					<a href="mailto:vistarmodels@gmail.com">vistarmodels@gmail.com</a>
					<a href={whatsapp} target="_blank" rel="noreferrer">
						WhatsApp <ArrowUpRight size={14} />
					</a>
					<Link to="/contact">Contact Us</Link>
					<span className="footer-hours">Open 24 hours · Mon–Sat · Closed Sundays</span>
				</div>
			</div>

			<div
				style={{
					borderTop: '1px solid rgba(255, 255, 255, 0.08)',
					padding: '1.25rem 0',
					fontSize: '0.82rem',
					display: 'flex',
					flexWrap: 'wrap',
					gap: '0.75rem',
					alignItems: 'center',
					color: 'var(--muted, #8b949e)',
				}}
			>
				<span style={{ fontWeight: 600, color: 'var(--foreground, #f0f6fc)' }}>
					MSME Registered Units (UDYAM-RJ-17-0536099):
				</span>
				<Link to="/units/jaipur" style={{ color: 'inherit' }}>Jaipur</Link> ·
				<Link to="/units/mumbai" style={{ color: 'inherit' }}>Mumbai</Link> ·
				<Link to="/units/gurugram" style={{ color: 'inherit' }}>Gurugram</Link> ·
				<Link to="/units/delhi" style={{ color: 'inherit' }}>Delhi</Link> ·
				<Link to="/units/bengaluru" style={{ color: 'inherit' }}>Bengaluru</Link> ·
				<Link to="/units/pune" style={{ color: 'inherit' }}>Pune</Link> ·
				<Link to="/units/hyderabad" style={{ color: 'inherit' }}>Hyderabad</Link> ·
				<Link to="/units/ahmedabad" style={{ color: 'inherit' }}>Ahmedabad</Link> ·
				<Link to="/units/noida" style={{ color: 'inherit' }}>Noida</Link>
			</div>

			<div className="footer-bottom">
				<span>© 2026 Vistar Models. Consultancy, not manufacturing. UDYAM-RJ-17-0536099</span>
				<div>
					<Link to="/privacy">Privacy Policy</Link>
					<Link to="/terms">Terms of Use</Link>
				</div>
			</div>
		</footer>
	);
}
