"use client";

import { useMemo, useState } from "react";
import { categories as allCategories } from "../lib/categories";

type Job = {
  id: string; title: string; company: string; location: string; state: string;
  category: string; type: string; salary: string; posted: string; remote: boolean;
};

const jobs: Job[] = [
  { id:"1", title:"Software Engineer", company:"Northstar Technologies", location:"Austin, TX", state:"Texas", category:"IT & Software", type:"Full-time", salary:"$110K–$145K", posted:"Today", remote:false },
  { id:"2", title:"Registered Nurse", company:"Lakeside Health", location:"Chicago, IL", state:"Illinois", category:"Healthcare & Medical", type:"Full-time", salary:"$78K–$104K", posted:"Today", remote:false },
  { id:"3", title:"Customer Service Representative", company:"Summit Retail Group", location:"Remote, USA", state:"Remote", category:"Customer Service", type:"Full-time", salary:"$42K–$58K", posted:"1 day ago", remote:true },
  { id:"4", title:"Data Analyst", company:"Brightline Finance", location:"New York, NY", state:"New York", category:"Data Science & Analytics", type:"Full-time", salary:"$82K–$118K", posted:"1 day ago", remote:false },
  { id:"5", title:"Warehouse Associate", company:"United Distribution", location:"Columbus, OH", state:"Ohio", category:"Warehouse & Supply Chain", type:"Part-time", salary:"$19–$24/hr", posted:"2 days ago", remote:false },
  { id:"6", title:"Project Manager", company:"CivicWorks", location:"Washington, DC", state:"District of Columbia", category:"Management", type:"Full-time", salary:"$95K–$132K", posted:"2 days ago", remote:true },
];

const categories = allCategories.map((name) => [name, "Browse jobs"] as const);

export default function Home() {
  const [query,setQuery] = useState("");
  const [location,setLocation] = useState("");
  const [category,setCategory] = useState("All categories");
  const [type,setType] = useState("All types");

  const filtered = useMemo(() => jobs.filter(j => {
    const q = query.toLowerCase().trim();
    const matchesQ = !q || [j.title,j.company,j.category,j.location].join(" ").toLowerCase().includes(q);
    const matchesLocation = !location || j.location.toLowerCase().includes(location.toLowerCase()) || j.state.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = category === "All categories" || j.category === category;
    const matchesType = type === "All types" || j.type === type;
    return matchesQ && matchesLocation && matchesCategory && matchesType;
  }),[query,location,category,type]);

  return <>
    <div className="topbar"><div className="container topbar-inner"><span>🇺🇸 Jobs across all 50 states + Washington, DC</span><span>USA Job Market</span></div></div>
    <header className="header"><div className="container header-inner">
      <a className="brand" href="/"><span className="brand-mark">US</span><span>USA Job Market</span></a>
      <nav className="nav"><a href="#jobs">Jobs</a><a href="#categories">Categories</a><a href="#states">States</a><a href="#resources">Career Resources</a></nav>
      <div className="header-actions"><button className="btn">Post a Job</button><button className="btn btn-primary">Sign In</button><button className="btn mobile-menu" aria-label="Menu">☰</button></div>
    </div></header>

    <main>
      <section className="hero"><div className="container">
        <div className="hero-copy">
          <div className="eyebrow">USA job search</div>
          <h1>Find your next job in the United States.</h1>
          <p>Search jobs by title, company, location, category, work type and more. One focused place for opportunities across the USA.</p>
          <div className="search-box">
            <div className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Job title, keyword or company" aria-label="Job title, keyword or company"/></div>
            <div className="search-field"><span>⌖</span><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City, state or remote" aria-label="Location"/></div>
            <div className="search-field"><span>▦</span><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Category"><option>All categories</option>{categories.map(c=><option key={c[0]}>{c[0]}</option>)}</select></div>
            <button className="search-button" onClick={()=>document.getElementById("jobs")?.scrollIntoView({behavior:"smooth"})}>Search Jobs</button>
          </div>
        </div>
        <div className="stats"><div className="stat"><strong>50 States</strong><span>USA coverage</span></div><div className="stat"><strong>All Careers</strong><span>Every major category</span></div><div className="stat"><strong>Remote</strong><span>Remote opportunities</span></div><div className="stat"><strong>Updated</strong><span>Fresh listings planned</span></div></div>
      </div></section>

      <section className="section" id="jobs"><div className="container">
        <div className="section-head"><div><h2>Latest jobs</h2><div className="muted">{filtered.length} jobs matching your filters</div></div><select className="btn" value={type} onChange={e=>setType(e.target.value)} aria-label="Job type"><option>All types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div>
        <div className="layout">
          <aside className="filters"><div className="filter-title">Filter jobs</div><div className="filter-group"><label>Category</label><select value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option>{categories.map(c=><option key={c[0]}>{c[0]}</option>)}</select></div><div className="filter-group"><label>Work type</label><select value={type} onChange={e=>setType(e.target.value)}><option>All types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div><div className="filter-group"><label>Location</label><input className="search-field" style={{width:"100%"}} value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. California" /></div></aside>
          <div className="jobs">
            {filtered.length ? filtered.map(job=><article className="job-card" key={job.id}>
              <div className="job-top"><div className="job-main"><div className="company-logo">{job.company.slice(0,2).toUpperCase()}</div><div><h3 className="job-title">{job.title}</h3><div className="company">{job.company}</div></div></div><div className="salary">{job.salary}</div></div>
              <div className="job-meta"><span>⌖ {job.location}</span><span>◷ {job.type}</span><span>• {job.posted}</span>{job.remote && <span className="badge">Remote</span>}<span className="badge">{job.category}</span></div>
              <div className="job-footer"><span className="muted">Official application link will be shown here</span><a className="btn btn-primary" href="#apply">View Job</a></div>
            </article>) : <div className="empty">No jobs match these filters. Try another keyword, location or category.</div>}
          </div>
        </div>
      </div></section>

      <section className="section" id="categories"><div className="container"><div className="section-head"><div><h2>Browse by category</h2><div className="muted">Jobs across the US economy</div></div></div><div className="categories">{categories.map(c=><a className="category" href={"#jobs"} key={c[0]} onClick={()=>setCategory(c[0])}>{c[0]}<small>{c[1]} jobs</small></a>)}</div></div></section>
    </main>

    <footer className="footer" id="resources"><div className="container footer-grid"><div><h3>USA Job Market</h3><p className="muted">A USA-focused job discovery platform built for job seekers.</p></div><div><h3>Jobs</h3><a href="#jobs">Latest Jobs</a><a href="#categories">Categories</a><a href="#states">States</a></div><div><h3>Resources</h3><a href="#resume">Resume Guide</a><a href="#interview">Interview Guide</a><a href="#salary">Salary Guide</a></div><div><h3>Company</h3><a href="#about">About</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div></footer>
  </>;
}
