import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://usajobmarket.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "USA Job Market — Find Jobs Across the United States",
    template: "%s | USA Job Market"
  },
  description:
    "Find USA jobs across all 50 states and major career categories. Search full-time, part-time, remote, contract, internship and government opportunities.",
  keywords: [
    "USA jobs",
    "US jobs",
    "jobs in USA",
    "United States jobs",
    "jobs by state",
    "remote jobs USA",
    "government jobs USA",
    "entry level jobs USA",
    "internships USA",
    "job search USA"
  ],
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    title: "USA Job Market — Find Jobs Across the United States",
    description: "Search USA jobs by category, state, company, work type and career level.",
    type: "website",
    url: siteUrl,
    siteName: "USA Job Market",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "USA Job Market",
    description: "Find jobs across the United States."
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "USA Job Market",
  url: siteUrl,
  description: "USA-only job discovery platform covering all 50 states and major career categories."
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "USA Job Market",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: siteUrl + "/jobs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
