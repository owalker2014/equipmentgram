import { getAllPosts, getCategories } from "@/lib/blog/server";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

/**
 * Builds https://www.equipmentgram.com/sitemap.xml automatically.
 * Next.js turns this file into the XML — you never edit the XML by hand, and
 * every new blog post is added to it the next time the sitemap is rebuilt.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const marketingPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about-us"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/how-it-works"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact-us"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact-sales"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/inspection-request"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.9 },
  ];

  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/blog/${category.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.categorySlug}/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...marketingPages, ...categoryPages, ...postPages];
}
