import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs, getJobBySlug } from "../../../lib/job-data";
import { fetchLiveJobs } from "../../../lib/live-jobs";

const siteUrl="https://usajobmarket.netlify.app";
export function generateStaticParams(){return jobs.map(job=>({slug:job.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const preview=getJobBySlug(slug);const live=preview?undefined:(await fetchLiveJobs()).find(job=>job.slug===slug);const job=preview??live;return job?{title:job.title+" at "+job.company+" | USA Job Market",description:"Find and apply for "+job.title+" at "+job.company+" in "+job.location+".",alternates:{canonical:siteUrl+"/jobs/"+job.slug}}:{title:"Job Not Found | USA Job Market"};}

export default async function JobDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const preview=getJobBySlug(slug);
 const live=preview?undefined:(await fetchLiveJobs()).find(job=>job.slug===slug);
 const job=preview??live;
 if(!job)notFound();
 const isLive=job.source!=="employer";
 const jsonLd=isLive?{"@context":"https://schema.org","@type":"JobPosting",title:job.title,description:job.description,datePosted:job.postedAt,hiringOrganization:{"@type":"Organization",name:job.company},jobLocation:{"@type":"Place",address:{"@type":"PostalAddress",addressLocality:job.city,addressRegion:job.state,addressCountry:"US"}},employmentType:job.type.replace("-","_").toUpperCase(),url:job.sourceUrl}:null;
 const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"USA Job Market",item:siteUrl},{"@type":"ListItem",position:2,name:"USA Jobs",item:siteUrl+"/jobs"},{"@type":"ListItem",position:3,name:job.title,item:siteUrl+"/jobs/"+job.slug}]};
 return <main className="job-detail-page"><div className="container"><Link className="back-link" href="/jobs">← Back to USA jobs</Link><article className="detail-card">
  <header className="detail-head"><div className="result-logo large">{job.company.slice(0,1)}</div><div><span className="eyebrow">{job.category}</span><h1>{job.title}</h1><p>{job.company} • {job.location}</p></div><span className="job-type">{job.type}</span></header>
  <div className="detail-grid"><section>
   <h2>Job overview</h2>
   <p>{job.description}</p>
   <div className="detail-meta">
    <span>Location: {job.location}</span><span>Category: {job.category}</span><span>Work type: {job.type}</span><span>Remote: {job.remote?"Yes":"No"}</span>
    {job.salary&&<span>Salary: {job.salary}</span>}
   </div>
   <h2>Job source & application</h2>
   <p className="notice">{isLive?"This job was found from the employer's configured job source. The button below opens the original employer listing where you can review the complete details and apply.":"This is a preview listing. The reference source below is the employer career site; verify that the exact opening is available there before applying."}</p>
   {job.sourceUrl&&<div className="apply-actions"><a className="btn register apply-button" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">{isLive?"Apply on "+job.sourceName:"View openings on "+job.sourceName} ↗</a><a className="source-link" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">Reference source: {job.sourceUrl} ↗</a></div>}
  </section>
  <aside className="detail-side"><strong>Listing source</strong><span>{job.sourceName}</span><strong>Reference / Apply link</strong>{job.sourceUrl?<a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">Open source ↗</a>:<span>Not available</span>}<strong>Posted</strong><span>{new Date(job.postedAt).toLocaleDateString("en-US")}</span><strong>Last checked</strong><span>{new Date(job.fetchedAt).toLocaleDateString("en-US")}</span></aside>
  </div></article></div>{jsonLd&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/></main>;
}