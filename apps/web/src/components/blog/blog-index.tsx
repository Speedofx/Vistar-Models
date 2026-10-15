import { Link } from 'react-router';
import { ArrowUpRight, Clock } from 'lucide-react';
import { blogPosts } from '@/data/blog-posts';
import { images } from '@/data/site';

const coverMap: Record<string, string> = images;

export function BlogIndex() {
	return (
		<section className="section blog-index">
			<div className="blog-intro">
				<p className="label">The Vistar Journal</p>
				<h2>Answers to the questions buyers and makers actually ask.</h2>
				<p>
					Practical, honest guidance on sourcing scale models in India — from
					choosing a maker to preparing a brief that produces useful proposals.
					Written to be the most useful answer available, not a sales pitch.
				</p>
			</div>
			<div className="blog-grid">
				{blogPosts.map(post => (
					<article key={post.slug} className="blog-card">
						<Link to={`/blog/${post.slug}`} className="blog-card-media">
							<img
								src={coverMap[post.cover] ?? images.architectural}
								alt={`Illustrative image for ${post.title}`}
								width={1200}
								height={800}
								loading="lazy"
							/>
							<span className="blog-category">{post.category}</span>
						</Link>
						<div className="blog-card-body">
							<div className="blog-meta">
								<span>{post.publishedAt.slice(0, 10)}</span>
								<span>·</span>
								<span>{post.readMinutes} min read</span>
							</div>
							<h3>
								<Link to={`/blog/${post.slug}`}>{post.title}</Link>
							</h3>
							<p>{post.excerpt}</p>
							<Link className="text-link" to={`/blog/${post.slug}`}>
								Read the article <ArrowUpRight size={16} />
							</Link>
						</div>
					</article>
				))}
			</div>
			<div className="blog-hours-note">
				<Clock size={16} />
				<span>
					Vistar Models is open 24 hours, Monday to Saturday, and closed Sundays.
					Call <a href="tel:+918302806913">+91 83028 06913</a> or message us on{' '}
					<a
						href="https://wa.me/918302806913"
						target="_blank"
						rel="noreferrer"
					>
						WhatsApp
					</a>
					.
				</span>
			</div>
		</section>
	);
}
