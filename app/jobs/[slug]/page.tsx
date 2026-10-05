import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs, getJobBySlug } from "../../../lib/job-data";
import { fetchLiveJobs } from "../../../lib/live-jobs";

const siteUrl = "https://usajobmarket.netlify.app";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = getJobBySlug(slug);
  const live = preview ? undefined : (await fetchLiveJobs()).find((job) => job.slug === slug);
  const job = preview ?? live;

  return job
    ? {
        title: job.title + " at " + job.company + " | USA Job Market",
        description: "Complete job details, requirements, location and official application link for " + job.title + " at " + job.company + ".",
        alternates: { canonical: siteUrl + "/jobs/" + job.slug },
        openGraph: {
          title: job.title + " at " + job.company,
          description: "Read the complete " + job.title + " job guide and apply through the official employer source.",
          url: siteUrl + "/jobs/" + job.slug,
          type: "article"
        }
      }
    : { title: "Job Not Found | USA Job Market" };
}

function splitDescription(description: string) {
  return description
    .split(/\n{2,}|(?<=[.!?])\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const preview = getJobBySlug(slug);
  const live = preview ? undefined : (await fetchLiveJobs()).find((job) => job.slug === slug);
  const job = preview ?? live;

  if (!job) notFound();

  const isLive = job.source !== "employer";
  const paragraphs = splitDescription(job.description);

  const jsonLd = isLive
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: job.postedAt,
        hiringOrganization: { "@type": "Organization", name: job.company },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressRegion: job.state,
            addressCountry: "US"
          }
        },
        employmentType: job.type.replace("-", "_").toUpperCase(),
        url: job.sourceUrl
      }
    : null;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "USA Job Market", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "USA Jobs", item: siteUrl + "/jobs" },
      { "@type": "ListItem", position: 3, name: job.title, item: siteUrl + "/jobs/" + job.slug }
    ]
  };

  return (
    <main className="job-detail-page">
      <div className="container">
        <Link className="back-link" href="/jobs">← Back to USA jobs</Link>

        <article className="job-article">
          <header className="article-hero">
            <div className="result-logo large">{job.company.slice(0, 1)}</div>
            <div className="article-title">
              <span className="eyebrow">{job.category}</span>
              <h1>{job.title}</h1>
              <p>{job.company} • {job.location}</p>
              <div className="article-badges">
                <span>{job.type}</span>
                <span>{job.remote ? "Remote" : "On-site / Hybrid"}</span>
                {job.salary && <span>{job.salary}</span>}
              </div>
            </div>
            <a className="btn register article-apply-top" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
              {isLive ? "Apply Now" : "View Official Opening"} ↗
            </a>
          </header>

          <div className="article-layout">
            <div className="article-content">
              <div className="article-intro">
                <strong>{job.title} at {job.company}</strong>
                <span>
                  Read the job details below, check the requirements and location, then use the official
                  application button to apply directly through the employer or government source.
                </span>
              </div>

              <section className="article-section">
                <h2>Job overview</h2>
                {paragraphs.length ? (
                  paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>Job details are available from the official source. Open the application link to review the current posting.</p>
                )}
              </section>

              <section className="article-section">
                <h2>Job details</h2>
                <div className="detail-meta article-meta">
                  <span><b>Company</b>{job.company}</span>
                  <span><b>Location</b>{job.location}</span>
                  <span><b>Category</b>{job.category}</span>
                  <span><b>Work type</b>{job.type}</span>
                  <span><b>Remote</b>{job.remote ? "Yes" : "No"}</span>
                  {job.salary && <span><b>Salary</b>{job.salary}</span>}
                </div>
              </section>

              <section className="article-section">
                <h2>How to apply</h2>
                <p>
                  USA Job Market does not submit applications on your behalf. Use the button below to open
                  the original {isLive ? "employer" : "reference"} job posting, review the latest information
                  and complete the application there.
                </p>
                <div className="article-apply-box">
                  <div>
                    <strong>Ready to apply?</strong>
                    <small>Official application source: {job.sourceName}</small>
                  </div>
                  <a className="btn register apply-button" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {isLive ? "Apply on " + job.sourceName : "View " + job.sourceName + " openings"} ↗
                  </a>
                </div>
              </section>

              <section className="article-section">
                <h2>Important before applying</h2>
                <ul className="article-list">
                  <li>Verify that the opening is still active on the original source.</li>
                  <li>Check the complete requirements, location, compensation and application instructions there.</li>
                  <li>Apply only through the official source linked on this page.</li>
                </ul>
              </section>
            </div>

            <aside className="article-sidebar">
              <div className="sticky-apply">
                <span className="eyebrow">Official application</span>
                <h2>{job.title}</h2>
                <p>{job.company}</p>
                <a className="btn register apply-button" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Apply Now ↗
                </a>
                <span className="source-note">Opens: {job.sourceName}</span>
              </div>

              <div className="article-facts">
                <strong>Job facts</strong>
                <span>Posted: {new Date(job.postedAt).toLocaleDateString("en-US")}</span>
                <span>Last checked: {new Date(job.fetchedAt).toLocaleDateString("en-US")}</span>
                <span>Source: {job.sourceName}</span>
                <span>USA-only listing</span>
              </div>
            </aside>
          </div>
        </article>
      </div>

      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </main>
  );
}
