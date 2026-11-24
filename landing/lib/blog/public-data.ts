// Everything the public blog pages read from the database.
// This file runs on the server only. It never writes anything.

import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore/lite";
import { blogDb } from "./firebase";
import { CARDS, CATEGORIES, DIRECTORY_PER_PAGE, LIVE, META, POSTS_PER_PAGE, SITEMAP_MAX_POSTS } from "./config";
import { FEED_INDEX_ID, FEED_RANGE, categoryIndexId, categoryRange, pageCount, pageRange } from "./keys";
import { asCard, asCategory, asIndex, asLive, sortCategories } from "./shape";
import type { BlogCard, BlogCategory, BlogLivePost, ListingIndex } from "./types";

// True only while Vercel is building the site, before it goes live.
const BUILDING = process.env.NEXT_PHASE === "phase-production-build";

// If the database cannot be reached while the site is being built, the build
// carries on with an empty blog and the pages fill in a minute after launch.
// Once the site is live, a failed read is passed on instead, because Next.js
// then keeps showing the last good copy of the page rather than an empty one.
async function guarded<T>(what: string, fallback: T, read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (!BUILDING) throw error;
    console.warn(`[blog] could not read ${what} during the build; continuing with none.`, error);
    return fallback;
  }
}

// Next.js draws a page twice when it builds it (once for the page itself, once
// for the data behind in-site navigation). Remembering each answer for one
// second lets the second pass reuse the first one's reads, which halves the
// number of database reads the blog is billed for. On your own computer
// ("npm run dev") nothing is remembered, so you always see the latest data.
const REMEMBER_MS = process.env.NODE_ENV === "production" ? 1000 : 0;
type Remembered = { value: Promise<unknown>; arrivedAt: number };
const remembered = new Map<string, Remembered>();

function remember<T>(key: string, read: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = remembered.get(key);
  // arrivedAt is 0 while the answer is still on its way: share that request too.
  if (hit && (hit.arrivedAt === 0 || now - hit.arrivedAt < REMEMBER_MS)) return hit.value as Promise<T>;
  if (remembered.size > 500) {
    remembered.forEach((entry, k) => {
      if (entry.arrivedAt !== 0 && now - entry.arrivedAt >= REMEMBER_MS) remembered.delete(k);
    });
  }
  const entry: Remembered = { value: read(), arrivedAt: 0 };
  remembered.set(key, entry);
  entry.value.then(
    () => {
      entry.arrivedAt = Date.now();
    },
    // A failed read is not worth remembering.
    () => {
      if (remembered.get(key) === entry) remembered.delete(key);
    }
  );
  return entry.value as Promise<T>;
}

export type SiteLists = {
  categories: BlogCategory[];
  indexes: Record<string, ListingIndex>;
};

async function readSiteLists(): Promise<SiteLists> {
  const [categorySnap, metaSnap] = await Promise.all([
    getDocs(collection(blogDb, CATEGORIES)),
    getDocs(collection(blogDb, META)),
  ]);
  const indexes: Record<string, ListingIndex> = {};
  metaSnap.forEach((d) => {
    indexes[d.id] = asIndex(d.data());
  });
  return {
    categories: sortCategories(categorySnap.docs.map((d) => asCategory(d.id, d.data()))),
    indexes,
  };
}

// All categories plus the page boundaries of every list. Two small reads.
export function getSiteLists(): Promise<SiteLists> {
  const nothing: SiteLists = { categories: [], indexes: {} };
  return remember("lists", () => guarded("categories", nothing, readSiteLists));
}

export function getCategory(slug: string): Promise<BlogCategory | null> {
  return remember(`category ${slug}`, () =>
    guarded("a category", null, async () => {
      const snap = await getDoc(doc(blogDb, CATEGORIES, slug));
      return snap.exists() ? asCategory(snap.id, snap.data()) : null;
    })
  );
}

type SortField = "feedSort" | "catSort" | "dirSort" | "allSort";

// The cards whose key lies from "start" up to, but not including, "end".
function cardsBetween(field: SortField, start: string, end: string, max: number): Promise<BlogCard[]> {
  return remember(`cards ${field} ${start} ${end} ${max}`, async () => {
    const snap = await getDocs(
      query(collection(blogDb, CARDS), where(field, ">=", start), where(field, "<", end), orderBy(field), limit(max))
    );
    return snap.docs.map((d) => asCard(d.id, d.data()));
  });
}

