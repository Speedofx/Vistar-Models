import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { whatsapp } from '@/data/site';
export function ContactCta(){return <section className="contact-cta section"><p className="label">The next step starts with your brief</p><h2>Tell Us What<br/>Your Project Needs<span>.</span></h2><div><p>Share your requirements. We will review the scope and help identify suitable manufacturing partners where a relevant match is available.</p><div className="cta-actions"><Link className="button" to="/find-a-model-maker">Submit Your Requirement <ArrowUpRight size={18}/></Link><a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Contact Us on WhatsApp <ArrowUpRight size={17}/></a></div></div></section>}
