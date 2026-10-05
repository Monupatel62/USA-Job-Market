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

export function normalizeJobContent(value: unknown) {
  return String(value ?? "")
    .replace(/<br\s*\/?>(?=.)/gi, "\n")
    .replace(/<\/(?:p|div|section|h[1-6]|li|ul|ol)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function inferRemote(location: string, title = "") {
  return /remote|work from home|wfh/i.test(location + " " + title);
}

export function isUsLocation(location: string) {
  const value = normalizeText(location);
  const hasUsMarker = /united states|\busa\b|\bu\.s\.a?\.?\b|\bunited states of america\b/i.test(value);
  const stateNames = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|district of columbia)\b/i.test(value);
  const stateCodes = /(^|[\s,\-])(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)(?=[\s,\-]|$)/i.test(value);
  const remoteUs = /remote.*(united states|\busa\b|\bu\.s\.a?\.?\b)|(?:united states|\busa\b|\bu\.s\.a?\.?\b).*remote/i.test(value);
  return hasUsMarker || stateNames || stateCodes || remoteUs;
}