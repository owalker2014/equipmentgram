import { SITE_URL } from "@/lib/blog/config";
import { categoryIndexId } from "@/lib/blog/keys";
import { getAllCards, getSiteLists } from "@/lib/blog/public-data";
import { categoryPath, postPath } from "@/lib/blog/seo";
import { escapeHtml, isoDate } from "@/lib/blog/text";

// /sitemap.xml : the list of pages search engines should know about.
// It includes every published post that is not hidden from search.
// Rebuilt at most once an hour.
export const revalidate = 3600;

// The site's own pages. Add a line here when you add a public page to the site.
const SITE_PAGES = ["/", "/about-us", "/how-it-works", "/pricing", "/faq", "/contact-us", "/contact-sales"];

type Entry = { path: string; lastModified?: number };

export async function GET() {
  const [lists, cards] = await Promise.all([getSiteLists(), getAllCards()]);
  const hiddenCategories = new Set(lists.categories.filter((c) => c.noindex).map((c) => c.slug));
  const posts = cards.filter((card) => !card.noindex && !hiddenCategories.has(card.categorySlug));
  const newest = posts.reduce((latest, card) => Math.max(latest, card.updatedAt || card.publishedAt), 0);

  const entries: Entry[] = SITE_PAGES.map((path) => ({ path }));
  entries.push({ path: "/blog", lastModified: newest || undefined });
  for (const category of lists.categories) {
    const index = lists.indexes[categoryIndexId(category.slug)];
    if (category.noindex || !index || !index.count) continue;
    entries.push({ path: categoryPath(category.slug) });
  }
  for (const card of posts) {
    entries.push({ path: postPath(card.slug), lastModified: card.updatedAt || card.publishedAt });
  }

  const body = entries
    .map((entry) => {
      const loc = escapeHtml(`${SITE_URL}${entry.path === "/" ? "" : entry.path}`);
      const lastmod = entry.lastModified ? `<lastmod>${isoDate(entry.lastModified)}</lastmod>` : "";
      return `  <url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
