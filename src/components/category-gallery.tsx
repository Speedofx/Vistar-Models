import { Link } from 'react-router';
import { ArrowUpRight, Grid3X3, Layers } from 'lucide-react';
import { categories } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function CategoryGallery({ compact = false }: { compact?: boolean }) {
	const shown = compact ? categories.slice(0, 6) : categories;

	return (
		<section className="lux-category-matrix" aria-label="Scale Model Sourcing Categories">
			<div className="lux-matrix-container">
				{/* Section Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-matrix-header">
						<div className="lux-matrix-header-left">
							<div className="lux-section-badge">
								<Grid3X3 size={13} className="lux-badge-icon" />
								<span>03 / MODEL CATEGORY ARCHITECTURE</span>
							</div>
							<h2 className="lux-matrix-title">
								One Brief. Infinite Spatial Realities.
							</h2>
						</div>
						<div className="lux-matrix-header-right">
							<p className="lux-matrix-subtitle">
								From high-gloss residential vitrines to heavy industrial cutaway exhibits,
								explore verified specialist domains across our pan-India network.
							</p>
							{compact && (
								<Link to="/categories" className="cmd-btn mini">
									<span>View All 9 Categories</span>
									<ArrowUpRight size={14} />
								</Link>
							)}
						</div>
					</div>
				</ScrollReveal>

				{/* 3x2 Luxury Grid with 3D Staggered Reveal */}
				<div className="lux-matrix-grid">
					{shown.map((cat, idx) => (
						<ScrollReveal
							key={cat.slug}
							animation="tilt-in"
							delay={idx * 90}
							className="lux-cat-scroll-item"
						>
							<Link
								to={`/${cat.slug}`}
								className="lux-cat-card"
								aria-label={`Explore ${cat.name}`}
							>
								<div className="lux-cat-media">
									<img
										src={cat.image}
										alt={cat.name}
										className="lux-cat-img"
										loading="lazy"
										decoding="async"
									/>
									<div className="lux-cat-gradient" />

									{/* Floating Index Pill */}
									<div className="lux-cat-pill">
										<Layers size={11} />
										<span>CAT &middot; 0{idx + 1}</span>
									</div>

									{/* Hover Ambient Light */}
									<div className="lux-cat-ambient-light" />
								</div>

								<div className="lux-cat-body">
									<div className="lux-cat-title-row">
										<h3 className="lux-cat-name">{cat.name}</h3>
										<div className="lux-cat-arrow-wrap">
											<ArrowUpRight size={17} />
										</div>
									</div>
									<p className="lux-cat-desc">{cat.description}</p>
									<div className="lux-cat-footer">
										<span className="lux-cat-explore">View Sourcing Specs &rarr;</span>
									</div>
								</div>
							</Link>
						</ScrollReveal>
					))}
				</div>

				<p className="lux-matrix-disclaimer">
					Physical scale-model photography representing fabrication tolerances, precision joinery, and lighting scopes.
				</p>
			</div>
		</section>
	);
}
