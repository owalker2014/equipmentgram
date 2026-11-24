"use client";

// The first screen of the studio: the things you do most, one click
// away, a short list of first steps while the blog is new, and your latest posts.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Loader } from "@mantine/core";
import { IconArticle, IconCategory, IconChevronRight, IconCircleCheck, IconCircleDashed, IconPencilPlus } from "@tabler/icons-react";
import { friendlyError, listPosts } from "@/lib/blog/admin-data";
import { formatDate } from "@/lib/blog/text";
import type { BlogPost } from "@/lib/blog/types";
import { useCategories } from "./shared";

const ACTIONS = [
  { href: "/studio/posts/new", title: "Write a new post", text: "Start a draft. Nothing is public until you click Publish.", icon: IconPencilPlus },
  { href: "/studio/posts", title: "Manage posts", text: "Edit, publish, unpublish or delete what you have written.", icon: IconArticle },
  { href: "/studio/categories", title: "Add a category", text: "Categories are the sections of the blog. Every post goes in one.", icon: IconCategory },
];

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-2">
      {done ? <IconCircleCheck size={20} className="mt-0.5 shrink-0 text-green-600" aria-label="Done" /> : <IconCircleDashed size={20} className="mt-0.5 shrink-0 text-slate-400" aria-label="To do" />}
      <span className={done ? "text-slate-500 line-through" : "text-slate-800"}>{children}</span>
    </li>
  );
}

export default function Home() {
  const { categories, loading: loadingCategories } = useCategories();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    listPosts({}, null, 5)
      .then((page) => {
        if (current) setPosts(page.posts);
      })
      .catch((e) => {
        if (current) setError(friendlyError(e));
      })
      .finally(() => {
        if (current) setLoadingPosts(false);
      });
    return () => {
      current = false;
    };
  }, []);

  const loading = loadingCategories || loadingPosts;
  const hasCategory = categories.length > 0;
  const hasPost = posts.length > 0;
  const hasPublished = posts.some((post) => post.status === "published");
  const starting = !loading && !error && !(hasCategory && hasPublished);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Home</h1>
      <p className="mt-1 text-sm text-slate-600">What would you like to do?</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Icon size={22} />
              </span>
              <span className="mt-3 block text-base font-semibold text-slate-900 group-hover:text-blue-700">{action.title}</span>
              <span className="mt-1 block text-sm text-slate-600">{action.text}</span>
            </Link>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {starting && (
        <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-base font-semibold text-slate-900">Start here</h2>
          <ol className="mt-2 text-sm">
            <Step done={false}>
              <Link href="/studio/status" className="font-medium text-blue-700 underline">
                Run the Status check
              </Link>
              . Four green ticks mean the blog can read, save and upload.
            </Step>
            <Step done={hasCategory}>
              <Link href="/studio/categories" className="font-medium text-blue-700 underline">
                Add your first category
              </Link>
              , for example Buying guides.
            </Step>
            <Step done={hasPublished}>
              <Link href="/studio/posts/new" className="font-medium text-blue-700 underline">
                Write a post
              </Link>{" "}
              and click Publish.
            </Step>
          </ol>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Latest posts</h2>
          {hasPost && (
            <Link href="/studio/posts" className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
              All posts <IconChevronRight size={14} />
            </Link>
          )}
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader size="sm" aria-label="Loading your posts" />
            </div>
          ) : !hasPost ? (
            <p className="p-5 text-sm text-slate-600">No posts yet. Your drafts and published posts will be listed here.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {posts.map((post) => (
                <li key={post.slug} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link href={`/studio/posts/edit/${post.slug}`} className="block truncate font-medium text-slate-900 hover:text-blue-700">
                      {post.title || "(no title yet)"}
                    </Link>
                    <span className="text-xs text-slate-500">Last saved {formatDate(post.updatedAt)}</span>
                  </div>
                  <Badge color={post.status === "published" ? "green" : "gray"} variant="light">
                    {post.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
