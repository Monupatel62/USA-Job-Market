"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories as allCategories } from "../lib/categories";

type Job = {
  id: string; slug: string; title: string; company: string; location: string; category: string;
  type: string; salary: string; posted: string; remote?: boolean; mark: string; markClass: string;
};

const jobs: Job[] = [
  { id:"1", slug:"software-engineer-google-mountain-view", title:"Software Engineer", company:"Google", location:"Mountain View, CA", category:"IT & Software", type:"Full-time", salary:"$120K – $200K", posted:"2 days ago", mark:"G", markClass:"google" },
  { id:"2", slug:"data-analyst-amazon-remote", title:"Data Analyst", company:"Amazon", location:"Remote, USA", category:"Data Science & Analytics", type:"Remote", salary:"$80K – $130K", posted:"1 day ago", remote:true, mark:"a", markClass:"amazon" },
  { id:"3", slug:"product-manager-microsoft-redmond", title:"Product Manager", company:"Microsoft", location:"Redmond, WA", category:"Management", type:"Full-time", salary:"$150K – $220K", posted:"3 days ago", mark:"▦", markClass:"microsoft" },
  { id:"4", slug:"registered-nurse-unitedhealth-group-houston", title:"Registered Nurse", company:"UnitedHealth Group", location:"Houston, TX", category:"Healthcare & Medical", type:"Full-time", salary:"$70K – $110K", posted:"2 days ago", mark:"U", markClass:"uhg" },
  { id:"5", slug:"mechanical-engineer-tesla-austin", title:"Mechanical Engineer", company:"Tesla", location:"Austin, TX", category:"Engineering", type:"Full-time", salary:"$110K – $170K", posted:"1 day ago", mark:"T", markClass:"tesla" },
  { id:"6", slug:"barista-starbucks-new-york", title:"Barista", company:"Starbucks", location:"New York, NY", category:"Restaurant & Food Service", type:"Part-time", salary:"$16 – $22/hour", posted:"3 days ago", mark:"★", markClass:"starbucks" },
];

const categoryVisuals: Record<string, [string,string]> = {
  "IT & Software":["▰","blue"], "Healthcare & Medical":["♥","red"], "Finance & Accounting":["▥","gold"],
  Engineering:["⚙","blue"], "Education & Teaching":["◆","blue"], Construction:["⌂","gold"],
  "Customer Service":["◉","purple"], Sales:["▥","red"], "Remote Jobs":["⌂","green"],
  "Government & Public Sector":["▥","slate"], "Hospitality & Hotels":["☕","gold"],
};
const featuredCategories = ["IT & Software","Healthcare & Medical","Finance & Accounting","Engineering","Education & Teaching","Construction","Customer Service","Sales","Remote Jobs","Government & Public Sector","Hospitality & Hotels"];
const trends = ["Remote Jobs","Software Engineer","Nurse","Teacher","Data Analyst","Part-Time","Internship"];

