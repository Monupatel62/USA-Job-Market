import {sourceRegistry,normalizeText,isUsLocation,inferRemote,slugify} from "./sources";
import type {Job} from "./job-types";

export const revalidate=900;

async function greenhouseJobs():Promise<Job[]>{
 const results=await Promise.allSettled(sourceRegistry.filter(s=>s.provider==="greenhouse").map(async source=>{
  const res=await fetch("https://boards-api.greenhouse.io/v1/boards/"+source.token+"/jobs?content=true",{next:{revalidate:900}});
  if(!res.ok)throw new Error(source.company+" HTTP "+res.status);
  const data=await res.json() as {jobs?:any[]};
  return (data.jobs??[]).filter(item=>isUsLocation(normalizeText(item.location?.name))).map(item=>{
   const location=normalizeText(item.location?.name);
   return {id:"greenhouse-"+source.token+"-"+item.id,slug:slugify(item.title+"-"+source.company+"-"+item.id),title:normalizeText(item.title),company:source.company,location,city:location.split(",")[0]??location,state:location.split(",")[1]?.trim()??"",category:"Other Jobs",type:"Full-time",remote:inferRemote(location,item.title),description:normalizeText(item.content),source:"greenhouse",sourceName:source.company,sourceUrl:item.absolute_url,sourceJobId:String(item.id),postedAt:item.updated_at,fetchedAt:new Date().toISOString()} as Job;
  });
 }));
 return results.flatMap(r=>r.status==="fulfilled"?r.value:[]);
}

async function usaJobs():Promise<Job[]>{
 const key=process.env.USAJOBS_API_KEY;
 const agent=process.env.USAJOBS_USER_AGENT;
 if(!key||!agent)return [];
 const res=await fetch("https://data.usajobs.gov/api/Search?ResultsPerPage=500",{headers:{Host:"data.usajobs.gov","User-Agent":agent,"Authorization-Key":key},next:{revalidate:900}});
 if(!res.ok)throw new Error("USAJOBS HTTP "+res.status);
 const data=await res.json() as any;
 return (data.SearchResult?.SearchResultItems??[]).map((item:any)=>{
  const d=item.MatchedObjectDescriptor??{};
  const loc=d.PositionLocationDisplay??d.PositionLocation?.[0]?.LocationName??"";
  return {id:"usajobs-"+(d.PositionID??item.MatchedObjectId),slug:slugify((d.PositionTitle??"USA Government Job")+"-"+(d.PositionID??item.MatchedObjectId)),title:normalizeText(d.PositionTitle),company:normalizeText(d.OrganizationName||d.DepartmentName||"U.S. Government"),location:normalizeText(loc),city:normalizeText(loc).split(",")[0]??"",state:normalizeText(loc).split(",")[1]?.trim()??"",category:"Government & Public Sector",type:"Full-time",remote:inferRemote(loc,d.PositionTitle),description:normalizeText(d.UserArea?.Details?.JobSummary||d.QualificationSummary||""),source:"usajobs",sourceName:"USAJOBS",sourceUrl:d.PositionURI,sourceJobId:String(d.PositionID??item.MatchedObjectId),postedAt:d.PublicationStartDate,fetchedAt:new Date().toISOString()} as Job;
 });
}

export async function fetchLiveJobs():Promise<Job[]>{
 const [greenhouse,government]=await Promise.allSettled([greenhouseJobs(),usaJobs()]);
 return [
  ...(greenhouse.status==="fulfilled"?greenhouse.value:[]),
  ...(government.status==="fulfilled"?government.value:[])
 ].filter(job=>job.source==="usajobs"||isUsLocation(job.location));
}