// Sort keys.
//
// Every list on the blog (the main list, a category, a directory) is read with
// one simple question to the database: "give me the cards whose key lies between
// A and B, in order". Questions that simple need no extra database indexes, and
// they cost the same whether the blog has ten posts or ten thousand.
//
// A key is a piece of text built so that sorting it as text gives the order we want.

import type { BlogCard, BlogLivePost, BlogPost, ListingIndex } from "./types";
import { readingMinutes } from "./text";

const MAX_TIME = 9999999999999;
const ACCENT_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, "g");

// Newer dates give smaller text, so "smallest first" means "newest first".
export function invTime(ms: number): string {
  const safe = Math.max(0, Math.min(MAX_TIME, Math.floor(Number(ms) || 0)));
  return String(MAX_TIME - safe).padStart(13, "0");
}

// "Cat 320 GC" -> "cat 000320 gc". Numbers are padded so 320 sorts before 3200.
export function sortText(label: string): string {
  return String(label || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(ACCENT_MARKS, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/[0-9]+/g, (digits) => digits.padStart(6, "0"))
    .slice(0, 80);
}

export function allKey(publishedAt: number, slug: string): string {
  return `${invTime(publishedAt)}_${slug}`;
}
export function catKey(categorySlug: string, publishedAt: number, slug: string): string {
  return `${categorySlug}|${invTime(publishedAt)}_${slug}`;
}
export function dirKey(categorySlug: string, label: string, slug: string): string {
  return `${categorySlug}|${sortText(label)}_${slug}`;
}

// Every key of one category lies between these two. Slugs only contain small
// letters, numbers and dashes, and "|" and "}" both sort after all of those.
export function categoryRange(categorySlug: string): { start: string; end: string } {
  return { start: `${categorySlug}|`, end: `${categorySlug}}` };
}
// The whole main list. Keys there start with a digit, and ":" sorts just after "9".
export const FEED_RANGE = { start: "0", end: ":" };

export const FEED_INDEX_ID = "feed";
export function categoryIndexId(categorySlug: string): string {
  return `cat_${categorySlug}`;
}

// The keys of a whole list, in order -> where each page after the first begins.
export function buildIndex(keysInOrder: string[], pageSize: number): ListingIndex {
  const starts: string[] = [];
  for (let i = pageSize; i < keysInOrder.length; i += pageSize) starts.push(keysInOrder[i]);
  return { starts, count: keysInOrder.length, pageSize, updatedAt: Date.now() };
}

export function pageCount(index: ListingIndex | null): number {
  return index ? index.starts.length + 1 : 1;
}

// The slice of keys that page "page" (1, 2, 3 ...) covers, or null when there is no such page.
export function pageRange(
  index: ListingIndex | null,
  page: number,
  whole: { start: string; end: string }
): { start: string; end: string } | null {
  const starts = index ? index.starts : [];
  if (page < 1 || page > starts.length + 1) return null;
  return {
    start: page === 1 ? whole.start : starts[page - 2],
    end: page <= starts.length ? starts[page - 1] : whole.end,
  };
}

// The published copy of a post, built from the writer's working copy.
export function toLive(post: BlogPost, publishedAt: number, now: number): BlogLivePost {
  const label = post.listLabel || post.title;
  return {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    contentHtml: post.contentHtml,
    coverUrl: post.coverUrl,
    coverAlt: post.coverAlt,
    categorySlug: post.categorySlug,
    authorName: post.authorName,
    listLabel: post.listLabel,
    facts: post.facts,
    faq: post.faq,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    noindex: post.noindex,
    inFeed: post.inFeed,
    publishedAt,
    updatedAt: now,
    readingMinutes: readingMinutes(post.contentHtml),
    catSort: catKey(post.categorySlug, publishedAt, post.slug),
    dirSort: dirKey(post.categorySlug, label, post.slug),
  };
}

// The small copy used in lists.
export function toCard(live: BlogLivePost): BlogCard {
  const card: BlogCard = {
    slug: live.slug,
    title: live.title,
    summary: live.summary,
    coverUrl: live.coverUrl,
    coverAlt: live.coverAlt,
    categorySlug: live.categorySlug,
    authorName: live.authorName,
    listLabel: live.listLabel,
    noindex: live.noindex,
    publishedAt: live.publishedAt,
    updatedAt: live.updatedAt,
    readingMinutes: live.readingMinutes,
    allSort: allKey(live.publishedAt, live.slug),
    catSort: live.catSort,
    dirSort: live.dirSort,
  };
  if (live.inFeed) card.feedSort = allKey(live.publishedAt, live.slug);
  return card;
}