export default function Home() {
  const [query,setQuery] = useState("");
  const [location,setLocation] = useState("");
  const [menuOpen,setMenuOpen] = useState(false);
  const router = useRouter();

  return <>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/">
          <span className="flag-mark"><svg className="usa-flag" viewBox="0 0 190 100" role="img" aria-label="United States flag" focusable="false"><rect width="190" height="100" fill="#fff"/><path fill="#b22234" d="M0 0h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0z"/><rect width="76" height="53.85" fill="#3c3b6e"/><g fill="#fff"><circle key="s0" cx="4" cy="5" r="1.35"/><circle key="s1" cx="11.2" cy="5" r="1.35"/><circle key="s2" cx="18.4" cy="5" r="1.35"/><circle key="s3" cx="25.6" cy="5" r="1.35"/><circle key="s4" cx="32.8" cy="5" r="1.35"/><circle key="s5" cx="40" cy="5" r="1.35"/><circle key="s6" cx="47.2" cy="5" r="1.35"/><circle key="s7" cx="54.4" cy="5" r="1.35"/><circle key="s8" cx="61.6" cy="5" r="1.35"/><circle key="s9" cx="68.8" cy="5" r="1.35"/><circle key="s10" cx="7.6" cy="10.1" r="1.35"/><circle key="s11" cx="14.799999999999999" cy="10.1" r="1.35"/><circle key="s12" cx="22" cy="10.1" r="1.35"/><circle key="s13" cx="29.200000000000003" cy="10.1" r="1.35"/><circle key="s14" cx="36.4" cy="10.1" r="1.35"/><circle key="s15" cx="43.6" cy="10.1" r="1.35"/><circle key="s16" cx="50.800000000000004" cy="10.1" r="1.35"/><circle key="s17" cx="58" cy="10.1" r="1.35"/><circle key="s18" cx="65.2" cy="10.1" r="1.35"/><circle key="s19" cx="72.39999999999999" cy="10.1" r="1.35"/><circle key="s20" cx="4" cy="15.2" r="1.35"/><circle key="s21" cx="11.2" cy="15.2" r="1.35"/><circle key="s22" cx="18.4" cy="15.2" r="1.35"/><circle key="s23" cx="25.6" cy="15.2" r="1.35"/><circle key="s24" cx="32.8" cy="15.2" r="1.35"/><circle key="s25" cx="40" cy="15.2" r="1.35"/><circle key="s26" cx="47.2" cy="15.2" r="1.35"/><circle key="s27" cx="54.4" cy="15.2" r="1.35"/><circle key="s28" cx="61.6" cy="15.2" r="1.35"/><circle key="s29" cx="68.8" cy="15.2" r="1.35"/><circle key="s30" cx="7.6" cy="20.299999999999997" r="1.35"/><circle key="s31" cx="14.799999999999999" cy="20.299999999999997" r="1.35"/><circle key="s32" cx="22" cy="20.299999999999997" r="1.35"/><circle key="s33" cx="29.200000000000003" cy="20.299999999999997" r="1.35"/><circle key="s34" cx="36.4" cy="20.299999999999997" r="1.35"/><circle key="s35" cx="43.6" cy="20.299999999999997" r="1.35"/><circle key="s36" cx="50.800000000000004" cy="20.299999999999997" r="1.35"/><circle key="s37" cx="58" cy="20.299999999999997" r="1.35"/><circle key="s38" cx="65.2" cy="20.299999999999997" r="1.35"/><circle key="s39" cx="72.39999999999999" cy="20.299999999999997" r="1.35"/><circle key="s40" cx="4" cy="25.4" r="1.35"/><circle key="s41" cx="11.2" cy="25.4" r="1.35"/><circle key="s42" cx="18.4" cy="25.4" r="1.35"/><circle key="s43" cx="25.6" cy="25.4" r="1.35"/><circle key="s44" cx="32.8" cy="25.4" r="1.35"/><circle key="s45" cx="40" cy="25.4" r="1.35"/><circle key="s46" cx="47.2" cy="25.4" r="1.35"/><circle key="s47" cx="54.4" cy="25.4" r="1.35"/><circle key="s48" cx="61.6" cy="25.4" r="1.35"/><circle key="s49" cx="68.8" cy="25.4" r="1.35"/></g></svg></span>
          <span className="brand-copy"><strong><span>USA</span> Job Market</strong><small>Find Jobs Across the United States</small></span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a className="active" href="/">Home</a><a href="/jobs">Jobs</a><a href="/companies">Companies</a><a href="/categories">Categories</a><a href="/states">States <span className="chevron">⌄</span></a><a href="/faq">Resources</a><a href="/faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button heart" aria-label="Saved jobs">♡</button><button className="btn sign-in">Sign In</button><button className="btn register">Register</button>
          <button className="mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label="Open menu" aria-expanded={menuOpen}>☰</button>
        </div>
      </div>
      {menuOpen && <div className="mobile-nav">
        {[["Home","/"],["Jobs","/jobs"],["Companies","/companies"],["Categories","/categories"],["States","/states"],["Resources","/faq"],["Blog","/faq"]].map(([item,href]) => <a key={item} href={href} onClick={()=>setMenuOpen(false)}>{item}</a>)}
        <div className="mobile-nav-actions"><button className="btn sign-in">Sign In</button><button className="btn register">Register</button></div>
      </div>}
    </header>

    <main>
      <section className="hero">
        <div className="hero-skyline" aria-hidden="true"><div className="liberty"><span/></div><div className="building b1"/><div className="building b2"/><div className="building b3"/><div className="building b4"/><div className="building b5"/></div>
        <div className="container hero-content">
          <h1>Find Your Dream Job <span>in the USA</span></h1>
          <h2>All Categories. All States. Real Opportunities.</h2>
          <p>Explore USA jobs from configured employer sources. Full-time, part-time, remote, contract, internships and more.</p>
          <form className="hero-search" onSubmit={e=>{e.preventDefault();const p=new URLSearchParams();if(query.trim())p.set("q",query.trim());if(location.trim())p.set("location",location.trim());router.push("/jobs?"+p.toString());}}>
            <label className="search-input"><span>⌕</span><input name="q" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Job title, keyword or company" aria-label="Job title, keyword or company"/></label>
            <label className="search-input"><span>⌖</span><input name="location" value={location} onChange={e=>setLocation(e.target.value)} placeholder="City, State or Remote" aria-label="City, State or Remote"/></label>
            <button className="search-submit" type="submit">Search Jobs</button>
          </form>
          <div className="trending"><strong>Trending:</strong>{trends.map(item=><button key={item} onClick={()=>router.push("/jobs?q="+encodeURIComponent(item))}>{item}</button>)}</div>
        </div>
      </section>

      <section className="category-strip" id="categories">
        <div className="container category-strip-inner">
          {featuredCategories.map(name=>{
            const [icon,tone]=categoryVisuals[name]??["●","blue"];
            return <button key={name} className="category-tile" onClick={()=>selectCategory(name)}><span className={"category-icon "+tone}>{icon}</span><span>{name}</span></button>;
          })}
          <button className="category-tile" onClick={()=>router.push("/categories")}><span className="category-icon purple">⊞</span><span>More<br/>Categories</span></button>
        </div>
      </section>

      <section className="container stat-grid" aria-label="USA Job Market coverage">
        <div className="stat-card"><span className="stat-icon">▣</span><div><strong>Live Sources</strong><small>Employer job feeds</small></div></div>
        <div className="stat-card"><span className="stat-icon">▥</span><div><strong>50 States</strong><small>USA-wide coverage</small></div></div>
        <div className="stat-card"><span className="stat-icon">●</span><div><strong>All Categories</strong><small>Every major career field</small></div></div>
        <div className="stat-card"><span className="stat-icon">♟</span><div><strong>Fresh Checks</strong><small>Sources refreshed regularly</small></div></div>
      </section>

      <section className="section latest" id="jobs">
        <div className="container">
          <div className="section-heading"><div><h2>Latest USA Jobs</h2><p>Fresh opportunities from top companies across the United States.</p></div><a href="/jobs">View All Jobs <span>→</span></a></div>
          <div className="job-grid">
            {filtered.map(job=><article className="job-card" key={job.id} role="link" tabIndex={0} onClick={()=>router.push("/jobs/"+job.slug)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();router.push("/jobs/"+job.slug)}}}>
              <div className="job-card-head"><div className={"company-mark "+job.markClass}>{job.mark}</div><strong>{job.company}</strong><span className="job-type">{job.type}</span><button className="save-job" aria-label={"Save "+job.title} onClick={e=>e.stopPropagation()}>♡</button></div>
              <h3>{job.title}</h3><p className="company-name">{job.company}</p><p className="job-location">⌖ {job.location}</p>
              <div className="job-card-bottom"><strong>{job.salary}</strong><small>{job.posted}</small></div>
            </article>)}
          </div>
          {!filtered.length && <div className="empty">No preview jobs match your search. Try another keyword or location.</div>}
        </div>
      </section>

      <section className="section browse-all" id="categories-all">
        <div className="container"><div className="section-heading"><div><h2>Explore Every Job Category</h2><p>From entry-level opportunities to executive careers across the US.</p></div></div>
          <div className="all-category-grid">{allCategories.map(name=><button key={name} onClick={()=>selectCategory(name)}>{name}<span>→</span></button>)}</div>
        </div>
      </section>

      <section className="section companies-preview" id="companies">
        <div className="container"><div className="section-heading"><div><h2>Top Companies</h2><p>Discover employers and their latest USA opportunities.</p></div><a href="/companies">View All Companies →</a></div>
          <div className="company-grid">{["Google","Amazon","Microsoft","UnitedHealth Group","Tesla","Starbucks"].map((name,i)=><div className="company-card" key={name}><span className={"company-mini mini-"+i}>{name[0]}</span><div><strong>{name}</strong><small>USA opportunities</small></div><span>→</span></div>)}</div>
        </div>
      </section>

      <section className="seo-band" id="states"><div className="container"><div><span className="eyebrow">USA-wide coverage</span><h2>Find jobs in every state.</h2><p>Search by state, city, remote work, category, company and career level.</p></div><a className="btn register" href="/jobs">Explore USA Jobs →</a></div></section>
    </main>

    <footer className="footer" id="resources">
      <div className="container footer-grid">
        <div><a className="footer-brand" href="/"><span className="flag-mark small"><svg className="usa-flag" viewBox="0 0 190 100" role="img" aria-label="United States flag" focusable="false"><rect width="190" height="100" fill="#fff"/><path fill="#b22234" d="M0 0h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0zm0 15.38h190v7.69H0z"/><rect width="76" height="53.85" fill="#3c3b6e"/><g fill="#fff"><circle key="s0" cx="4" cy="5" r="1.35"/><circle key="s1" cx="11.2" cy="5" r="1.35"/><circle key="s2" cx="18.4" cy="5" r="1.35"/><circle key="s3" cx="25.6" cy="5" r="1.35"/><circle key="s4" cx="32.8" cy="5" r="1.35"/><circle key="s5" cx="40" cy="5" r="1.35"/><circle key="s6" cx="47.2" cy="5" r="1.35"/><circle key="s7" cx="54.4" cy="5" r="1.35"/><circle key="s8" cx="61.6" cy="5" r="1.35"/><circle key="s9" cx="68.8" cy="5" r="1.35"/><circle key="s10" cx="7.6" cy="10.1" r="1.35"/><circle key="s11" cx="14.799999999999999" cy="10.1" r="1.35"/><circle key="s12" cx="22" cy="10.1" r="1.35"/><circle key="s13" cx="29.200000000000003" cy="10.1" r="1.35"/><circle key="s14" cx="36.4" cy="10.1" r="1.35"/><circle key="s15" cx="43.6" cy="10.1" r="1.35"/><circle key="s16" cx="50.800000000000004" cy="10.1" r="1.35"/><circle key="s17" cx="58" cy="10.1" r="1.35"/><circle key="s18" cx="65.2" cy="10.1" r="1.35"/><circle key="s19" cx="72.39999999999999" cy="10.1" r="1.35"/><circle key="s20" cx="4" cy="15.2" r="1.35"/><circle key="s21" cx="11.2" cy="15.2" r="1.35"/><circle key="s22" cx="18.4" cy="15.2" r="1.35"/><circle key="s23" cx="25.6" cy="15.2" r="1.35"/><circle key="s24" cx="32.8" cy="15.2" r="1.35"/><circle key="s25" cx="40" cy="15.2" r="1.35"/><circle key="s26" cx="47.2" cy="15.2" r="1.35"/><circle key="s27" cx="54.4" cy="15.2" r="1.35"/><circle key="s28" cx="61.6" cy="15.2" r="1.35"/><circle key="s29" cx="68.8" cy="15.2" r="1.35"/><circle key="s30" cx="7.6" cy="20.299999999999997" r="1.35"/><circle key="s31" cx="14.799999999999999" cy="20.299999999999997" r="1.35"/><circle key="s32" cx="22" cy="20.299999999999997" r="1.35"/><circle key="s33" cx="29.200000000000003" cy="20.299999999999997" r="1.35"/><circle key="s34" cx="36.4" cy="20.299999999999997" r="1.35"/><circle key="s35" cx="43.6" cy="20.299999999999997" r="1.35"/><circle key="s36" cx="50.800000000000004" cy="20.299999999999997" r="1.35"/><circle key="s37" cx="58" cy="20.299999999999997" r="1.35"/><circle key="s38" cx="65.2" cy="20.299999999999997" r="1.35"/><circle key="s39" cx="72.39999999999999" cy="20.299999999999997" r="1.35"/><circle key="s40" cx="4" cy="25.4" r="1.35"/><circle key="s41" cx="11.2" cy="25.4" r="1.35"/><circle key="s42" cx="18.4" cy="25.4" r="1.35"/><circle key="s43" cx="25.6" cy="25.4" r="1.35"/><circle key="s44" cx="32.8" cy="25.4" r="1.35"/><circle key="s45" cx="40" cy="25.4" r="1.35"/><circle key="s46" cx="47.2" cy="25.4" r="1.35"/><circle key="s47" cx="54.4" cy="25.4" r="1.35"/><circle key="s48" cx="61.6" cy="25.4" r="1.35"/><circle key="s49" cx="68.8" cy="25.4" r="1.35"/></g></svg></span><strong>USA Job Market</strong></a><p>Find jobs across the United States by category, company, location and work type.</p></div>
        <div><h3>Jobs</h3><a href="/jobs">Latest Jobs</a><a href="/categories">Job Categories</a><a href="/states">Jobs by State</a><a href="/companies">Companies</a></div>
        <div><h3>Career Resources</h3><a href="/faq">Resume Guide</a><a href="/faq">Interview Guide</a><a href="/faq">Salary Guide</a><a href="/faq">Career FAQ</a></div>
        <div><h3>Company</h3><a href="#about">About Us</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#contact">Contact</a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 USA Job Market. USA jobs only.</span><span>Built for job seekers across America.</span></div>
    </footer>
  </>;
}
