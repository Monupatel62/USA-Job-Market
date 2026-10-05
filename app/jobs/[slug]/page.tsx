import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs, getJobBySlug } from "../../../lib/job-data";
import { fetchLiveJobs } from "../../../lib/live-jobs";

const siteUrl = "https://usajobmarket.netlify.app";

export function generateStaticParams() { return jobs.map(job => ({ slug: job.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = getJobBySlug(slug);
  const live = preview ? undefined : (await fetchLiveJobs()).find(job => job.slug === slug);
  const job = preview ?? live;
  return job ? { title: job.title + " at " + job.company + " | USA Job Market", description: "Full job details, requirements, location and application link for " + job.title + " at " + job.company + ".", alternates: { canonical: siteUrl + "/jobs/" + job.slug } } : { title: "Job Not Found | USA Job Market" };
}

function descriptionBlocks(description: string) { return description.split(/\n\s*\n|\n/).map(value => value.trim()).filter(Boolean); }

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = getJobBySlug(slug);
  const live = preview ? undefined : (await fetchLiveJobs()).find(job => job.slug === slug);
  const job = preview ?? live;
  if (!job) notFound();

  const isLive = job.source !== "employer";
  const blocks = descriptionBlocks(job.description);
  const jsonLd = isLive ? { "@context": "https://schema.org", "@type": "JobPosting", title: job.title, description: job.description, datePosted: job.postedAt, hiringOrganization: { "@type": "Organization", name: job.company }, jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.city, addressRegion: job.state, addressCountry: "US" } }, employmentType: job.type.replace("-", "_").toUpperCase(), url: job.sourceUrl } : null;
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "USA Job Market", item: siteUrl }, { "@type": "ListItem", position: 2, name: "USA Jobs", item: siteUrl + "/jobs" }, { "@type": "ListItem", position: 3, name: job.title, item: siteUrl + "/jobs/" + job.slug } ] };

  return <main className="job-detail-page"><div className="container">
    <Link className="back-link" href="/jobs">← Back to USA jobs</Link>
    <article className="job-article">
      <header className="job-article-hero"><div className="result-logo large">{job.company.slice(0, 1)}</div><div className="job-article-title"><span className="eyebrow">{job.category}</span><h1>{job.title}</h1><p><strong>{job.company}</strong> · {job.location}</p><div className="job-article-tags"><span>{job.type}</span><span>{job.remote ? "Remote" : "On-site / Hybrid"}</span>{job.salary && <span>{job.salary}</span>}</div></div></header>
      <div className="job-article-grid">
        <section className="job-article-body">
          <div className="job-article-intro"><h2>About this job</h2><p>This page brings the available details for <strong>{job.title}</strong> at <strong>{job.company}</strong> together in one place, including the job description, location, work type and the original application link.</p></div>
          <h2>Job details</h2>
          <div className="detail-meta"><span>Location: {job.location}</span><span>Category: {job.category}</span><span>Work type: {job.type}</span><span>Remote: {job.remote ? "Yes" : "No"}</span>{job.salary && <span>Salary: {job.salary}</span>}</div>
          <h2>Full job description</h2>
          <div className="job-description">{blocks.length ? blocks.map((block, index) => block.startsWith("• ") ? <p className="job-bullet" key={index}>{block}</p> : <p key={index}>{block}</p>) : <p>The source did not provide a detailed description. Please open the official application page for the complete posting.</p>}</div>
          <section className="apply-panel"><div><span className="eyebrow">Ready to apply?</span><h2>{isLive ? "Apply from the original job source" : "Check the employer opening first"}</h2><p>{isLive ? "Use the button below to open the original employer listing and complete the application there." : "This is a preview listing. Open the employer source and confirm that this exact opening is currently available before applying."}</p></div><a className="btn register apply-button" href={job.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{isLive ? "Apply at " + job.company + " ↗" : "View " + job.company + " openings ↗"}</a></section>
          <p className="source-note">Source: <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{job.sourceName}</a> · USA Job Market does not submit applications on your behalf.</p>
        </section>
        <aside className="detail-side"><strong>Quick facts</strong><span>{job.company}</span><span>{job.location}</span><span>{job.category}</span><span>{job.type}{job.remote ? " · Remote" : ""}</span><strong>Original listing</strong><a href={job.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">Open job source ↗</a><strong>Published</strong><span>{new Date(job.postedAt).toLocaleDateString("en-US")}</span><strong>Last checked</strong><span>{new Date(job.fetchedAt).toLocaleDateString("en-US")}</span><Link className="side-jobs-link" href={"/jobs?category=" + encodeURIComponent(job.category)}>More {job.category} jobs →</Link></aside>
      </div>
    </article>
  </div>{jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /></main>;
}