import jobsJson from "../data/jobs.json";
import type {Job} from "./job-types";
export const jobs=jobsJson as Job[];
export function getJobBySlug(slug:string,source:Job[]=jobs){return source.find(job=>job.slug===slug);}
export function filterJobs(p:{q?:string;location?:string;category?:string;type?:string;remote?:boolean},source:Job[]=jobs){
 const q=p.q?.trim().toLowerCase()??"",loc=p.location?.trim().toLowerCase()??"";
 return source.filter(job=>{
  const mq=!q||[job.title,job.company,job.category,job.location,job.city,job.state].join(" ").toLowerCase().includes(q);
  const ml=!loc||[job.location,job.city,job.state].join(" ").toLowerCase().includes(loc);
  const mc=!p.category||p.category==="All categories"||job.category===p.category;
  const mt=!p.type||p.type==="All types"||job.type===p.type;
  const mr=p.remote===undefined||job.remote===p.remote;
  return mq&&ml&&mc&&mt&&mr;
 });
}