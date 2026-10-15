import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = [['Home','/'],['About','/about'],['My Branches','/units'],['Find a Model Maker','/find-a-model-maker'],['Categories','/categories'],['Journal','/blog'],['How It Works','/how-it-works'],['For Manufacturers','/for-manufacturers'],['Contact','/contact']];
export function SiteHeader(){
 const [open,setOpen]=useState(false);
 return <header className="site-header"><Link to="/" className="wordmark" aria-label="Vistar Models home">VISTAR<span>MODELS<span className="logo-dot" /></span></Link><nav className={open?'primary-nav open':'primary-nav'} aria-label="Main navigation" id="mobile-nav">{links.map(([label,path])=><NavLink key={path} to={path} end onClick={()=>setOpen(false)}>{label}</NavLink>)}</nav><Link className="header-cta" to="/find-a-model-maker">Discuss Your Requirement <ArrowUpRight size={16}/></Link><button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>;
}
