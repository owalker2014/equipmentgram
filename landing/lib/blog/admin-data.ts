// Everything the Blog studio screens read and write.
// This file runs in the browser, as the signed-in admin. Firebase's rules
// decide what is allowed: see "Database rules" in the manual.

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
  writeBatch,
  type DocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore/lite";
import { blogDb } from "./firebase";
import { CARDS, CATEGORIES, DIRECTORY_PER_PAGE, LIVE, META, POSTS, POSTS_PER_PAGE, TEMPLATES } from "./config";
import { FEED_INDEX_ID, FEED_RANGE, buildIndex, categoryIndexId, categoryRange, toCard, toLive } from "./keys";
import { asCard, asCategory, asIndex, asPost, asTemplate, sortCategories } from "./shape";
import { slugProblem } from "./text";
import type { BlogCard, BlogCategory, BlogPost, BlogStatus, BulkTemplate, ListingIndex } from "./types";

export type Progress = (done: number, total: number) => void;

// A sentence a person can act on, instead of a code.
export function friendlyError(error: unknown): string {
  const code = String((error as any)?.code || "");
  if (code.includes("permission-denied")) {
    return "Firebase refused this. Check that you are signed in with an admin account and that the blog's database rules are published (see the manual, Part 4).";
  }
  if (code.includes("unauthenticated")) return "You are signed out. Sign in again and retry.";
  if (code.includes("unavailable") || code.includes("deadline-exceeded")) {
    return "The database could not be reached. Check your internet connection and try again.";
  }
  if (code.includes("resource-exhausted")) return "Firebase's daily free limit was reached. Try again tomorrow or upgrade the Firebase plan.";
  if (code.includes("storage/unauthorized")) {
    return "Firebase Storage refused the upload. Check the Storage rules for the blog folder (see the manual, Part 4).";
  }
  const message = String((error as any)?.message || error || "Something went wrong.");
  return message.length > 300 ? `${message.slice(0, 300)}...` : message;
}

// The record without its address: the address is the record's name in the database.
function body<T extends { slug: string }>(record: T): Omit<T, "slug"> {
  const { slug: _slug, ...rest } = record;
  return rest;
}

// ------------------------------------------------------------ site refresh

async function callRefresh(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/blog/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Marks every blog page as out of date. Also used by the button on the Status check screen.
export async function refreshWholeBlog(): Promise<boolean> {
  return callRefresh({ all: true });
}

// Tells the site which public pages are out of date, so they are rebuilt on
// their next visit instead of up to a minute later. If a call fails, nothing
// is lost: the pages still catch up by themselves.
export async function refreshSite(posts: string[], lists = true): Promise<boolean> {
  if (posts.length > 1000) return refreshWholeBlog();
  const send = async () => {
    for (let i = 0; i === 0 || i < posts.length; i += 200) {
      if (!(await callRefresh({ posts: posts.slice(i, i + 200), lists: lists && i === 0 }))) return false;
    }
    return true;
  };
  const ok = await send();
  // Once more a little later. If the site happened to be rebuilding one of these
  // pages at the very moment of the first call, that rebuild used the old data
  // and the first call was lost on it.
  if (typeof window !== "undefined") window.setTimeout(send, 2500);
  return ok;
}

// ---------------------------------------------------------------- categories

export async function listCategories(): Promise<BlogCategory[]> {
  const snap = await getDocs(collection(blogDb, CATEGORIES));
  return sortCategories(snap.docs.map((d) => asCategory(d.id, d.data())));
}

export async function saveCategory(category: BlogCategory, isNew: boolean): Promise<void> {
  const problem = slugProblem(category.slug);
  if (problem) throw new Error(problem);
  if (!category.name.trim()) throw new Error("Give the category a name.");
  const ref = doc(blogDb, CATEGORIES, category.slug);
  const now = Date.now();
  if (isNew && (await getDoc(ref)).exists()) {
    throw new Error(`A category with the address "${category.slug}" already exists.`);
  }
  await setDoc(ref, { ...body(category), createdAt: isNew ? now : category.createdAt, updatedAt: now });
  // Its list may be ordered differently now (newest first or A to Z).
  if (!isNew) await rebuildCategoryListing(category);
  await refreshSite([]);
}

export async function deleteCategory(slug: string): Promise<void> {
  const used = await getDocs(query(collection(blogDb, POSTS), where("categorySlug", "==", slug), limit(1)));
  if (!used.empty) throw new Error("This category still has posts. Move or delete them first.");
  const batch = writeBatch(blogDb);
  batch.delete(doc(blogDb, CATEGORIES, slug));
  batch.delete(doc(blogDb, META, categoryIndexId(slug)));
  await batch.commit();
  await refreshSite([]);
}

// --------------------------------------------------------------------- posts

export type PostFilter = { status?: BlogStatus | ""; categorySlug?: string; batchId?: string };
export type PostPage = { posts: BlogPost[]; cursor: DocumentSnapshot | null; more: boolean };

// One screenful of working copies. Without a filter the most recently edited
// come first; with a filter they come in A to Z order of their address.
export async function listPosts(filter: PostFilter, cursor: DocumentSnapshot | null, pageSize = 50): Promise<PostPage> {
  const parts: QueryConstraint[] = [];
  if (filter.status) parts.push(where("status", "==", filter.status));
  if (filter.categorySlug) parts.push(where("categorySlug", "==", filter.categorySlug));
  if (filter.batchId) parts.push(where("batchId", "==", filter.batchId));
  if (!parts.length) parts.push(orderBy("updatedAt", "desc"));
  if (cursor) parts.push(startAfter(cursor));
  parts.push(limit(pageSize + 1));
  const snap = await getDocs(query(collection(blogDb, POSTS), ...parts));
  const docs = snap.docs.slice(0, pageSize);
  return {
    posts: docs.map((d) => asPost(d.id, d.data())),
    cursor: docs.length ? docs[docs.length - 1] : cursor,
    more: snap.docs.length > pageSize,
  };
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(blogDb, POSTS, slug));
  return snap.exists() ? asPost(snap.id, snap.data()) : null;
}

