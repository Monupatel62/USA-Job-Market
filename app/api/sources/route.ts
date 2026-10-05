import {sourceRegistry,configuredLeverSources} from "../../../lib/sources";

export const dynamic="force-dynamic";

export async function GET(){
 const sources=configuredLeverSources().length?sourceRegistry:sourceRegistry;
 const checkedAt=new Date().toISOString();
 const health=await Promise.all(sources.map(async source=>{
  const url=source.provider==="greenhouse"
    ? "https://boards-api.greenhouse.io/v1/boards/"+source.token+"/jobs"
    : "https://api.lever.co/v0/postings/"+encodeURIComponent(source.token)+"?mode=json";
  const started=Date.now();
  try{
   const res=await fetch(url,{headers:{Accept:"application/json"},cache:"no-store"});
   return {provider:source.provider,company:source.company,token:source.token,status:res.ok?"healthy":"error",httpStatus:res.status,responseMs:Date.now()-started,checkedAt};
  }catch(error){
   return {provider:source.provider,company:source.company,token:source.token,status:"error",httpStatus:null,responseMs:Date.now()-started,error:error instanceof Error?error.message:"Unknown error",checkedAt};
  }
 }));
 return Response.json({checkedAt,total:health.length,healthy:health.filter(item=>item.status==="healthy").length,failed:health.filter(item=>item.status==="error").length,sources:health});
}
