import Link from "next/link";
import {notFound} from "next/navigation";
import {usaCities} from "../../../lib/cities";
import {fetchLiveJobs} from "../../../lib/live-jobs";
import {jobs as previewJobs} from "../../../lib/job-data";

const siteUrl="https://usajobmarket.netlify.app";
export const revalidate=900;

export function generateStaticParams(){return usaCities.map(([slug])=>({slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const city=usaCities.find(c=>c[0]===slug); if(!city)return {};
 const [,name,state]=city;
 return {title:`${name}, ${state} Jobs | USA Job Market`,description:`Find jobs in ${name}, ${state}. Browse USA opportunities by company, category and work type.`,alternates:{canonical:`${siteUrl}/cities/${slug}`}};
}

export default async function CityPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const city=usaCities.find(c=>c[0]===slug); if(!city)notFound();
 const [,name,state]=city; const live=await fetchLiveJobs();
 const matches=live.filter(j=>j.city?.toLowerCase()===name.toLowerCase() || j.location.toLowerCase().includes(name.toLowerCase()+", "+state.toLowerCase()));
 const result=matches.length?matches:previewJobs.filter(j=>j.location.toLowerCase().includes(name.toLowerCase()+", "+state.toLowerCase()));
 const data=matches.length?"live":"preview";
 const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"USA Job Market","item":siteUrl},
  {"@type":"ListItem","position":2,"name":"Jobs by City","item":siteUrl+"/cities"},
  {"@type":"ListItem","position":3,"name":`${name}, ${state}`,"item":siteUrl+"/cities/"+slug}
 ]};
 return <main className="directory-page"><div className="container">
  <span className="eyebrow">{state} • USA jobs</span><h1>{name}, {state} Jobs</h1>
  <p className="directory-intro">Find job opportunities in {name}, {state}, including full-time, part-time, contract, internship and remote-friendly roles.</p>
  <div className="results-head"><strong>{result.length} {result.length===1?"job":"jobs"}</strong><span>{data==="live"?"Live employer data":"Preview data while sources refresh"} • USA only</span></div>
  <div className="jobs-list">{result.map(job=><article className="result-card" key={job.id}><div className="result-logo">{job.company.slice(0,1)}</div><div className="result-body"><Link href={"/jobs/"+job.slug}><h2>{job.title}</h2></Link><p className="result-company">{job.company}</p><p>{job.location} • {job.type}{job.remote?" • Remote":""}</p><div className="result-tags"><span>{job.category}</span>{job.salary&&<span>{job.salary}</span>}</div></div><Link className="btn register" href={"/jobs/"+job.slug}>View Job</Link></article>)}{!result.length&&<div className="empty">No current preview listings are available for this city. Check the main jobs search for broader USA results.</div>}</div>
  <div className="seo-band"><div><span className="eyebrow">Keep exploring</span><h2>More USA jobs</h2><p>Search all jobs, browse every state, or explore career categories.</p></div><Link className="btn register" href="/jobs">Search All Jobs →</Link></div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
 </div></main>
}
