export type JobSourceConfig = {
  provider: "greenhouse" | "lever";
  token: string;
  company: string;
  country: "US";
};

export const sourceRegistry: JobSourceConfig[] = [
  { provider: "greenhouse", token: "anthropic", company: "Anthropic", country: "US" },
  { provider: "greenhouse", token: "coinbase", company: "Coinbase", country: "US" },
  { provider: "greenhouse", token: "figma", company: "Figma", country: "US" },
  { provider: "greenhouse", token: "cloudflare", company: "Cloudflare", country: "US" },
  { provider: "greenhouse", token: "guidepointsecurity", company: "GuidePoint Security", country: "US" },
  { provider: "greenhouse", token: "nourish", company: "Nourish", country: "US" },
  { provider: "greenhouse", token: "gather", company: "Gather", country: "US" },
  { provider: "greenhouse", token: "harmonic", company: "Harmonic", country: "US" },
  { provider: "greenhouse", token: "robinhood", company: "Robinhood", country: "US" },
  { provider: "greenhouse", token: "databricks", company: "Databricks", country: "US" },
  { provider: "greenhouse", token: "duolingo", company: "Duolingo", country: "US" },
  { provider: "greenhouse", token: "okta", company: "Okta", country: "US" },
  { provider: "greenhouse", token: "asana", company: "Asana", country: "US" },
  { provider: "lever", token: "peerspace", company: "Peerspace", country: "US" },
  { provider: "lever", token: "dnb", company: "Dun & Bradstreet", country: "US" },
  { provider: "lever", token: "weloglobal", company: "Welo Global", country: "US" },
  { provider: "lever", token: "elementsolutions", company: "Element Solutions", country: "US" },
  { provider: "lever", token: "palantir", company: "Palantir Technologies", country: "US" }
];

export function configuredLeverSources(): JobSourceConfig[] {
  const configured = sourceRegistry.filter(source => source.provider === "lever");
  const fromEnv = (process.env.LEVER_SITES ?? "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean)
    .map(value => {
      const [token, ...nameParts] = value.split(":");
      return {
        provider: "lever" as const,
        token: token.trim(),
        company: (nameParts.join(":").trim() || token.trim()),
        country: "US" as const
      };
    });
  const seen = new Set<string>();
  return [...configured, ...fromEnv].filter(source => {
    const key = source.token.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeText(value: unknown) {
  return String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function inferRemote(location: string, title = "") {
  return /remote|work from home|wfh/i.test(location + " " + title);
}

export function isUsLocation(location: string) {
  return /united states|usa|remote/i.test(location) ||
    /(^|,|\s)(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)(\s|,|$)/i.test(location);
}