import { Link } from 'react-router';
import { ArrowUpRight, BookOpen, Clock, Layers } from 'lucide-react';
import { blogPosts } from '@/data/blog-posts';
import { images } from '@/data/site';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const coverMap: Record<string, string> = images;

export function BlogTeaser() {
	const posts = blogPosts.slice(0, 3);

	return (
		<section className="lux-journal" aria-label="Scale Model Journal and Insights">
			<div className="lux-journal-container">
				{/* Section Header */}
				<ScrollReveal animation="fade-up-3d">
					<div className="lux-journal-header">
						<div className="lux-journal-header-left">
							<div className="lux-section-badge">
								<BookOpen size={13} className="lux-badge-icon" />
								<span>07 / THE VISTAR JOURNAL &middot; SOURCING INTELLIGENCE</span>
							</div>
							<h2 className="lux-journal-title">
								Authoritative Guidance for Architectural Buyers.
							</h2>
						</div>
						<div className="lux-journal-header-right">
							<p className="lux-journal-subtitle">
								Practical, deep-dive technical insights on scale-model specifications,
								material tolerances, and manufacturer vetting across India.
							</p>
							<Link to="/blog" className="cmd-btn mini">
								<span>Read All Journal Articles</span>
								<ArrowUpRight size={13} style={{ marginLeft: 4 }} />
							</Link>
						</div>
					</div>
				</ScrollReveal>

				{/* 3 Luxury Editorial Cards with 3D Staggered Reveal */}
				<div className="lux-journal-grid">
					{posts.map((post, idx) => (
						<ScrollReveal
							key={post.slug}
							animation="tilt-in"
							delay={idx * 100}
							className="lux-journal-scroll-wrap"
						>
							<article className="lux-journal-card">
								<Link to={`/blog/${post.slug}`} className="lux-journal-media">
									<img
										src={coverMap[post.cover] ?? images.architectural}
										alt={post.title}
										className="lux-journal-img"
										loading="lazy"
									/>
									<div className="lux-journal-img-overlay" />
									<span className="lux-journal-category">
										<Layers size={10} />
										<span>{post.category}</span>
									</span>
								</Link>

								<div className="lux-journal-body">
									<div className="lux-journal-meta">
										<span className="lux-journal-date">{post.publishedAt.slice(0, 10)}</span>
										<span className="lux-journal-dot">&middot;</span>
										<span className="lux-journal-time">
											<Clock size={11} className="lux-clock-icon" />
											{post.readMinutes} min read
										</span>
									</div>

									<h3 className="lux-journal-card-title">
										<Link to={`/blog/${post.slug}`}>{post.title}</Link>
									</h3>

									<p className="lux-journal-excerpt">{post.excerpt}</p>

									<Link to={`/blog/${post.slug}`} className="lux-journal-link">
										<span>Read Full Analysis</span>
										<ArrowUpRight size={14} />
									</Link>
								</div>
							</article>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}
