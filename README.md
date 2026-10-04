# USA Job Market

USA Job Market is a USA-only job discovery platform.

## Product scope

- Jobs across all major US employment categories
- Search by title, company, keyword and location
- State and city discovery
- Full-time, part-time, contract, internship and remote jobs
- Salary and experience filters
- Official-source application links
- SEO-friendly job and category pages
- Responsive mobile, tablet and desktop UI
- Scalable ingestion layer for official company career pages and approved/public job APIs

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Data policy

The production job feed should prioritize official employer career pages, public/approved APIs and authoritative US sources. Each listing should retain its source URL and timestamp. Jobs should be deduplicated and expired listings removed.

## Roadmap

1. Product foundation and responsive UI
2. Job ingestion and normalization
3. Search, filters and state/category landing pages
4. Job detail pages and official apply links
5. Accounts, saved jobs and alerts
6. Employer job posting
7. SEO content and career tools
8. Analytics, monetization and production hardening


## Job data architecture

- /jobs uses live employer data when configured and falls back to clearly marked preview listings.
- Public Greenhouse Job Board GET endpoints are used for configured employers; authentication is not required for those public GET endpoints.
- An optional USAJOBS adapter supports federal listings when USAJOBS_API_KEY and USAJOBS_USER_AGENT are configured.
- Every normalized listing keeps its source URL, source job ID and fetch timestamp so candidates can verify and apply at the original source.
- The platform is USA-only: non-US locations are filtered before display.


### Live-source expansion
- Greenhouse public Job Board feeds are configured for verified public boards.
- Lever public postings can be enabled with `LEVER_SITES=site:Company Name,site2:Company Two`.
- Listings are normalized to one schema, filtered to USA locations, deduplicated by source ID and company/title/location, and marked active only when seen in the current source response.
- Because live listings are read from the current source response, removed/closed postings naturally disappear instead of remaining as stale active jobs.
- Preview listings remain clearly labeled and are only used when live sources return no matching data.

