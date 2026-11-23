// Settings for the blog. This is the one file to open when you want to change
// the blog's name, its description or how many posts a page shows.

// The address of the live site, without a slash at the end. It is used for
// links in the sitemap, the RSS feed and the tags that Google reads.
// If Vercel shows the address without "www" as your main domain, change it here.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.equipmentgram.com").replace(/\/+$/, "");

export const SITE_NAME = "EquipmentGram";

// Shown as the big heading and the grey line under it on /blog.
export const BLOG_HEADING = "EquipmentGram Blog";
export const BLOG_DESCRIPTION =
  "Practical guides to inspecting, buying and selling excavators and other heavy equipment.";

// Used when a post has no author name of its own.
export const DEFAULT_AUTHOR = "EquipmentGram Team";

// Dates are shown in this time zone.
export const SITE_TIME_ZONE = "America/New_York";

// How many posts one page of the blog shows.
// After changing either number, open Blog studio > Status check and press "Rebuild listings".
export const POSTS_PER_PAGE = 10;
// How many links one page of a directory-style category shows.
export const DIRECTORY_PER_PAGE = 60;

// The most pages the sitemap will list. Google allows 50,000 addresses per sitemap file.
export const SITEMAP_MAX_POSTS = 20000;

// The button at the bottom of every post.
export const CTA_HEADING = "Buying or selling an excavator?";
export const CTA_TEXT =
  "Create a clear, shareable inspection report from your phone before any money changes hands.";
export const CTA_BUTTON_LABEL = "Produce a Report";
export const CTA_BUTTON_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/how-it-works";
export const CTA_SECOND_LABEL = "How it works";
export const CTA_SECOND_URL = "/how-it-works";

// Names of the places in the database (Firestore collections) the blog uses.
export const POSTS = "blog_posts"; // your working copies, drafts included. Admins only.
export const LIVE = "blog_live"; // the published copy of each post. Anyone can read.
export const CARDS = "blog_cards"; // a small summary of each published post, for lists. Anyone can read.
export const CATEGORIES = "blog_categories"; // Anyone can read.
export const META = "blog_meta"; // page boundaries and counts for the lists. Anyone can read.
export const TEMPLATES = "blog_templates"; // saved bulk-page templates. Admins only.

// Words that cannot be used as a post address because the blog uses them itself.
export const RESERVED_SLUGS = ["page", "category", "feed.xml", "feed", "new", "edit"];
