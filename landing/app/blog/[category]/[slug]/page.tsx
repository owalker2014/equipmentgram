import Post from "@/components/sections/blog/post";
import { BLOG_REVALIDATE_SECONDS, getAllPosts, getPost } from "@/lib/blog/server";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = BLOG_REVALIDATE_SECONDS;

type PostParams = { params: { category: string; slug: string } };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ category: post.categorySlug, slug: post.slug }));
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const post = await getPost(params.category, params.slug);

  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };

  const canonical = `/blog/${post.categorySlug}/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      // Older links used the Firestore document ID. Pointing every version of
      // this article at one canonical URL stops Google seeing duplicates.
      canonical,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonical,
      siteName: SITE_NAME,
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.imageUrl ? [{ url: post.imageUrl, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostParams) {
  const post = await getPost(params.category, params.slug);

  if (!post) notFound();

  const canonical = absoluteUrl(`/blog/${post.categorySlug}/${post.slug}`);

  /**
   * Structured data. This is the machine-readable summary Google uses to show
   * rich results (headline, author, date) instead of a plain blue link.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl ? [post.imageUrl] : undefined,
        datePublished: post.createdAt || undefined,
        dateModified: post.updatedAt || post.createdAt || undefined,
        author: { "@type": post.author ? "Person" : "Organization", name: post.author || SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg") },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        url: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: absoluteUrl("/blog") },
          {
            "@type": "ListItem",
            position: 2,
            name: post.categoryName,
            item: absoluteUrl(`/blog/${post.categorySlug}`),
          },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };

  const related = (await getAllPosts())
    .filter((entry) => entry.categorySlug === post.categorySlug && entry.id !== post.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Post post={post} />

      {related.length > 0 && (
        <aside className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900">More in {post.categoryName}</h2>
          <ul className="mt-4 space-y-3">
            {related.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/blog/${entry.categorySlug}/${entry.slug}`}
                  className="text-blue-700 hover:underline"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
