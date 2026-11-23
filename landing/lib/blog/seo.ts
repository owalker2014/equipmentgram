// Addresses and the hidden tags that search engines and social networks read.

import type { Metadata } from "next";
import { BLOG_DESCRIPTION, BLOG_HEADING, DEFAULT_AUTHOR, SITE_NAME, SITE_URL } from "./config";
import { clip, isoDate } from "./text";
import type { BlogCategory, BlogLivePost } from "./types";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function postPath(slug: string): string {
  return `/blog/${slug}`;
}
export function feedPath(page = 1): string {
  return page > 1 ? `/blog/page/${page}` : "/blog";
}
export function categoryPath(slug: string, page = 1): string {
  return page > 1 ? `/blog/category/${slug}/page/${page}` : `/blog/category/${slug}`;
}

const HIDE_FROM_SEARCH = { index: false, follow: true };

// "Title" -> "Title | EquipmentGram", unless the name is already in it.
export function withSiteName(title: string): string {
  return title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`;
}

// Tags for a list page: /blog, a category, and their page 2, 3 ...
export function listMetadata(options: {
  title: string;
  description: string;
  path: string;
  page: number;
  noindex?: boolean;
}): Metadata {
  const title = withSiteName(options.page > 1 ? `${options.title} - Page ${options.page}` : options.title);
  const url = absoluteUrl(options.path);
  return {
    title,
    description: options.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": absoluteUrl("/blog/feed.xml") },
    },
    robots: options.noindex ? HIDE_FROM_SEARCH : undefined,
    openGraph: { type: "website", siteName: SITE_NAME, title, description: options.description, url },
    twitter: { card: "summary", title, description: options.description },
  };
}

export function blogMetadata(page: number): Metadata {
  return listMetadata({
    title: BLOG_HEADING,
    description: BLOG_DESCRIPTION,
    path: feedPath(page),
    page,
  });
}

export function categoryMetadata(category: BlogCategory, page: number): Metadata {
  return listMetadata({
    title: category.seoTitle || `${category.name} | ${BLOG_HEADING}`,
    description: category.seoDescription || category.description || `${category.name}: articles from the ${BLOG_HEADING}.`,
    path: categoryPath(category.slug, page),
    page,
    noindex: category.noindex,
  });
}

// Tags for one post.
export function postMetadata(post: BlogLivePost, category: BlogCategory | null): Metadata {
  const title = withSiteName(post.seoTitle || post.title);
  const description = clip(post.seoDescription || post.summary, 300);
  const url = absoluteUrl(postPath(post.slug));
  const images = post.coverUrl ? [{ url: post.coverUrl, alt: post.coverAlt || post.title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl || url },
    robots: post.noindex || (category && category.noindex) ? HIDE_FROM_SEARCH : undefined,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images,
      publishedTime: isoDate(post.publishedAt),
      modifiedTime: isoDate(post.updatedAt || post.publishedAt),
      section: category ? category.name : undefined,
    },
    twitter: {
      card: post.coverUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

type Crumb = { name: string; path: string };

// "Home > Blog > Category > Post" in the form Google reads.
export function breadcrumbJsonLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

// The facts about a post in the form Google reads: headline, dates, author, picture.
export function postJsonLd(post: BlogLivePost): Record<string, unknown> {
  const url = absoluteUrl(postPath(post.slug));
  const author =
    !post.authorName || post.authorName === DEFAULT_AUTHOR
      ? { "@type": "Organization", name: SITE_NAME, url: SITE_URL }
      : { "@type": "Person", name: post.authorName };
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: clip(post.title, 110),
    description: post.seoDescription || post.summary || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: isoDate(post.publishedAt),
    dateModified: isoDate(post.updatedAt || post.publishedAt),
    author,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  if (post.coverUrl) data.image = [post.coverUrl];
  return data;
}

// Text for a <script type="application/ld+json"> tag. Every "<" is replaced by
// its JSON code (a backslash followed by u003c), so nothing in a title can
// close the tag early.
const SAFE_LESS_THAN = String.fromCharCode(92) + "u003c";
export function jsonLdText(data: unknown): string {
  return JSON.stringify(data).split("<").join(SAFE_LESS_THAN);
}