// What stops a post from being saved at all.
export function saveProblems(post: BlogPost): string[] {
  const problems: string[] = [];
  const address = slugProblem(post.slug);
  if (address) problems.push(address);
  if (!post.title.trim()) problems.push("Give the post a title.");
  if (post.contentHtml.length > 900000) problems.push("The post is too long to store as one page. Split it into two posts.");
  return problems;
}

// What stops a post from being published. A draft may be incomplete; a published post may not.
export function publishProblems(post: BlogPost, categories: BlogCategory[]): string[] {
  const problems = saveProblems(post);
  if (!post.categorySlug) problems.push("Choose a category.");
  else if (!categories.some((c) => c.slug === post.categorySlug)) problems.push("The post's category no longer exists. Choose another.");
  if (!post.summary.trim()) problems.push("Write a summary. It is shown in lists and in Google.");
  if (post.coverUrl && !post.coverAlt.trim()) problems.push("Describe the cover picture in a few words.");
  if (post.canonicalUrl && !/^https:\/\//i.test(post.canonicalUrl)) problems.push('The "original address" must start with https://');
  return problems;
}

export async function saveDraft(post: BlogPost, isNew: boolean): Promise<BlogPost> {
  const problems = saveProblems(post);
  if (problems.length) throw new Error(problems.join(" "));
  const ref = doc(blogDb, POSTS, post.slug);
  if (isNew && (await getDoc(ref)).exists()) {
    throw new Error(`Another post already uses the address "${post.slug}". Change the address and save again.`);
  }
  const now = Date.now();
  const saved: BlogPost = {
    ...post,
    createdAt: isNew || !post.createdAt ? now : post.createdAt,
    updatedAt: now,
    hasChanges: post.status === "published",
  };
  await setDoc(ref, body(saved));
  return saved;
}

// Gives a draft a new address. A published post keeps its address, because
// other sites and Google already point at it.
export async function renameDraft(post: BlogPost, newSlug: string): Promise<BlogPost> {
  if (post.status === "published") throw new Error("Unpublish the post before changing its address.");
  const problem = slugProblem(newSlug);
  if (problem) throw new Error(problem);
  const target = doc(blogDb, POSTS, newSlug);
  if ((await getDoc(target)).exists()) throw new Error(`Another post already uses the address "${newSlug}".`);
  const moved: BlogPost = { ...post, slug: newSlug, updatedAt: Date.now() };
  const batch = writeBatch(blogDb);
  batch.set(target, body(moved));
  batch.delete(doc(blogDb, POSTS, post.slug));
  await batch.commit();
  return moved;
}

type Affected = { categories: Set<string>; feed: boolean };

function note(affected: Affected, card: Pick<BlogCard, "categorySlug" | "feedSort"> | null) {
  if (!card) return;
  if (card.categorySlug) affected.categories.add(card.categorySlug);
  if (card.feedSort) affected.feed = true;
}

async function existingCard(slug: string): Promise<BlogCard | null> {
  const snap = await getDoc(doc(blogDb, CARDS, slug));
  return snap.exists() ? asCard(snap.id, snap.data()) : null;
}

// The three records a published post consists of, ready to be written together.
function publishRecords(post: BlogPost, now: number) {
  const publishedAt = post.publishedAt || now;
  const live = toLive(post, publishedAt, now);
  const card = toCard(live);
  const saved: BlogPost = { ...post, status: "published", publishedAt, updatedAt: now, hasChanges: false };
  return { live, card, saved };
}

// Publishes a post, or republishes it after an edit.
export async function publishPost(post: BlogPost, categories: BlogCategory[]): Promise<BlogPost> {
  const problems = publishProblems(post, categories);
  if (problems.length) throw new Error(problems.join(" "));
  const affected: Affected = { categories: new Set(), feed: false };
  note(affected, await existingCard(post.slug));

  const { live, card, saved } = publishRecords(post, Date.now());
  const batch = writeBatch(blogDb);
  batch.set(doc(blogDb, LIVE, post.slug), body(live));
  batch.set(doc(blogDb, CARDS, post.slug), body(card));
  batch.set(doc(blogDb, POSTS, post.slug), body(saved));
  await batch.commit();

  note(affected, card);
  await rebuildListings(affected, categories);
  await refreshSite([post.slug]);
  return saved;
}

// Takes a post off the public site. The working copy stays, as a draft.
export async function unpublishPost(post: BlogPost, categories: BlogCategory[]): Promise<BlogPost> {
  const affected: Affected = { categories: new Set(), feed: false };
  note(affected, await existingCard(post.slug));
  const saved: BlogPost = { ...post, status: "draft", hasChanges: false, updatedAt: Date.now() };
  const batch = writeBatch(blogDb);
  batch.delete(doc(blogDb, LIVE, post.slug));
  batch.delete(doc(blogDb, CARDS, post.slug));
  batch.set(doc(blogDb, POSTS, post.slug), body(saved));
  await batch.commit();
  await rebuildListings(affected, categories);
  await refreshSite([post.slug]);
  return saved;
}

export async function deletePost(post: BlogPost, categories: BlogCategory[]): Promise<void> {
  const affected: Affected = { categories: new Set(), feed: false };
  note(affected, await existingCard(post.slug));
  const batch = writeBatch(blogDb);
  batch.delete(doc(blogDb, LIVE, post.slug));
  batch.delete(doc(blogDb, CARDS, post.slug));
  batch.delete(doc(blogDb, POSTS, post.slug));
  await batch.commit();
  await rebuildListings(affected, categories);
  await refreshSite([post.slug]);
}

// ------------------------------------------------------------ many at a time

export type Skipped = { slug: string; reason: string };

// Firebase accepts at most 500 changes and 10 MB per request. Stay well under both.
const MAX_WRITES = 240;
const MAX_BYTES = 3000000;

async function inGroups<T>(items: T[], size: number, work: (group: T[]) => Promise<void>): Promise<void> {
  for (let i = 0; i < items.length; i += size) await work(items.slice(i, i + size));
}

// Saves many drafts made by the Bulk pages tool.
// "update" refreshes pages that an earlier bulk run created; hand-written posts are never overwritten.
export async function saveManyDrafts(
  posts: BlogPost[],
  mode: "skip" | "update",
  onProgress: Progress
): Promise<{ created: number; updated: number; skipped: Skipped[] }> {
  const skipped: Skipped[] = [];
  const toWrite: BlogPost[] = [];
  let created = 0;
  let updated = 0;

  await inGroups(posts, 20, async (group) => {
    const found = await Promise.all(group.map((p) => getPost(p.slug)));
    group.forEach((post, i) => {
      const old = found[i];
      const problems = saveProblems(post);
      if (problems.length) skipped.push({ slug: post.slug || "(no address)", reason: problems.join(" ") });
      else if (!old) {
        toWrite.push(post);
        created += 1;
      } else if (mode === "update" && old.source === "bulk") {
        // Keep what the page already is on the site: its status, dates and picture.
        toWrite.push({
          ...post,
          status: old.status,
          publishedAt: old.publishedAt,
          createdAt: old.createdAt,
          coverUrl: old.coverUrl,
          coverAlt: old.coverAlt,
          inFeed: old.inFeed,
          noindex: old.noindex,
          hasChanges: old.status === "published",
        });
        updated += 1;
      } else {
        skipped.push({
          slug: post.slug,
          reason: old.source === "bulk" ? "A page with this address already exists." : "A hand-written post already uses this address.",
        });
      }
    });
    onProgress(Math.min(posts.length, toWrite.length + skipped.length), posts.length * 2);
  });

  let done = 0;
  let batch = writeBatch(blogDb);
  let writes = 0;
  let bytes = 0;
  for (const post of toWrite) {
    batch.set(doc(blogDb, POSTS, post.slug), body(post));
    writes += 1;
    bytes += post.contentHtml.length + 2000;
    done += 1;
    if (writes >= MAX_WRITES || bytes >= MAX_BYTES) {
      await batch.commit();
      batch = writeBatch(blogDb);
      writes = 0;
      bytes = 0;
      onProgress(posts.length + done, posts.length * 2);
    }
  }
  if (writes) await batch.commit();
  onProgress(posts.length * 2, posts.length * 2);
  return { created, updated, skipped };
}

// Publishes many posts, then rebuilds the lists once at the end.
export async function publishMany(
  posts: BlogPost[],
  categories: BlogCategory[],
  onProgress: Progress
): Promise<{ done: number; skipped: Skipped[] }> {
  const skipped: Skipped[] = [];
  const affected: Affected = { categories: new Set(), feed: false };
  const ready: BlogPost[] = [];
  for (const post of posts) {
    const problems = publishProblems(post, categories);
    if (problems.length) skipped.push({ slug: post.slug, reason: problems.join(" ") });
    else ready.push(post);
  }
  // A post that is already live may be moving out of another category.
  await inGroups(ready.filter((p) => p.status === "published"), 20, async (group) => {
    (await Promise.all(group.map((p) => existingCard(p.slug)))).forEach((card) => note(affected, card));
  });

  const now = Date.now();
  let done = 0;
  let batch = writeBatch(blogDb);
  let writes = 0;
  let bytes = 0;
  for (const post of ready) {
    const { live, card, saved } = publishRecords(post, now);
    batch.set(doc(blogDb, LIVE, post.slug), body(live));
    batch.set(doc(blogDb, CARDS, post.slug), body(card));
    batch.set(doc(blogDb, POSTS, post.slug), body(saved));
    note(affected, card);
    writes += 3;
    bytes += post.contentHtml.length * 2 + 6000;
    done += 1;
    if (writes >= MAX_WRITES || bytes >= MAX_BYTES) {
      await batch.commit();
      batch = writeBatch(blogDb);
      writes = 0;
      bytes = 0;
      onProgress(done, ready.length);
    }
  }
  if (writes) await batch.commit();
  onProgress(ready.length, ready.length);
  await rebuildListings(affected, categories);
  await refreshSite(ready.map((p) => p.slug));
  return { done, skipped };
}

// Unpublishes or deletes many posts, then rebuilds the lists once.
export async function removeMany(
  posts: BlogPost[],
  action: "unpublish" | "delete",
  categories: BlogCategory[],
  onProgress: Progress
): Promise<{ done: number }> {
  const now = Date.now();
  let done = 0;
  let somethingWasLive = false;
  await inGroups(posts, 80, async (group) => {
    const batch = writeBatch(blogDb);
    for (const post of group) {
      if (post.status === "published") {
        somethingWasLive = true;
        batch.delete(doc(blogDb, LIVE, post.slug));
        batch.delete(doc(blogDb, CARDS, post.slug));
      }
      if (action === "delete") batch.delete(doc(blogDb, POSTS, post.slug));
      else if (post.status === "published") {
        batch.set(doc(blogDb, POSTS, post.slug), body({ ...post, status: "draft", hasChanges: false, updatedAt: now }));
      }
    }
    await batch.commit();
    done += group.length;
    onProgress(done, posts.length);
  });
  // Rebuilding every list is the simple way to be right, and it only reads small records.
  if (somethingWasLive) {
    await rebuildListings({ feed: true, categories: new Set(categories.map((c) => c.slug)) }, categories);
    await refreshSite(posts.filter((p) => p.status === "published").map((p) => p.slug));
  }
  return { done };
}

// ------------------------------------------------------------------ listings
//
// Each list on the public blog is split into pages by a small record that says
// where every page starts. These functions rebuild those records by reading the
// keys of the cards in the list, 1,000 at a time.

type KeyField = "feedSort" | "catSort" | "dirSort";

async function readKeys(field: KeyField, range: { start: string; end: string }): Promise<string[]> {
  const keys: string[] = [];
  let last = "";
  for (;;) {
    const snap = await getDocs(
      query(
        collection(blogDb, CARDS),
        last ? where(field, ">", last) : where(field, ">=", range.start),
        where(field, "<", range.end),
        orderBy(field),
        limit(1000)
      )
    );
    snap.forEach((d) => keys.push(String(d.get(field))));
    if (snap.size < 1000) return keys;
    last = keys[keys.length - 1];
  }
}

export async function rebuildFeedListing(): Promise<ListingIndex> {
  const index = buildIndex(await readKeys("feedSort", FEED_RANGE), POSTS_PER_PAGE);
  await setDoc(doc(blogDb, META, FEED_INDEX_ID), index);
  return index;
}

export async function rebuildCategoryListing(category: BlogCategory): Promise<ListingIndex> {
  const directory = category.layout === "directory";
  const keys = await readKeys(directory ? "dirSort" : "catSort", categoryRange(category.slug));
  const index = buildIndex(keys, directory ? DIRECTORY_PER_PAGE : POSTS_PER_PAGE);
  await setDoc(doc(blogDb, META, categoryIndexId(category.slug)), index);
  return index;
}

async function rebuildListings(affected: Affected, categories: BlogCategory[]): Promise<void> {
  if (affected.feed) await rebuildFeedListing();
  for (const slug of Array.from(affected.categories)) {
    const category = categories.find((c) => c.slug === slug);
    if (category) await rebuildCategoryListing(category);
  }
}

export type ListingReport = { name: string; count: number; pages: number }[];

// Rebuilds every list. Safe to run at any time; it changes nothing a visitor reads except page boundaries.
export async function rebuildAllListings(onProgress: Progress): Promise<ListingReport> {
  const categories = await listCategories();
  const report: ListingReport = [];
  const feed = await rebuildFeedListing();
  report.push({ name: "Main blog list", count: feed.count, pages: feed.starts.length + 1 });
  onProgress(1, categories.length + 1);
  for (let i = 0; i < categories.length; i++) {
    const index = await rebuildCategoryListing(categories[i]);
    report.push({ name: categories[i].name, count: index.count, pages: index.starts.length + 1 });
    onProgress(i + 2, categories.length + 1);
  }
  await refreshWholeBlog();
  return report;
}

export async function getListingIndexes(): Promise<Record<string, ListingIndex>> {
  const snap = await getDocs(collection(blogDb, META));
  const indexes: Record<string, ListingIndex> = {};
  snap.forEach((d) => {
    indexes[d.id] = asIndex(d.data());
  });
  return indexes;
}

// ----------------------------------------------------------------- templates

export async function listTemplates(): Promise<BulkTemplate[]> {
  const snap = await getDocs(collection(blogDb, TEMPLATES));
  return snap.docs.map((d) => asTemplate(d.id, d.data())).sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveTemplate(template: BulkTemplate): Promise<void> {
  const { id, ...rest } = template;
  await setDoc(doc(blogDb, TEMPLATES, id), { ...rest, updatedAt: Date.now() });
}

export async function deleteTemplate(id: string): Promise<void> {
  await deleteDoc(doc(blogDb, TEMPLATES, id));
}

// -------------------------------------------------------------- status check

export type CheckResult = { name: string; ok: boolean; detail: string };

async function check(name: string, okDetail: string, work: () => Promise<void>): Promise<CheckResult> {
  try {
    await work();
    return { name, ok: true, detail: okDetail };
  } catch (error) {
    return { name, ok: false, detail: friendlyError(error) };
  }
}

// Tries each thing the blog needs from the database and reports what works.
export async function runDatabaseChecks(): Promise<CheckResult[]> {
  return [
    await check("Read the public blog", "Visitors can read published posts.", async () => {
      await getDocs(query(collection(blogDb, CARDS), limit(1)));
      await getDocs(query(collection(blogDb, CATEGORIES), limit(1)));
      await getDocs(query(collection(blogDb, META), limit(1)));
      await getDocs(query(collection(blogDb, LIVE), limit(1)));
    }),
    await check("Read your drafts", "You can open the working copies of posts.", async () => {
      await getDocs(query(collection(blogDb, POSTS), limit(1)));
      await getDocs(query(collection(blogDb, TEMPLATES), limit(1)));
    }),
    await check("Save changes", "You can save and publish.", async () => {
      const probe = doc(blogDb, POSTS, "zz-status-check");
      await setDoc(probe, { title: "Status check", status: "draft", updatedAt: Date.now() });
      await deleteDoc(probe);
      const publicProbe = doc(blogDb, META, "zz_status_check");
      await setDoc(publicProbe, { starts: [], count: 0, pageSize: 0, updatedAt: Date.now() });
      await deleteDoc(publicProbe);
    }),
  ];
}
