import type {MetadataRoute} from "next";
import {usaStates} from "../lib/states";
import {categories} from "../lib/categories";
import {jobs} from "../lib/job-data";
import {slugify} from "../lib/sources";

const base="https://usajobmarket.netlify.app";

export default function sitemap():MetadataRoute.Sitemap{
 const now=new Date();
 return [
  {url:base,lastModified:now,changeFrequency:"daily",priority:1},
  {url:base+"/jobs",lastModified:now,changeFrequency:"hourly",priority:.95},
  {url:base+"/categories",lastModified:now,changeFrequency:"weekly",priority:.85},
  {url:base+"/states",lastModified:now,changeFrequency:"weekly",priority:.85},
  {url:base+"/faq",lastModified:now,changeFrequency:"monthly",priority:.6},
  ...categories.map(c=>({url:base+"/categories/"+slugify(c),lastModified:now,changeFrequency:"daily" as const,priority:.7})),
  ...usaStates.map(([slug])=>({url:base+"/states/"+slug,lastModified:now,changeFrequency:"daily" as const,priority:.7})),
  ...jobs.map(j=>({url:base+"/jobs/"+j.slug,lastModified:new Date(j.fetchedAt),changeFrequency:"daily" as const,priority:.6}))
 ];
}