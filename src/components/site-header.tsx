import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
	['Home', '/'],
	['About', '/about'],
	['My Branches', '/units'],
	['Find a Model Maker', '/find-a-model-maker'],
	['Categories', '/categories'],
	['Journal', '/blog'],
	['How It Works', '/how-it-works'],
	['For Manufacturers', '/for-manufacturers'],
	['Contact', '/contact'],
];

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	const isHome = location.pathname === '/';

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 40);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
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

			<nav
				className={open ? 'primary-nav open' : 'primary-nav'}
				aria-label="Main navigation"
				id="mobile-nav"
			>
				{links.map(([label, path]) => (
					<NavLink
						key={path}
						to={path}
						end
						onClick={() => setOpen(false)}
					>
						{label}
					</NavLink>
				))}
				<div className="mobile-drawer-cta-wrap">
					<Link
						to="/find-a-model-maker"
						className="mobile-drawer-cta"
						onClick={() => setOpen(false)}
					>
						<span>Discuss Your Requirement</span>
						<ArrowUpRight size={16} />
					</Link>
				</div>
			</nav>

			<div className="site-header-actions">
				<Link className="header-cta" to="/find-a-model-maker">
					<span className="header-cta-text-full">Discuss Your Requirement</span>
					<span className="header-cta-text-mobile">Discuss</span>
					<ArrowUpRight size={14} className="header-cta-arrow" />
				</Link>

				<button
					className="menu-button"
					aria-expanded={open}
					aria-controls="mobile-nav"
					aria-label={open ? 'Close navigation' : 'Open navigation'}
					onClick={() => setOpen(!open)}
				>
					{open ? <X size={22} /> : <Menu size={22} />}
				</button>
			</div>
		</header>
	);
}
