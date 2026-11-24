/* eslint-disable @next/next/no-img-element */
// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
// The template's "list with tags" page: a side panel with the categories and a
// list of posts. Used by /blog and by every category page.
import Link from "next/link";
import type { ReactNode } from "react";
import { categoryIndexId, FEED_INDEX_ID } from "@/lib/blog/keys";
import { categoryPath, postPath } from "@/lib/blog/seo";
import { formatDate, isoDate } from "@/lib/blog/text";
import type { BlogCard, BlogCategory, ListingIndex } from "@/lib/blog/types";
import CategoryLabel from "./CategoryLabel";

type Props = {
  heading: string;
  description: string;
  categories: BlogCategory[];
  indexes: Record<string, ListingIndex>;
  // The category being shown, or "" on the main list.
  currentCategory: string;
  children: ReactNode;
};

function count(indexes: Record<string, ListingIndex>, id: string): number {
  return indexes[id] ? indexes[id].count : 0;
}

export default function ListLayout({ heading, description, categories, indexes, currentCategory, children }: Props) {
  const shown = categories.filter((c) => count(indexes, categoryIndexId(c.slug)) > 0 || c.slug === currentCategory);
  const feedCount = count(indexes, FEED_INDEX_ID);

  return (
    <div>
      <header className="pb-8 pt-8 text-center sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-blue-700 sm:text-4xl">{heading}</h1>
        {description && <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500">{description}</p>}
      </header>

      {/* On a phone the categories are a row of buttons that scrolls sideways. */}
      {shown.length > 0 && (
        <nav aria-label="Categories" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:hidden">
          <Link
            href="/blog"
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
              currentCategory ? "bg-blue-50 text-blue-700" : "bg-blue-700 text-white"
            }`}
          >
            All posts
          </Link>
          {shown.map((c) => (
            <Link
              key={c.slug}
              href={categoryPath(c.slug)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
                c.slug === currentCategory ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex sm:space-x-10 lg:space-x-16">
        {/* On wider screens they are the template's side panel. */}
        <aside className="hidden h-full max-h-screen min-w-[240px] max-w-[240px] flex-wrap overflow-auto rounded-2xl bg-blue-50/60 pt-2 shadow-md sm:flex lg:min-w-[280px] lg:max-w-[280px]">
          <div className="px-6 py-4">
            {currentCategory ? (
              <Link href="/blog" className="font-bold uppercase text-gray-700 hover:text-blue-700">
                All posts{feedCount ? ` (${feedCount})` : ""}
              </Link>
            ) : (
              <h2 className="font-bold uppercase text-blue-700">All posts{feedCount ? ` (${feedCount})` : ""}</h2>
            )}
            <ul>
              {shown.map((c) => {
                const label = `${c.name} (${count(indexes, categoryIndexId(c.slug))})`;
                return (
                  <li key={c.slug} className="my-3">
                    {c.slug === currentCategory ? (
                      <span className="inline py-2 text-sm font-bold uppercase text-blue-700">{label}</span>
                    ) : (
                      <Link
                        href={categoryPath(c.slug)}
                        className="py-2 text-sm font-medium uppercase text-gray-500 hover:text-blue-700"
                        aria-label={`View posts in ${c.name}`}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

// The list of posts itself: date, title, category, summary and a small picture.
export function PostList({ cards, categories }: { cards: BlogCard[]; categories: BlogCategory[] }) {
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  if (!cards.length) {
    return <p className="py-10 text-gray-500">No posts here yet. Please check back soon.</p>;
  }
  return (
    <ul className="divide-y divide-gray-200">
      {cards.map((card, i) => (
        <li key={card.slug} className="py-6 first:pt-0">
          <article className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1 space-y-2">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-sm font-medium leading-6 text-gray-500">
                  <time dateTime={isoDate(card.publishedAt)}>{formatDate(card.publishedAt)}</time>
                  <span aria-hidden="true"> &middot; </span>
                  {card.readingMinutes} min read
                </dd>
              </dl>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <Link href={postPath(card.slug)} className="text-gray-900 hover:text-blue-700">
                    {card.title}
                  </Link>
                </h2>
                {names.has(card.categorySlug) && (
                  <div className="flex flex-wrap">
                    <CategoryLabel slug={card.categorySlug} name={names.get(card.categorySlug) as string} />
                  </div>
                )}
                {card.summary && <p className="max-w-none text-gray-500">{card.summary}</p>}
              </div>
              <div className="pt-1 text-base font-medium leading-6">
                <Link
                  href={postPath(card.slug)}
                  className="text-blue-700 hover:text-blue-900"
                  aria-label={`Read more: "${card.title}"`}
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
            {card.coverUrl && (
              <Link
                href={postPath(card.slug)}
                aria-hidden="true"
                tabIndex={-1}
                className="order-first block overflow-hidden rounded-xl sm:order-none sm:w-56 sm:flex-none"
              >
                <img
                  src={card.coverUrl}
                  alt=""
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-[2/1] w-full object-cover sm:aspect-[4/3]"
                />
              </Link>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}

// A directory-style category: a plain A to Z list of links in columns.
export function DirectoryList({ cards }: { cards: BlogCard[] }) {
  if (!cards.length) {
    return <p className="py-10 text-gray-500">No pages here yet. Please check back soon.</p>;
  }
  return (
    <ul className="gap-x-8 sm:columns-2 xl:columns-3">
      {cards.map((card) => (
        <li key={card.slug} className="break-inside-avoid border-b border-gray-100 py-2">
          <Link href={postPath(card.slug)} className="font-medium text-blue-700 hover:text-blue-900 hover:underline">
            {card.listLabel || card.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
