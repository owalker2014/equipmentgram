import { ArticleCard } from "@/components/sections/blog/article-card";
import { BLOG_REVALIDATE_SECONDS, getCategories, getPostsByCategory } from "@/lib/blog/server";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = BLOG_REVALIDATE_SECONDS;

type CategoryParams = { params: { category: string } };

/** Pre-builds a page for each category so they are ready the moment Google asks. */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryParams): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find((entry) => entry.slug === params.category);

  if (!category) return { title: "Category not found", robots: { index: false, follow: true } };

  const title = `${category.name} Articles`;
  const description = `${category.count} article${category.count === 1 ? "" : "s"} about ${category.name.toLowerCase()} from the EquipmentGram heavy equipment inspection team.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/blog/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryParams) {
  const posts = await getPostsByCategory(params.category);

  // An unknown category returns a real 404 rather than an empty page, so
  // Google doesn't index endless blank URLs.
  if (posts.length === 0) notFound();

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/blog" className="hover:text-blue-700 hover:underline">
          Blog
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-gray-700">{posts[0].categoryName}</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900">{posts[0].categoryName}</h1>
      <p className="mt-3 text-gray-600">
        {posts.length} article{posts.length === 1 ? "" : "s"} in this category.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
