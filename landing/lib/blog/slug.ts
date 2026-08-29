/**
 * Turns any piece of text into something safe to put in a URL.
 * "How To Inspect An Excavator!" -> "how-to-inspect-an-excavator"
 */
export function slugify(input: string): string {
  return (input || "")
    .toString()
    .normalize("NFKD")
    // Drop accents so "Backhoe Café" becomes "backhoe-cafe".
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Removes HTML tags so editor output can be used as plain text. */
export function stripHtml(html: string): string {
  return (html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds the search-result snippet. Google truncates around 160 characters,
 * so we cut on a word boundary just before that.
 */
export function buildExcerpt(html: string, limit = 155): string {
  const text = stripHtml(html);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}…`;
}

/** Rough "5 min read" estimate at 200 words per minute. */
export function readingTimeMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "2026-08-29T..." -> "August 29, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
