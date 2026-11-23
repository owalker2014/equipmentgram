/* eslint-disable @next/next/no-img-element */
// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
// The template's post page: date and title on top, a narrow column on the left
// with the author and the Previous / Next links, and the article on the right.
// Added for EquipmentGram: the cover picture, breadcrumbs, "On this page",
// the key-facts box, questions and answers, and "Keep reading".
import Link from "next/link";
import { DEFAULT_AUTHOR } from "@/lib/blog/config";
import type { PreparedContent } from "@/lib/blog/html";
import { postPath } from "@/lib/blog/seo";
import { formatDate, isoDate } from "@/lib/blog/text";
import type { BlogCard, BlogCategory, BlogLivePost } from "@/lib/blog/types";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import CallToAction from "./CallToAction";
import CategoryLabel from "./CategoryLabel";
import PageTitle from "./PageTitle";
import PostCard from "./PostCard";
import ScrollTop from "./ScrollTop";
import SectionContainer from "./SectionContainer";

type Props = {
  post: BlogLivePost;
  category: BlogCategory | null;
  content: PreparedContent;
  crumbs: Crumb[];
  prev: BlogCard | null;
  next: BlogCard | null;
  related: BlogCard[];
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const railHeading = "text-xs uppercase tracking-wide text-gray-500";
const railLink = "text-blue-700 hover:text-blue-900";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function PostLayout({ post, category, content, crumbs, prev, next, related }: Props) {
  const author = post.authorName || DEFAULT_AUTHOR;
  const wasUpdated = post.updatedAt - post.publishedAt > ONE_DAY;
  const directory = !!category && category.layout === "directory";
  const linkText = (card: BlogCard) => (directory ? card.listLabel || card.title : card.title);

  return (
    <SectionContainer>
      <ScrollTop />
      <Breadcrumbs crumbs={crumbs} />
      <article>
        <div className="xl:divide-y xl:divide-gray-200">
          <header className="pt-6 xl:pb-8">
            <div className="space-y-2 text-center">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base font-medium leading-6 text-gray-500">
                  <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden="true"> &middot; </span>
                  {post.readingMinutes} min read
                </dd>
              </dl>
              <PageTitle>{post.title}</PageTitle>
              {post.summary && <p className="mx-auto max-w-2xl pt-2 text-lg text-gray-500">{post.summary}</p>}
            </div>
            {post.coverUrl && (
              <div className="mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={post.coverUrl}
                  alt={post.coverAlt}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </header>

          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-8 pt-6 xl:border-b xl:border-gray-200 xl:pt-11">
              <dt className="sr-only">Author</dt>
              <dd>
                <div className="flex items-center justify-center space-x-3 xl:justify-start">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white"
                  >
                    {initials(author)}
                  </span>
                  <div className="text-sm font-medium leading-5">
                    <div className="text-gray-900">{author}</div>
                    {wasUpdated && (
                      <div className="text-gray-500">
                        Updated <time dateTime={isoDate(post.updatedAt)}>{formatDate(post.updatedAt)}</time>
                      </div>
                    )}
                  </div>
                </div>
              </dd>
            </dl>

            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="pb-8 pt-10">
                {post.facts.length > 0 && (
                  <section aria-label="Key facts" className="mb-10 rounded-2xl bg-blue-50 p-6">
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">Key facts</h2>
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {post.facts.map((fact) => (
                        <div key={fact.label} className="border-b border-blue-100 pb-2">
                          <dt className="text-sm text-gray-500">{fact.label}</dt>
                          <dd className="font-semibold text-gray-900">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                <div
                  className="blog-prose prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-a:font-medium prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-blue-700 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content.html }}
                />

                {post.faq.length > 0 && (
                  <section aria-labelledby="blog-faq" className="mt-12">
                    <h2 id="blog-faq" className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
                      Common questions
                    </h2>
                    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200">
                      {post.faq.map((item) => (
                        <details key={item.q} className="group px-5 py-4">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                            {item.q}
                            <span aria-hidden="true" className="text-xl text-blue-700 group-open:rotate-45">
                              +
                            </span>
                          </summary>
                          <p className="mt-3 whitespace-pre-line text-gray-600">{item.a}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <footer className="xl:sticky xl:top-6 xl:col-start-1 xl:row-start-2 xl:self-start">
              <div className="text-sm font-medium leading-5 xl:divide-y xl:divide-gray-200">
                {content.toc.length > 2 && (
                  <nav aria-label="On this page" className="hidden py-8 xl:block">
                    <h2 className={railHeading}>On this page</h2>
                    <ul className="mt-2 space-y-2">
                      {content.toc.map((item) => (
                        <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                          <a href={`#${item.id}`} className="text-gray-600 hover:text-blue-700">
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                {category && (
                  <div className="py-4 xl:py-8">
                    <h2 className={railHeading}>Category</h2>
                    <div className="mt-1 flex flex-wrap">
                      <CategoryLabel slug={category.slug} name={category.name} />
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between gap-6 py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className={railHeading}>{directory ? "Previous" : "Previous article"}</h2>
                        <div className={`mt-1 ${railLink}`}>
                          <Link href={postPath(prev.slug)}>{linkText(prev)}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className={railHeading}>{directory ? "Next" : "Next article"}</h2>
                        <div className={`mt-1 ${railLink}`}>
                          <Link href={postPath(next.slug)}>{linkText(next)}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link href="/blog" className={`text-sm font-medium ${railLink}`} aria-label="Back to the blog">
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="blog-related" className="border-t border-gray-200 pt-10">
          <h2 id="blog-related" className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
            Keep reading
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((card) => (
              <PostCard key={card.slug} card={card} />
            ))}
          </div>
        </section>
      )}

      <CallToAction />
    </SectionContainer>
  );
}
