import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "USA Jobs FAQ — Job Search Help",
  description: "Answers about finding USA jobs, remote jobs, state job searches, job categories, live sources and applying to employers.",
  alternates: { canonical: "https://usajobmarket.netlify.app/faq" }
};

const faqs = [
  ["How can I find jobs in the USA?", "Use USA Job Market to search USA-only opportunities by job title, company, location, category and work type."],
  ["Can I search jobs by state?", "Yes. USA Job Market provides dedicated pages for all 50 US states so you can browse opportunities by state."],
  ["Are remote jobs included?", "Yes. Remote opportunities are included when the source identifies the role as USA-based or explicitly tied to the United States."],
  ["Which job categories are covered?", "The platform covers technology, healthcare, finance, engineering, education, construction, sales, marketing, hospitality, government, skilled trades and many other career fields."],
  ["Does USA Job Market apply for jobs?", "No. It helps you discover opportunities and links you to the employer or official source. You submit the application on the destination site."],
  ["How fresh are job listings?", "Configured employer feeds are checked regularly. Listings from live sources are marked as live, while preview listings are clearly labeled when live data is unavailable."]
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };

  return <main className="directory-page">
    <div className="container">
      <span className="eyebrow">USA Job Search Guide</span>
      <h1>USA Jobs — Frequently Asked Questions</h1>
      <p className="directory-intro">Clear answers about searching for jobs across the United States, including remote, state, category and employer opportunities.</p>
      <div className="state-job-list">
        {faqs.map(([question, answer]) => <article className="state-job-card" key={question}><h2>{question}</h2><p>{answer}</p></article>)}
      </div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
  </main>;
}
