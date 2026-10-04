import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://usajobmarket.com"),
  title: {
    default: "USA Job Market — Find Jobs Across the United States",
    template: "%s | USA Job Market"
  },
  description: "Find jobs across the United States by category, state, city, work type, experience and salary.",
  keywords: ["USA jobs", "United States jobs", "US jobs", "American jobs", "remote jobs USA", "job search"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "USA Job Market",
    description: "Find jobs across the United States.",
    type: "website",
    siteName: "USA Job Market"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
