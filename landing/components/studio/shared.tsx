"use client";

// Small pieces the Blog studio screens share.

import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { friendlyError, listCategories } from "@/lib/blog/admin-data";
import type { BlogCategory, BlogPost } from "@/lib/blog/types";

export function notifyOk(message: string) {
  notifications.show({ color: "green", title: "Done", message });
}

export function notifyError(error: unknown) {
  notifications.show({ color: "red", title: "That did not work", message: friendlyError(error), autoClose: 12000 });
}

// Loads the categories once and lets a screen ask for them again.
export function useCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await listCategories());
      setError("");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, loading, error, reload };
}

// 1763478245000 -> "Nov 18, 2026, 10:04 AM" in the reader's own time zone.
export function shortDateTime(ms: number): string {
  if (!ms) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ms));
}

export function emptyPost(): BlogPost {
  return {
    slug: "",
    title: "",
    summary: "",
    contentHtml: "",
    coverUrl: "",
    coverAlt: "",
    categorySlug: "",
    authorName: "",
    listLabel: "",
    facts: [],
    faq: [],
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    noindex: false,
    inFeed: true,
    status: "draft",
    hasChanges: false,
    source: "manual",
    batchId: "",
    createdAt: 0,
    updatedAt: 0,
    publishedAt: 0,
  };
}
