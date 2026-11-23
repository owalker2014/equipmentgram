// The shapes of the records the blog stores. Dates are plain numbers:
// milliseconds since 1 January 1970, the same thing Date.now() returns.

export type BlogFact = { label: string; value: string };
export type BlogFaq = { q: string; a: string };

export type BlogStatus = "draft" | "published";
export type CategoryLayout = "list" | "directory";

// What the writer fills in. Stored in blog_posts under the post's address (slug).
export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  contentHtml: string;
  coverUrl: string;
  coverAlt: string;
  categorySlug: string;
  authorName: string;
  // A short name for lists of links, for example "Cat 320" instead of the whole title.
  listLabel: string;
  facts: BlogFact[];
  faq: BlogFaq[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noindex: boolean;
  // Whether the post appears in the main list at /blog. Bulk pages usually do not.
  inFeed: boolean;
  status: BlogStatus;
  // True when the working copy was edited after the last time it was published.
  hasChanges: boolean;
  source: "manual" | "bulk";
  batchId: string;
  createdAt: number;
  updatedAt: number;
  publishedAt: number; // 0 until the post is first published
};

// The published copy that visitors see. Stored in blog_live.
export type BlogLivePost = {
  slug: string;
  title: string;
  summary: string;
  contentHtml: string;
  coverUrl: string;
  coverAlt: string;
  categorySlug: string;
  authorName: string;
  listLabel: string;
  facts: BlogFact[];
  faq: BlogFaq[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noindex: boolean;
  inFeed: boolean;
  publishedAt: number;
  updatedAt: number;
  readingMinutes: number;
  catSort: string;
  dirSort: string;
};

// The small copy used wherever posts are listed. Stored in blog_cards.
export type BlogCard = {
  slug: string;
  title: string;
  summary: string;
  coverUrl: string;
  coverAlt: string;
  categorySlug: string;
  authorName: string;
  listLabel: string;
  noindex: boolean;
  publishedAt: number;
  updatedAt: number;
  readingMinutes: number;
  // Sort keys. Each list of posts is one simple range over one of these.
  allSort: string; // newest first, every published post
  catSort: string; // newest first inside its category
  dirSort: string; // A to Z inside its category
  feedSort?: string; // newest first, only posts shown at /blog
};

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
  // "list" shows posts newest first with summaries. "directory" shows an A to Z list of links.
  layout: CategoryLayout;
  noindex: boolean;
  seoTitle: string;
  seoDescription: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// Where each page of a list starts, so page 7 can be read without reading pages 1 to 6.
export type ListingIndex = {
  starts: string[];
  count: number;
  pageSize: number;
  updatedAt: number;
};

// A saved recipe for bulk pages. Stored in blog_templates.
export type BulkTemplate = {
  id: string;
  name: string;
  categorySlug: string;
  slugPattern: string;
  titlePattern: string;
  labelPattern: string;
  summaryPattern: string;
  seoTitlePattern: string;
  seoDescriptionPattern: string;
  bodyHtml: string;
  factColumns: string[];
  updatedAt: number;
};

export type TocItem = { id: string; text: string; level: 2 | 3 };
