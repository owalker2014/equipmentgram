import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog/config";

// Served at /robots.txt. It tells search engines which pages to skip and
// where the sitemap is.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/studio", "/api/", "/profile", "/account-settings", "/my-contacts", "/access-denied"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
