import { formatDate, readingTimeMinutes } from "@/lib/blog/slug";
import type { BlogPost } from "@/lib/blog/types";
import Link from "next/link";

const FALLBACK_IMAGE = "/inspector.jpg";

/**
 * One card in the article grid. Deliberately plain HTML (no Mantine) so it
 * renders on the server and ends up in the page source that Google reads.
 */
export function ArticleCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.categorySlug}/${post.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md">
      <Link href={href} className="block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl || FALLBACK_IMAGE}
          alt={post.title}
          loading="lazy"
          width={640}
          height={360}
          className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link
          href={`/blog/${post.categorySlug}`}
          className="w-fit rounded bg-blue-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 hover:bg-blue-100"
        >
          {post.categoryName}
        </Link>

        <h2 className="text-lg font-bold leading-snug text-gray-900">
          <Link href={href} className="hover:text-blue-700">
            {post.title}
          </Link>
        </h2>

        <p className="flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

        <p className="text-xs text-gray-500">
          {post.createdAt ? <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time> : null}
          {post.createdAt ? " · " : null}
          {readingTimeMinutes(post.content)} min read
        </p>
      </div>
    </article>
  );
}

export default ArticleCard;
