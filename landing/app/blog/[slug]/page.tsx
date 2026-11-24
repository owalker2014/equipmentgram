import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostLayout from "@/components/blog/PostLayout";
import { prepareContent } from "@/lib/blog/html";
import { getCategory, getLivePost, getNeighbours } from "@/lib/blog/public-data";
import { breadcrumbJsonLd, categoryPath, jsonLdText, postJsonLd, postMetadata, postPath } from "@/lib/blog/seo";
import { safeDecode } from "@/lib/blog/text";
import type { BlogCard } from "@/lib/blog/types";

// /blog/some-post : one post.
// A finished page is reused for 60 seconds, then rebuilt in the background.
export const revalidate = 60;

// No posts are built ahead of time. Each one is built the first time someone
// asks for it, so ten posts and ten thousand posts deploy equally fast.
export function generateStaticParams() {
  return [];
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getLivePost(safeDecode(params.slug));
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  const category = post.categorySlug ? await getCategory(post.categorySlug) : null;
  return postMetadata(post, category);
}

export default async function Page({ params }: Props) {
  const post = await getLivePost(safeDecode(params.slug));
  if (!post) notFound();

  const category = post.categorySlug ? await getCategory(post.categorySlug) : null;
  const { before, after } = await getNeighbours(post, category);
  const directory = !!category && category.layout === "directory";

  // In a normal category "before" holds newer posts and "after" older ones.
  // In a directory they are the neighbours in A to Z order.
  const prev = (directory ? before[0] : after[0]) || null;
  const next = (directory ? after[0] : before[0]) || null;
  const related: BlogCard[] = [after[0], before[0], after[1], before[1], after[2], before[2]]
    .filter((card): card is BlogCard => !!card)
    .slice(0, 3);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(category ? [{ name: category.name, path: categoryPath(category.slug) }] : []),
    { name: post.listLabel || post.title, path: postPath(post.slug) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(postJsonLd(post)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(breadcrumbJsonLd(crumbs)) }} />
      <PostLayout
        post={post}
        category={category}
        content={prepareContent(post.contentHtml)}
        crumbs={crumbs}
        prev={prev}
        next={next}
        related={related}
      />
    </>
  );
}
