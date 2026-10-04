import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs, getJobBySlug } from "../../../lib/job-data";
import { fetchLiveJobs } from "../../../lib/live-jobs";

export function generateStaticParams(){return jobs.map(job=>({slug:job.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const preview=getJobBySlug(slug);
 const live=preview?undefined:(await fetchLiveJobs()).find(job=>job.slug===slug);
 const job=preview??live;
 return job?{title:job.title+" at "+job.company+" | USA Job Market",description:"Find and apply for "+job.title+" at "+job.company+" in "+job.location+"."}:{title:"Job Not Found | USA Job Market"};
}

export default async function JobDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const preview=getJobBySlug(slug);
 const live=preview?undefined:(await fetchLiveJobs()).find(job=>job.slug===slug);
 const job=preview??live;
 if(!job)notFound();
 const isLive=job.source!=="employer";
 const jsonLd=isLive?{"@context":"https://schema.org","@type":"JobPosting",title:job.title,description:job.description,datePosted:job.postedAt,hiringOrganization:{"@type":"Organization",name:job.company},jobLocation:{"@type":"Place",address:{"@type":"PostalAddress",addressLocality:job.city,addressRegion:job.state,addressCountry:"US"}},employmentType:job.type.replace("-","_").toUpperCase(),url:job.sourceUrl}:null;
 return <main className="job-detail-page"><div className="container"><Link className="back-link" href="/jobs">← Back to USA jobs</Link><article className="detail-card"><header className="detail-head"><div className="result-logo large">{job.company.slice(0,1)}</div><div><span className="eyebrow">{job.category}</span><h1>{job.title}</h1><p>{job.company} • {job.location}</p></div><span className="job-type">{job.type}</span></header><div className="detail-grid"><section><h2>Job overview</h2><p>{job.description}</p><div className="detail-meta"><span>Location: {job.location}</span><span>Category: {job.category}</span><span>Work type: {job.type}</span><span>Remote: {job.remote?"Yes":"No"}</span></div><h2>Apply for this job</h2><p className="notice">{isLive?"Apply through the original employer job page and verify the opening before submitting.":"Preview listing only — wait for a live source before treating this as an active opening."}</p>{isLive&&<a className="btn register apply-button" href={job.sourceUrl} target="_blank" rel="noreferrer">Apply on {job.sourceName} ↗</a>}</section><aside className="detail-side"><strong>Listing source</strong><span>{job.sourceName}</span><strong>Posted</strong><span>{new Date(job.postedAt).toLocaleDateString("en-US")}</span><strong>Last checked</strong><span>{new Date(job.fetchedAt).toLocaleDateString("en-US")}</span></aside></div></article></div>{jsonLd&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>}</main>;
}