/**
 * One place to change the public address of the site.
 *
 * Set NEXT_PUBLIC_SITE_URL in your hosting environment (Vercel → Settings →
 * Environment Variables) if the domain ever changes. Everything else —
 * canonical tags, sitemap.xml, robots.txt, social preview images — reads it
 * from here.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.equipmentgram.com").replace(/\/$/, "");

export const SITE_NAME = "EquipmentGram";

export const SITE_DESCRIPTION =
  "EquipmentGram is a platform for conducting pre-purchase heavy equipment inspections and defect verification.";

/** Turns a path like `/blog/excavators` into a full, absolute URL. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
