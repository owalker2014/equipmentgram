import NoBlogFound from "@/components/NoBlogFound";
import { ArticleCard } from "@/components/sections/blog/article-card";
import { BLOG_REVALIDATE_SECONDS, getAllPosts, getCategories } from "@/lib/blog/server";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

// Re-check Firestore for new posts at most once a minute. Between checks the
// page is served from cache, which is why it loads instantly.
export const revalidate = BLOG_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Heavy Equipment Inspection Blog",
  description:
    "Buying guides, inspection checklists and maintenance advice for excavators, loaders, dozers and other heavy equipment — from the EquipmentGram inspection team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: `Heavy Equipment Inspection Blog | ${SITE_NAME}`,
    description:
      "Buying guides, inspection checklists and maintenance advice for excavators, loaders, dozers and other heavy equipment.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">Heavy Equipment Inspection Blog</h1>
        <p className="mt-4 text-lg text-gray-600">
          Buying guides, inspection checklists and maintenance advice from the EquipmentGram inspection team.
        </p>
      </header>

      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/${category.slug}`}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-700"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </nav>
      )}

      {posts.length === 0 ? (
        <div className="mt-12">
          <NoBlogFound />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
