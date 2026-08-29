import { formatDate, readingTimeMinutes } from "@/lib/blog/slug";
import type { BlogPost } from "@/lib/blog/types";
import Link from "next/link";

const FALLBACK_IMAGE = "/inspector.jpg";

/**
 * A single article. The heading order matters for SEO: exactly one <h1>
 * (the title), and the editor's own headings become h2/h3 inside .blog-content.
 */
export default function Post({ post }: { post: BlogPost }) {
  return (
    <article>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/blog" className="hover:text-blue-700 hover:underline">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/blog/${post.categorySlug}`} className="hover:text-blue-700 hover:underline">
              {post.categoryName}
            </Link>
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{post.title}</h1>

      <p className="mt-4 text-sm text-gray-500">
        {post.author ? `By ${post.author} · ` : ""}
        {post.createdAt ? (
          <>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            {" · "}
          </>
        ) : null}
        {readingTimeMinutes(post.content)} min read
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl || FALLBACK_IMAGE}
        alt={post.title}
        width={1200}
        height={630}
        className="mt-8 h-auto max-h-[28rem] w-full rounded-lg object-cover"
      />

      {/*
        The article body is HTML written by an EquipmentGram admin in the
        editor at /admin/tools. Only trusted staff can reach that page.
      */}
      <div className="blog-content mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
