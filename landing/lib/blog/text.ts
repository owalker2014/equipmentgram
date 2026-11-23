// Small text helpers. Safe to use on the server and in the browser.
// Nothing in this file talks to the database.

import { RESERVED_SLUGS, SITE_TIME_ZONE } from "./config";

// The accent marks left over when a letter such as an accented "e" is split
// into the plain letter and its accent. slugify() removes them.
const ACCENT_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, "g");
// The single character that looks like three dots.
const ELLIPSIS = String.fromCharCode(0x2026);

// "Used Excavator Checklist!" -> "used-excavator-checklist"
export function slugify(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(ACCENT_MARKS, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

// Why an address cannot be used, or "" when it is fine.
export function slugProblem(slug: string): string {
  if (!slug) return "Give the post an address.";
  if (slug !== slugify(slug)) return "Use only small letters, numbers and dashes.";
  if (RESERVED_SLUGS.includes(slug)) return `"${slug}" is used by the blog itself. Pick another address.`;
  return "";
}

export function escapeHtml(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Plain text from HTML. For summaries and word counts only, never for safety.
export function stripHtml(html: string): string {
  return String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html: string): number {
  return stripHtml(html).split(" ").filter(Boolean).length;
}

// Cuts text at a word so it fits in "max" characters.
export function clip(text: string, max: number): string {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.5 ? lastSpace : cut.length).trim()}${ELLIPSIS}`;
}

// The first 160 characters or so of a post, cut at a word.
export function makeExcerpt(html: string, max = 160): string {
  return clip(stripHtml(html), max);
}

export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(wordCount(html) / 200));
}

// 1763478245000 -> "November 18, 2026"
export function formatDate(ms: number): string {
  if (!ms) return "";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: SITE_TIME_ZONE,
  }).format(date);
}

// 1763478245000 -> "2026-11-18T15:04:05.000Z", the form search engines expect.
export function isoDate(ms: number): string {
  if (!ms) return "";
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

// Web addresses arrive with spaces written as %20 and so on. This undoes that.
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// "3" -> 3. Anything that is not a whole number of 1 or more gives 0.
export function pageNumber(value: string): number {
  return /^[1-9][0-9]{0,5}$/.test(value) ? Number(value) : 0;
}
