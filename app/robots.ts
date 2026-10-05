import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://usajobmarket.netlify.app/sitemap.xml",
    host: "https://usajobmarket.netlify.app"
  };
}
