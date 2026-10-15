import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '@/data/blog-posts';
import { images } from '@/data/site';

const coverMap: Record<string, string> = images;

export function BlogTeaser() {
	const posts = blogPosts.slice(0, 3);
	return (
		<section className="section blog-teaser">
			<div className="section-heading">
				<div>
					<p className="label">05 / The Vistar Journal</p>
					<h2>
						Answers to the questions
						<br />
						buyers and makers ask.
					</h2>
				</div>
				<div>
					<p>
						Honest, practical guidance on sourcing scale models in India — written
						to be the most useful answer available.
					</p>
					<Link className="text-link" to="/blog">
						Read all articles <ArrowUpRight size={17} />
					</Link>
				</div>
			</div>
			<div className="blog-grid">
				{posts.map(post => (
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
		</section>
	);
}
