// Prepares the body of a post for visitors. Runs on the server only.
//
// 1. Cleans the HTML: anything that could run code in a visitor's browser
//    (scripts, event handlers, javascript: links) is removed.
// 2. Gives every heading an id, so the "On this page" list can link to it.

import sanitizeHtml from "sanitize-html";
import { SITE_URL } from "./config";
import { slugify, stripHtml } from "./text";
import type { TocItem } from "./types";

const siteHost = new URL(SITE_URL).host.replace(/^www\./, "");

// An invisible character that editors sometimes leave behind in the text.
const INVISIBLE_MARK = String.fromCharCode(0xfeff);

function isExternal(href: string | undefined): boolean {
  if (!href || !/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).host.replace(/^www\./, "") !== siteHost;
  } catch {
    return false;
  }
}

export function cleanPostHtml(dirty: string): string {
  const input = String(dirty || "").split(INVISIBLE_MARK).join("");

  return sanitizeHtml(input, {
    allowedTags: [
      "h2", "h3", "h4",
      "p", "br", "hr", "blockquote", "pre", "code",
      "ul", "ol", "li",
      "strong", "b", "em", "i", "u", "s", "sub", "sup",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      ol: ["start"],
      div: ["class"],
      iframe: ["src", "width", "height", "title", "allow", "allowfullscreen", "loading"],
    },
    // The only class names a post may carry are the two this file adds itself.
    allowedClasses: { div: ["blog-video", "blog-table"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"], iframe: ["https"] },
    allowProtocolRelative: false,
    // Videos may only come from these sites.
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    // A picture or video whose address was refused is dropped entirely.
    exclusiveFilter: (frame) => (frame.tag === "img" || frame.tag === "iframe") && !frame.attribs.src,
    transformTags: {
      // The page already has one main heading: the post's title.
      h1: "h2",
      h5: "h4",
      h6: "h4",
      strike: "s",
      a: (tagName, attribs) => {
        const kept: Record<string, string> = {};
        if (attribs.href) kept.href = attribs.href;
        if (isExternal(attribs.href)) {
          kept.target = "_blank";
          kept.rel = "noopener noreferrer";
        }
        return { tagName, attribs: kept };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
      // The editor wraps a video in <div data-youtube-video>. Give it the class that keeps it 16:9.
      div: (tagName, attribs) => {
        const kept: Record<string, string> = {};
        if ("data-youtube-video" in attribs) kept.class = "blog-video";
        return { tagName, attribs: kept };
      },
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: {
          src: attribs.src || "",
          title: attribs.title || "Embedded video",
          loading: "lazy",
          allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "",
        },
      }),
    },
  });
}

export type PreparedContent = { html: string; toc: TocItem[] };

export function prepareContent(dirty: string): PreparedContent {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const html = cleanPostHtml(dirty)
    // Headings get an id and are listed for "On this page".
    .replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (whole: string, tag: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return whole;
      const base = slugify(text).slice(0, 60) || "section";
      let id = base;
      let counter = 2;
      while (used.has(id)) {
        id = `${base}-${counter}`;
        counter += 1;
      }
      used.add(id);
      toc.push({ id, text, level: tag === "h2" ? 2 : 3 });
      return `<${tag} id="${id}">${inner}</${tag}>`;
    })
    // A wide table scrolls sideways on a phone instead of breaking the page.
    .replace(/<table>/g, '<div class="blog-table"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return { html, toc };
}
