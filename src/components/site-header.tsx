import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ArrowUpRight, Menu, X, MessageCircle, Phone } from 'lucide-react';

const links = [
	{ label: 'Home', path: '/', num: '01' },
	{ label: 'About Studio', path: '/about', num: '02' },
	{ label: 'Our Branches', path: '/units', num: '03' },
	{ label: 'Find a Model Maker', path: '/find-a-model-maker', num: '04' },
	{ label: 'Model Categories', path: '/categories', num: '05' },
	{ label: 'Architecture Journal', path: '/blog', num: '06' },
	{ label: 'Fabrication Protocol', path: '/how-it-works', num: '07' },
	{ label: 'For Manufacturers', path: '/for-manufacturers', num: '08' },
	{ label: 'Contact Us', path: '/contact', num: '09' },
];

const WHATSAPP_DISCUSS_URL =
	'https://wa.me/918302806913?text=' +
	encodeURIComponent(
		'Hello Vistar Models, we have a scale model requirement for our project. Do you make architectural and industrial scale models? Please share the details and process.'
	);

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const location = useLocation();
	const isHome = location.pathname === '/';

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 40);
		};
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
		};
		checkMobile();
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', checkMobile);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkMobile);
		};
	}, []);

	// Lock body scroll when mobile bottom sheet is open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	// Auto close on route change
	useEffect(() => {
		setOpen(false);
	}, [location.pathname]);

	const handleDiscussClick = (e: React.MouseEvent) => {
		if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			e.preventDefault();
			window.location.href = WHATSAPP_DISCUSS_URL;
		}
	};

	return (
		<>
			<header
				className={`site-header ${isHome ? 'site-header-home' : 'site-header-inner'} ${
					scrolled ? 'site-header-scrolled' : ''
				}`}
			>
				<Link to="/" className="site-header-logo-wrap" aria-label="Vistar Models home">
					<img
						src="/header-logo.png"
						alt="Vistar Models"
						className="site-header-logo-img"
						width={220}
						height={52}
					/>
				</Link>

				{/* Desktop Navigation (Untouched, sits in header) */}
				<nav className="primary-nav" aria-label="Main navigation">
					{links.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							end
						>
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="site-header-actions">
					{isMobile ? (
						<a
							className="header-cta"
							href={WHATSAPP_DISCUSS_URL}
							target="_blank"
							rel="noreferrer"
							onClick={handleDiscussClick}
							aria-label="Discuss on WhatsApp"
						>
							<span className="header-cta-text-mobile">Discuss</span>
							<ArrowUpRight size={14} className="header-cta-arrow" />
						</a>
					) : (
						<Link
							className="header-cta"
							to="/find-a-model-maker"
							onClick={handleDiscussClick}
						>
							<span className="header-cta-text-full">Discuss Your Requirement</span>
							<span className="header-cta-text-mobile">Discuss</span>
							<ArrowUpRight size={14} className="header-cta-arrow" />
						</Link>
					)}

					<button
						className="menu-button"
						aria-expanded={open}
						aria-controls="mobile-bottom-sheet"
						aria-label={open ? 'Close navigation' : 'Open navigation'}
						onClick={() => setOpen(!open)}
					>
						{open ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>
			</header>

			{/* Modern Mobile Web-App Slide-Up Bottom Sheet */}
			<div
				className={`lux-sheet-backdrop ${open ? 'active' : ''}`}
				onClick={() => setOpen(false)}
				aria-hidden={!open}
			/>

			<div
				id="mobile-bottom-sheet"
				className={`lux-bottom-sheet ${open ? 'active' : ''}`}
				role="dialog"
				aria-modal="true"
				aria-label="Studio Navigation Menu"
			>
				{/* Top Drag Handle Indicator */}
				<div className="lux-sheet-handle-bar">
					<div className="lux-sheet-handle" />
				</div>

				{/* Sheet Header Row */}
				<div className="lux-sheet-header">
					<div className="lux-sheet-brand">
						<span className="lux-sheet-dot" />
						<span className="lux-sheet-brand-text">VISTAR STUDIO NAVIGATION</span>
					</div>
					<button
						type="button"
						className="lux-sheet-close-btn"
						onClick={() => setOpen(false)}
						aria-label="Close menu"
					>
						<X size={18} />
					</button>
				</div>

				{/* Sheet Scrollable Body */}
				<div className="lux-sheet-body">
					<div className="lux-sheet-links">
						{links.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								end
								className={({ isActive }) =>
									`lux-sheet-link ${isActive ? 'active' : ''}`
								}
								onClick={() => setOpen(false)}
							>
								<span className="lux-sheet-num">{item.num}</span>
								<span className="lux-sheet-label">{item.label}</span>
								<ArrowUpRight size={14} className="lux-sheet-arrow" />
							</NavLink>
						))}
					</div>

					{/* Sheet Bottom Action Area: High-Contrast Gold WhatsApp Button */}
					<div className="lux-sheet-footer">
						<a
							href={WHATSAPP_DISCUSS_URL}
							target="_blank"
							rel="noreferrer"
							className="lux-sheet-whatsapp-btn"
							onClick={() => setOpen(false)}
						>
							<MessageCircle size={18} />
							<span>Discuss on WhatsApp</span>
							<ArrowUpRight size={16} />
						</a>

						<div className="lux-sheet-contact-row">
							<a href="tel:+918302806913" className="lux-sheet-tel-link">
								<Phone size={13} />
								<span>+91 83028 06913</span>
							</a>
							<span className="lux-sheet-badge">24/7 Response</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
