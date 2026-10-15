import { Link } from 'react-router';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/data/blog-posts';
import { images } from '@/data/site';
import { ContactButtons } from '@/components/contact-buttons';

const coverMap: Record<string, string> = images;

export function ArticleBody({ post }: { post: BlogPost }) {
	const cover = coverMap[post.cover] ?? images.architectural;
	return (
		<div className="article-wrapper">
			<Link className="back-link" to="/blog">
				<ArrowLeft size={16} /> Back to the Journal
			</Link>

			<div className="article-layout">
				{/* Left Sticky Architectural Sidebar */}
				<aside className="article-sidebar">
					<div className="article-sidebar-sticky">
						<div>
							<span className="blog-category">{post.category}</span>
						</div>

						<div className="article-meta-box">
							<p className="label">AUTHOR & TIMELINE</p>
							<p className="article-author">{post.author}</p>
							<time className="article-date" dateTime={post.publishedAt}>
								{post.publishedAt.slice(0, 10)}
							</time>
							<span className="article-readtime">{post.readMinutes} min read</span>
						</div>

						<div className="article-toc">
							<p className="label">TABLE OF CONTENTS</p>
							<ol>
								{post.sections.map((section, idx) => (
									<li key={section.heading}>
										<span className="toc-num">0{idx + 1}</span>
										<span>{section.heading}</span>
									</li>
								))}
							</ol>
						</div>

						<div className="sidebar-quick-consult">
							<p className="label">SCALE MODEL ENQUIRY</p>
							<p className="consult-text">Preparing a scale-model brief for an upcoming development?</p>
							<Link
								className="button"
								to="/find-a-model-maker"
								style={{ width: '100%', minHeight: '44px', padding: '10px 14px', fontSize: '11px', gap: '8px' }}
							>
								Submit Your Brief <ArrowUpRight size={14} />
							</Link>
						</div>
					</div>
				</aside>

				{/* Right Main Editorial Stream */}
				<article className="article-main">
					<header className="article-header">
						<h1>{post.title}</h1>
						<p className="article-excerpt">{post.excerpt}</p>
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
							Share your brief and Vistar Models will help clarify technical scope and identify suitable
							manufacturing partners across India.
						</p>
						<ContactButtons />
						<Link className="button outline" to="/find-a-model-maker" style={{ marginTop: '1.25rem' }}>
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
			</div>
		</div>
	);
}

