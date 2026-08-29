import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * Builds https://www.equipmentgram.com/robots.txt automatically.
 * It tells search engines what to crawl and where to find the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private and signed-in areas: no SEO value, and we don't want them indexed.
      disallow: ["/admin", "/api", "/profile", "/account-settings", "/my-contacts", "/access-denied"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
