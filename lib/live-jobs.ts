import {sourceRegistry,configuredLeverSources,normalizeText,normalizeJobContent,isUsLocation,inferRemote,slugify} from "./sources";
import {inferCategory} from "./job-taxonomy";
import type {Job} from "./job-types";

export const revalidate=900;

function inferType(value:string,title:string):Job["type"]{
 const text=value+" "+title;
 if(/intern|internship|co-op/i.test(text))return "Internship";
 if(/part.?time/i.test(text))return "Part-time";
 if(/contract|contractor/i.test(text))return "Contract";
 if(/temporary|seasonal/i.test(text))return "Temporary";
 return "Full-time";
}

function dedupeJobs(input:Job[]){
 const sourceMap=new Map<string,Job>();
 for(const job of input)sourceMap.set((job.source+"|"+job.sourceJobId).toLowerCase(),job);
 const listingMap=new Map<string,Job>();
 for(const job of sourceMap.values()){
  const key=[job.company,job.title,job.location].map(normalizeText).join("|").toLowerCase();
  const old=listingMap.get(key);
  if(!old||new Date(job.fetchedAt).getTime()>new Date(old.fetchedAt).getTime())listingMap.set(key,job);
 }
 return [...listingMap.values()].map(job=>({...job,isActive:true,lastSeenAt:job.fetchedAt}));
}

async function greenhouseJobs():Promise<Job[]>{
 const results=await Promise.allSettled(sourceRegistry.filter(s=>s.provider==="greenhouse").map(async source=>{
  const res=await fetch("https://boards-api.greenhouse.io/v1/boards/"+source.token+"/jobs?content=true",{next:{revalidate:900}});
  if(!res.ok)throw new Error(source.company+" HTTP "+res.status);
  const data=await res.json() as {jobs?:any[]};
  return (data.jobs??[]).filter(item=>isUsLocation(normalizeText(item.location?.name))).map(item=>{
   const location=normalizeText(item.location?.name);
   return {id:"greenhouse-"+source.token+"-"+item.id,slug:slugify(item.title+"-"+source.company+"-"+item.id),title:normalizeText(item.title),company:source.company,location,city:location.split(",")[0]??location,state:location.split(",")[1]?.trim()??"",category:inferCategory(item.title, location, normalizeText(item.content)),type:inferType("",item.title),remote:inferRemote(location,item.title),description:normalizeJobContent(item.content),source:"greenhouse",sourceName:source.company,sourceUrl:item.absolute_url,sourceJobId:String(item.id),postedAt:item.updated_at,fetchedAt:new Date().toISOString()} as Job;
  });
 }));
 return results.flatMap(r=>r.status==="fulfilled"?r.value:[]);
}

async function leverJobs():Promise<Job[]>{
 const results=await Promise.allSettled(configuredLeverSources().map(async source=>{
  const res=await fetch("https://api.lever.co/v0/postings/"+encodeURIComponent(source.token)+"?mode=json",{headers:{Accept:"application/json"},next:{revalidate:900}});
  if(!res.ok)throw new Error(source.company+" HTTP "+res.status);
  const data=await res.json() as any[];
  return (Array.isArray(data)?data:[]).filter(item=>{
   const locations=[item.categories?.location,...(item.categories?.allLocations??[])].filter(Boolean).join(", ");
   return item.country==="US"||isUsLocation(locations);
  }).map(item=>{
   const locations=[item.categories?.location,...(item.categories?.allLocations??[])].filter(Boolean);
   const location=String(locations.find((value:string)=>isUsLocation(value))??locations[0]??"USA");
   const parts=normalizeText(location).split(",");
   const title=normalizeText(item.text);
   return {id:"lever-"+source.token+"-"+item.id,slug:slugify(title+"-"+source.company+"-"+item.id),title,company:source.company,location,city:parts[0]??location,state:parts[1]?.trim()??"",category:inferCategory(title, normalizeText(item.categories?.team), normalizeText(item.categories?.department), location, normalizeText(item.descriptionPlain||item.openingPlain)),type:inferType(normalizeText(item.categories?.commitment),title),remote:/remote/i.test(normalizeText(item.workplaceType))||inferRemote(location,title),salary:normalizeText(item.salaryDescriptionPlain),description:normalizeJobContent(item.descriptionPlain||item.openingPlain),source:"lever",sourceName:source.company,sourceUrl:item.hostedUrl||item.applyUrl,sourceJobId:String(item.id),postedAt:item.createdAt?new Date(item.createdAt).toISOString():new Date().toISOString(),fetchedAt:new Date().toISOString()} as Job;
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
  return {id:"usajobs-"+(d.PositionID??item.MatchedObjectId),slug:slugify((d.PositionTitle??"USA Government Job")+"-"+(d.PositionID??item.MatchedObjectId)),title:normalizeText(d.PositionTitle),company:normalizeText(d.OrganizationName||d.DepartmentName||"U.S. Government"),location:normalizeText(loc),city:normalizeText(loc).split(",")[0]??"",state:normalizeText(loc).split(",")[1]?.trim()??"",category:"Government & Public Sector",type:inferType("", d.PositionTitle),remote:inferRemote(loc,d.PositionTitle),description:normalizeText(d.UserArea?.Details?.JobSummary||d.QualificationSummary||""),source:"usajobs",sourceName:"USAJOBS",sourceUrl:d.PositionURI,sourceJobId:String(d.PositionID??item.MatchedObjectId),postedAt:d.PublicationStartDate,fetchedAt:new Date().toISOString()} as Job;
 });
}

export async function fetchLiveJobs():Promise<Job[]>{
 const [greenhouse,lever,government]=await Promise.allSettled([greenhouseJobs(),leverJobs(),usaJobs()]);
 return dedupeJobs([
  ...(greenhouse.status==="fulfilled"?greenhouse.value:[]),
  ...(lever.status==="fulfilled"?lever.value:[]),
  ...(government.status==="fulfilled"?government.value:[])
 ]).filter(job=>job.source==="usajobs"||isUsLocation(job.location));
}