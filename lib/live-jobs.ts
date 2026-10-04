import {sourceRegistry,normalizeText,isUsLocation,inferRemote,slugify} from "./sources";
import type {Job} from "./job-types";
export const revalidate=900;
export async function fetchLiveJobs():Promise<Job[]>{
 const results=await Promise.allSettled(sourceRegistry.map(async source=>{
  if(source.provider!=="greenhouse") return [];
  const res=await fetch("https://boards-api.greenhouse.io/v1/boards/"+source.token+"/jobs?content=true",{next:{revalidate:900}});
  if(!res.ok) throw new Error(source.company+" HTTP "+res.status);
  const data=await res.json() as {jobs?:any[]};
  return (data.jobs??[]).filter(item=>isUsLocation(normalizeText(item.location?.name))).map(item=>{
   const location=normalizeText(item.location?.name);
   return {id:"greenhouse-"+source.token+"-"+item.id,slug:slugify(item.title+"-"+source.company+"-"+item.id),title:normalizeText(item.title),company:source.company,location,city:location.split(",")[0]??location,state:location.split(",")[1]?.trim()??"",category:"Other Jobs",type:"Full-time",remote:inferRemote(location,item.title),description:normalizeText(item.content),source:"greenhouse",sourceName:source.company,sourceUrl:item.absolute_url,sourceJobId:String(item.id),postedAt:item.updated_at,fetchedAt:new Date().toISOString()} as Job;
  });
 }));
 return results.flatMap(r=>r.status==="fulfilled"?r.value:[]);
}