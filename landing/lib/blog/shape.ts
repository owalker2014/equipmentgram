// Turns raw database records into the shapes in types.ts, filling in anything
// that is missing. A record edited by hand in the Firebase console can then
// never crash a page.

import { DEFAULT_AUTHOR } from "./config";
import type {
  BlogCard,
  BlogCategory,
  BlogFact,
  BlogFaq,
  BlogLivePost,
  BlogPost,
  BulkTemplate,
  ListingIndex,
} from "./types";

type Raw = Record<string, any> | undefined;

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);

function facts(v: unknown): BlogFact[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((row) => ({ label: str(row?.label).trim(), value: str(row?.value).trim() }))
    .filter((row) => row.label && row.value);
}

function faq(v: unknown): BlogFaq[] {
  if (!Array.isArray(v)) return [];
  return v.map((row) => ({ q: str(row?.q).trim(), a: str(row?.a).trim() })).filter((row) => row.q && row.a);
}

export function asPost(slug: string, data: Raw): BlogPost {
  const raw = data || {};
  return {
    slug,
    title: str(raw.title),
    summary: str(raw.summary),
    contentHtml: str(raw.contentHtml),
    coverUrl: str(raw.coverUrl),
    coverAlt: str(raw.coverAlt),
    categorySlug: str(raw.categorySlug),
    authorName: str(raw.authorName, DEFAULT_AUTHOR),
    listLabel: str(raw.listLabel),
    facts: facts(raw.facts),
    faq: faq(raw.faq),
    seoTitle: str(raw.seoTitle),
    seoDescription: str(raw.seoDescription),
    canonicalUrl: str(raw.canonicalUrl),
    noindex: bool(raw.noindex),
    inFeed: bool(raw.inFeed, true),
    status: raw.status === "published" ? "published" : "draft",
    hasChanges: bool(raw.hasChanges),
    source: raw.source === "bulk" ? "bulk" : "manual",
    batchId: str(raw.batchId),
    createdAt: num(raw.createdAt),
    updatedAt: num(raw.updatedAt),
    publishedAt: num(raw.publishedAt),
  };
}

export function asLive(slug: string, data: Raw): BlogLivePost {
  const raw = data || {};
  return {
    slug,
    title: str(raw.title, "Untitled"),
    summary: str(raw.summary),
    contentHtml: str(raw.contentHtml),
    coverUrl: str(raw.coverUrl),
    coverAlt: str(raw.coverAlt),
    categorySlug: str(raw.categorySlug),
    authorName: str(raw.authorName, DEFAULT_AUTHOR) || DEFAULT_AUTHOR,
    listLabel: str(raw.listLabel),
    facts: facts(raw.facts),
    faq: faq(raw.faq),
    seoTitle: str(raw.seoTitle),
    seoDescription: str(raw.seoDescription),
    canonicalUrl: str(raw.canonicalUrl),
    noindex: bool(raw.noindex),
    inFeed: bool(raw.inFeed, true),
    publishedAt: num(raw.publishedAt),
    updatedAt: num(raw.updatedAt),
    readingMinutes: Math.max(1, num(raw.readingMinutes, 1)),
    catSort: str(raw.catSort),
    dirSort: str(raw.dirSort),
  };
}

export function asCard(slug: string, data: Raw): BlogCard {
  const raw = data || {};
  const card: BlogCard = {
    slug,
    title: str(raw.title, "Untitled"),
    summary: str(raw.summary),
    coverUrl: str(raw.coverUrl),
    coverAlt: str(raw.coverAlt),
    categorySlug: str(raw.categorySlug),
    authorName: str(raw.authorName, DEFAULT_AUTHOR) || DEFAULT_AUTHOR,
    listLabel: str(raw.listLabel),
    noindex: bool(raw.noindex),
    publishedAt: num(raw.publishedAt),
    updatedAt: num(raw.updatedAt),
    readingMinutes: Math.max(1, num(raw.readingMinutes, 1)),
    allSort: str(raw.allSort),
    catSort: str(raw.catSort),
    dirSort: str(raw.dirSort),
  };
  if (typeof raw.feedSort === "string") card.feedSort = raw.feedSort;
  return card;
}

export function asCategory(slug: string, data: Raw): BlogCategory {
  const raw = data || {};
  return {
    slug,
    name: str(raw.name, slug) || slug,
    description: str(raw.description),
    layout: raw.layout === "directory" ? "directory" : "list",
    noindex: bool(raw.noindex),
    seoTitle: str(raw.seoTitle),
    seoDescription: str(raw.seoDescription),
    order: num(raw.order),
    createdAt: num(raw.createdAt),
    updatedAt: num(raw.updatedAt),
  };
}

export function asIndex(data: Raw): ListingIndex {
  const raw = data || {};
  return {
    starts: Array.isArray(raw.starts) ? raw.starts.filter((s: unknown) => typeof s === "string") : [],
    count: num(raw.count),
    pageSize: num(raw.pageSize),
    updatedAt: num(raw.updatedAt),
  };
}

export function asTemplate(id: string, data: Raw): BulkTemplate {
  const raw = data || {};
  return {
    id,
    name: str(raw.name, "Untitled template"),
    categorySlug: str(raw.categorySlug),
    slugPattern: str(raw.slugPattern),
    titlePattern: str(raw.titlePattern),
    labelPattern: str(raw.labelPattern),
    summaryPattern: str(raw.summaryPattern),
    seoTitlePattern: str(raw.seoTitlePattern),
    seoDescriptionPattern: str(raw.seoDescriptionPattern),
    bodyHtml: str(raw.bodyHtml),
    factColumns: Array.isArray(raw.factColumns) ? raw.factColumns.filter((s: unknown) => typeof s === "string") : [],
    updatedAt: num(raw.updatedAt),
  };
}

export function sortCategories(list: BlogCategory[]): BlogCategory[] {
  return list.slice().sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}
