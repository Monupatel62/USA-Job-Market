import jobsJson from "../data/jobs.json";
import type {Job} from "./job-types";
export const jobs=jobsJson as Job[];
export function getJobBySlug(slug:string,source:Job[]=jobs){return source.find(job=>job.slug===slug);}
function salaryNumber(value?:string){if(!value)return 0;const n=value.replace(/,/g,"").match(/\$?\s*(\d+(?:\.\d+)?)\s*(k|K)?/);if(!n)return 0;return Number(n[1])*(n[2]?1000:1);}
export function filterJobs(p:{q?:string;location?:string;category?:string;type?:string;remote?:boolean;salaryMin?:number;experience?:string;sort?:string},source:Job[]=jobs){
 const q=p.q?.trim().toLowerCase()??"",loc=p.location?.trim().toLowerCase()??"";
 const result=source.filter(job=>{
  const mq=!q||[job.title,job.company,job.category,job.location,job.city,job.state].join(" ").toLowerCase().includes(q);
  const ml=!loc||[job.location,job.city,job.state].join(" ").toLowerCase().includes(loc);
  const mc=!p.category||p.category==="All categories"||job.category===p.category;
  const mt=!p.type||p.type==="All types"||job.type===p.type;
  const mr=p.remote===undefined||job.remote===p.remote;
  const ms=!p.salaryMin||salaryNumber(job.salary)>=p.salaryMin;
  const me=!p.experience||p.experience==="All experience"||String(job.experience??"").toLowerCase().includes(p.experience.toLowerCase());
  return mq&&ml&&mc&&mt&&mr&&ms&&me;
 });
 return result.sort((a,b)=>{
  if(p.sort==="oldest")return new Date(a.postedAt).getTime()-new Date(b.postedAt).getTime();
  if(p.sort==="salary")return salaryNumber(b.salary)-salaryNumber(a.salary);
  return new Date(b.postedAt).getTime()-new Date(a.postedAt).getTime();
 });
}