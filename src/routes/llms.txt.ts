import type { Route } from './+types/llms.txt';
import { siteOrigin } from '@/lib/site-origin.server';
import { pages, categories } from '@/data/site';
import { blogPosts } from '@/data/blog-posts';
import { business } from '@/data/business';
export function loader({request}:Route.LoaderArgs){const origin=siteOrigin(request);return new Response('# Vistar Models\n\n> '+business.description+'\n>\n> Founded by '+business.founder+' in '+business.foundingDate+'. '+business.hours.summary+'.\n>\n> Contact: '+business.phone+' ('+business.phoneTel+') · '+business.email+' ('+business.emailMailto+') · WhatsApp: '+business.whatsapp+'\n>\n> Domains: '+business.primaryDomain+' · '+business.secondaryDomain+'\n\n## Pages\n'+Object.entries(pages).map(([slug,p])=>`- [${p.eyebrow}](${origin}/${slug}): ${p.intro}`).join('\n')+'\n\n## Model sourcing categories\n'+categories.map(c=>`- [${c.name}](${origin}/${c.slug}): ${c.description}`).join('\n')+'\n\n## Journal — scale model sourcing guides\n'+blogPosts.map(p=>`- [${p.title}](${origin}/blog/${p.slug}): ${p.excerpt}`).join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
