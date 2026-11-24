/* eslint-disable @next/next/no-img-element */
// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
// The template's picture card, used for "Keep reading" under a post.
import Link from "next/link";
import { postPath } from "@/lib/blog/seo";
import type { BlogCard } from "@/lib/blog/types";

export default function PostCard({ card }: { card: BlogCard }) {
  const href = postPath(card.slug);
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {card.coverUrl && (
        <Link href={href} aria-hidden="true" tabIndex={-1}>
          <img
            src={card.coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full object-cover object-center"
          />
        </Link>
      )}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold leading-6 tracking-tight">
          <Link href={href} className="text-gray-900 hover:text-blue-700">
            {card.title}
          </Link>
        </h3>
        {card.summary && <p className="mb-3 line-clamp-3 text-sm text-gray-500">{card.summary}</p>}
        <Link href={href} className="text-sm font-medium leading-6 text-blue-700 hover:text-blue-900" aria-label={`Read "${card.title}"`}>
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
}
