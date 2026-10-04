import {NextRequest,NextResponse} from "next/server";
import {filterJobs} from "../../../lib/job-data";
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams; const remote=p.get("remote");
 const jobs=filterJobs({q:p.get("q")??undefined,location:p.get("location")??undefined,category:p.get("category")??undefined,type:p.get("type")??undefined,remote:remote===null?undefined:remote==="true"});
 return NextResponse.json({count:jobs.length,jobs});
}