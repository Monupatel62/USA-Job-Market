import Link from "next/link";
import {categories} from "../../lib/categories";
import {filterJobs,jobs as previewJobs} from "../../lib/job-data";
import {fetchLiveJobs} from "../../lib/live-jobs";

export const revalidate=900;
export default async function JobsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const p=await searchParams; const val=(k:string)=>Array.isArray(p[k])?p[k][0]:(p[k]??"");
 const q=String(val("q")),location=String(val("location")),category=String(val("category")||"All categories"),type=String(val("type")||"All types");
 const live=await fetchLiveJobs(); const source=live.length?live:previewJobs; const result=filterJobs({q,location,category,type},source);
 return <main className="jobs-page"><div className="container jobs-page-head"><span className="eyebrow">USA jobs</span><h1>Find jobs across the United States</h1><p>Search live employer listings by title, company, city, state, category or work type.</p>
 <form className="jobs-filter-bar"><input name="q" defaultValue={q} placeholder="Job title, keyword or company"/><input name="location" defaultValue={location} placeholder="City, State or Remote"/><select name="category" defaultValue={category}><option>All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select name="type" defaultValue={type}><option>All types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select><button className="search-submit">Search</button></form></div>
 <div className="container jobs-results"><div className="results-head"><strong>{result.length} jobs</strong><span>{live.length?"Live employer data":"Preview data while sources refresh"} • USA only</span></div><div className="jobs-list">{result.map(job=><Link className="result-card" key={job.id} href={"/jobs/"+job.slug}><div className="result-logo">{job.company.slice(0,1)}</div><div className="result-body"><Link href={"/jobs/"+job.slug}><h2>{job.title}</h2></Link><p className="result-company">{job.company}</p><p>{job.location} • {job.type}{job.remote?" • Remote":""}</p><div className="result-tags"><span>{job.category}</span>{job.salary&&<span>{job.salary}</span>}</div></div><span className="btn register">View Job</span></Link>)}{!result.length&&<div className="empty">No jobs found. Try a broader keyword or location.</div>}</div></div></main>;
}