import type { Route } from './+types/page';
import { seo } from '@/lib/seo';
import { pages, categories, images, faqs } from '@/data/site';
import { PageHeading } from '@/components/page-heading';
import { PageContent } from '@/components/page-content';
import { CategoryContent } from '@/components/category-content';
import { CategoryGallery } from '@/components/category-gallery';
import { EnquiryForm } from '@/components/enquiry-form';
import { Process } from '@/components/process';
import { Founder } from '@/components/founder';
import { Capability } from '@/components/capability';
import { ContactCta } from '@/components/contact-cta';
export function loader({params}:Route.LoaderArgs){const slug=params.slug||'';const c=categories.find(c=>c.slug===slug);const page=c?{title:'Find '+c.name+' Makers in India',eyebrow:'Specialist model sourcing',intro:c.description+' We help clarify your brief and explore relevant fabrication partners.'}:pages[slug];if(!page)throw new Response('Page not found',{status:404});return {slug,page,category:!!c,image:c?.image||images.architectural};}
export function meta({matches,location,loaderData}:Route.MetaArgs){if(!loaderData)return seo({matches,location},{title:'Page not found | Vistar Models',description:'This page is not available. Explore Vistar Models for scale-model consultancy and sourcing across India.',noindex:true});const {slug,page,image}=loaderData;return seo({matches,location},{title:(loaderData.category?page.title:page.eyebrow.split(' · ')[0])+' | Vistar Models',description:page.intro.length>155?page.intro.slice(0,152)+'…':page.intro,image,jsonLd:slug==='faq'?{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}:loaderData.category||slug==='services'?{'@context':'https://schema.org','@type':'Service',name:page.title,provider:{'@type':'Organization',name:'Vistar Models'},areaServed:'India',serviceType:'Scale-model consultancy and manufacturer sourcing'}:undefined});}
export default function Page({loaderData}:Route.ComponentProps){const {slug,page,category}=loaderData;const form=slug==='contact'||slug==='find-a-model-maker'||slug==='become-a-partner';return <main><PageHeading {...page}/>{category?<CategoryContent slug={slug}/>:<>{slug==='categories'&&<CategoryGallery/>}{slug==='about'&&<Founder/>}{slug==='how-it-works'&&<Process/>}<PageContent slug={slug}/>{slug==='find-a-model-maker'&&<Capability/>}{form&&<EnquiryForm partner={slug==='become-a-partner'}/>}</>}{!form&&!['privacy','terms'].includes(slug)&&<ContactCta/>}</main>}
