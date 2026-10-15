import { Link } from 'react-router';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/data/blog-posts';
import { images } from '@/data/site';
import { ContactButtons } from '@/components/contact-buttons';

const coverMap: Record<string, string> = images;

export function ArticleBody({ post }: { post: BlogPost }) {
	const cover = coverMap[post.cover] ?? images.architectural;
	return (
		<article className="article">
			<Link className="back-link" to="/blog">
				<ArrowLeft size={16} /> Back to the Journal
			</Link>
			<header className="article-header">
				<span className="blog-category">{post.category}</span>
				<h1>{post.title}</h1>
				<p className="article-excerpt">{post.excerpt}</p>
				<div className="article-meta">
					<span>By {post.author}</span>
					<span>·</span>
					<time dateTime={post.publishedAt}>
						{post.publishedAt.slice(0, 10)}
					</time>
					<span>·</span>
					<span>{post.readMinutes} min read</span>
				</div>
			</header>
			<figure className="article-cover">
				<img
					src={cover}
					alt={`Illustrative image for ${post.title}`}
					width={1200}
					height={800}
					fetchPriority="high"
				/>
				<figcaption>AI-generated category illustration · Not a Vistar project</figcaption>
			</figure>
			<div className="article-tldr">
				<p className="label">In short</p>
				<p>{post.tlDr}</p>
			</div>
			<div className="article-content">
				{post.sections.map(section => (
					<section key={section.heading}>
						<h2>{section.heading}</h2>
						{section.body.map((para, i) =>
							para.endsWith(':') ? (
								<p key={i} className="lead-in">
									{para}
								</p>
							) : (
								<p key={i}>{para}</p>
							),
						)}
					</section>
				))}
			</div>
			<div className="article-cta">
				<h2>Have a scale-model requirement?</h2>
				<p>
					Share your brief and Vistar Models will consider which capabilities may
					be relevant. We consult and connect — we do not manufacture.
				</p>
				<ContactButtons />
				<Link className="button outline" to="/find-a-model-maker">
					Submit your requirement <ArrowUpRight size={18} />
				</Link>
			</div>
			{post.related.length > 0 && (
				<nav className="article-related" aria-label="Related reading">
					<p className="label">Keep reading</p>
					<div>
						{post.related.map(r => (
							<Link key={r.path} className="text-link" to={r.path}>
								{r.label} <ArrowUpRight size={16} />
							</Link>
						))}
					</div>
				</nav>
			)}
		</article>
	);
}
