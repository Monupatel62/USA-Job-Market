import type {MetadataRoute} from "next";
import {usaStates} from "../lib/states";
import {categories} from "../lib/categories";
import {jobs} from "../lib/job-data";
export default function sitemap():MetadataRoute.Sitemap{
 const base="https://usajobmarket.com";
 return [
  {url:base,lastModified:new Date(),changeFrequency:"daily",priority:1},
  {url:base+"/jobs",lastModified:new Date(),changeFrequency:"hourly",priority:.95},
  {url:base+"/categories",lastModified:new Date(),changeFrequency:"weekly",priority:.8},
  {url:base+"/states",lastModified:new Date(),changeFrequency:"weekly",priority:.8},
  ...categories.map(c=>({url:base+"/jobs?category="+encodeURIComponent(c),lastModified:new Date(),changeFrequency:"daily" as const,priority:.65})),
  ...usaStates.map(([slug])=>({url:base+"/states/"+slug,lastModified:new Date(),changeFrequency:"daily" as const,priority:.7})),
  ...jobs.map(j=>({url:base+"/jobs/"+j.slug,lastModified:new Date(j.fetchedAt),changeFrequency:"daily" as const,priority:.6}))
 ];
}