export type ListingPage = {
  cards: BlogCard[];
  page: number;
  totalPages: number;
  total: number;
};

// One page of the main list at /blog. Null means "there is no such page".
export async function getFeedPage(page: number, lists: SiteLists): Promise<ListingPage | null> {
  const index = lists.indexes[FEED_INDEX_ID] || null;
  const range = pageRange(index, page, FEED_RANGE);
  if (!range) return null;
  const cards = await guarded("the post list", [] as BlogCard[], () =>
    cardsBetween("feedSort", range.start, range.end, POSTS_PER_PAGE * 5)
  );
  return { cards, page, totalPages: pageCount(index), total: index ? index.count : cards.length };
}

// One page of a category. Null means "there is no such page".
export async function getCategoryPage(category: BlogCategory, page: number, lists: SiteLists): Promise<ListingPage | null> {
  const index = lists.indexes[categoryIndexId(category.slug)] || null;
  const range = pageRange(index, page, categoryRange(category.slug));
  if (!range) return null;
  const directory = category.layout === "directory";
  const cards = await guarded("a category list", [] as BlogCard[], () =>
    cardsBetween(directory ? "dirSort" : "catSort", range.start, range.end, (directory ? DIRECTORY_PER_PAGE : POSTS_PER_PAGE) * 5)
  );
  return { cards, page, totalPages: pageCount(index), total: index ? index.count : cards.length };
}

// The published copy of one post, or null when no such post is published.
export function getLivePost(slug: string): Promise<BlogLivePost | null> {
  return remember(`post ${slug}`, () =>
    guarded("a post", null, async () => {
      const snap = await getDoc(doc(blogDb, LIVE, slug));
      return snap.exists() ? asLive(snap.id, snap.data()) : null;
    })
  );
}

export type Neighbours = { before: BlogCard[]; after: BlogCard[] };

// The posts just before and just after this one in its category. They become
// the Previous / Next links and the "Keep reading" cards.
export function getNeighbours(post: BlogLivePost, category: BlogCategory | null): Promise<Neighbours> {
  const none: Neighbours = { before: [], after: [] };
  const field: SortField = category && category.layout === "directory" ? "dirSort" : "catSort";
  const key = field === "dirSort" ? post.dirSort : post.catSort;
  if (!post.categorySlug || !key) return Promise.resolve(none);
  const range = categoryRange(post.categorySlug);
  return remember(`neighbours ${field} ${key}`, () =>
    guarded("neighbouring posts", none, async () => {
      const cards = collection(blogDb, CARDS);
      const [afterSnap, beforeSnap] = await Promise.all([
        getDocs(query(cards, where(field, ">", key), where(field, "<", range.end), orderBy(field), limit(3))),
        getDocs(query(cards, where(field, "<", key), where(field, ">=", range.start), orderBy(field, "desc"), limit(3))),
      ]);
      return {
        before: beforeSnap.docs.map((d) => asCard(d.id, d.data())),
        after: afterSnap.docs.map((d) => asCard(d.id, d.data())),
      };
    })
  );
}

// The newest posts of the main list, for the RSS feed.
export function getRecentCards(max: number): Promise<BlogCard[]> {
  return guarded("recent posts", [] as BlogCard[], () => cardsBetween("feedSort", FEED_RANGE.start, FEED_RANGE.end, max));
}

// Every published post, newest first, for the sitemap. Read 1,000 at a time.
export function getAllCards(max: number = SITEMAP_MAX_POSTS): Promise<BlogCard[]> {
  return guarded("all posts", [] as BlogCard[], async () => {
    const all: BlogCard[] = [];
    let last = "";
    while (all.length < max) {
      const size = Math.min(1000, max - all.length);
      const base = collection(blogDb, CARDS);
      const q = last
        ? query(base, orderBy("allSort"), startAfter(last), limit(size))
        : query(base, orderBy("allSort"), limit(size));
      const snap = await getDocs(q);
      snap.forEach((d) => all.push(asCard(d.id, d.data())));
      if (snap.size < size) break;
      last = all[all.length - 1].allSort;
    }
    return all;
  });
}
