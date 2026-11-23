import { BLOG_DESCRIPTION, BLOG_HEADING, SITE_URL } from "@/lib/blog/config";
import { getRecentCards } from "@/lib/blog/public-data";
import { absoluteUrl, postPath } from "@/lib/blog/seo";
import { escapeHtml } from "@/lib/blog/text";

// /blog/feed.xml : the newest posts in RSS form, for feed readers and newsletter tools.
// Rebuilt at most once an hour.
export const revalidate = 3600;

export async function GET() {
  const cards = await getRecentCards(30);
  const items = cards
    .map((card) => {
      const url = absoluteUrl(postPath(card.slug));
      return [
        "    <item>",
        `      <title>${escapeHtml(card.title)}</title>`,
        `      <link>${escapeHtml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeHtml(url)}</guid>`,
        `      <pubDate>${new Date(card.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeHtml(card.summary)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeHtml(BLOG_HEADING)}</title>`,
    `    <link>${SITE_URL}/blog</link>`,
    `    <description>${escapeHtml(BLOG_DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    `    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
