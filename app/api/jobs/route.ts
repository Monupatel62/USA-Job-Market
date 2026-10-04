import {NextRequest,NextResponse} from "next/server";
import {filterJobs,jobs as previewJobs} from "../../../lib/job-data";
import {fetchLiveJobs} from "../../../lib/live-jobs";
export const revalidate=900;
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams; const remote=p.get("remote");
 const live=await fetchLiveJobs(); const source=live.length?live:previewJobs;
 const jobs=filterJobs({q:p.get("q")??undefined,location:p.get("location")??undefined,category:p.get("category")??undefined,type:p.get("type")??undefined,remote:remote===null?undefined:remote==="true"},source);
 return NextResponse.json({count:jobs.length,live:live.length>0,jobs});
}