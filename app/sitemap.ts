import type {MetadataRoute} from "next";
import {categories} from "../../lib/categories";
import {usaStates} from "../../lib/states";
import {cities} from "../../lib/cities";
import {sourceRegistry,slugify} from "../../lib/sources";
import {jobs} from "../../lib/job-data";
import {fetchLiveJobs} from "../../lib/live-jobs";

const base="https://usajobmarket.netlify.app";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const live=await fetchLiveJobs();
 const current=live.length?live:jobs;
 const urls=[
  "", "/jobs","/categories","/states","/cities","/companies","/faq",
  ...categories.map(c=>"/categories/"+slugify(c)),
  ...usaStates.map(([slug])=>"/states/"+slug),
  ...cities.map(([slug])=>"/cities/"+slug),
  ...sourceRegistry.map(s=>"/companies/"+s.token),
  ...current.map(j=>"/jobs/"+j.slug)
 ];
 return [...new Set(urls)].map(path=>({url:base+path,lastModified:new Date()}));
}
