import { buildExcerpt, slugify } from "./slug";
import type { BlogPost } from "./types";

/**
 * Reads blog posts from Firestore on the *server*, so the article HTML is in
 * the page Google downloads. The browser SDK used elsewhere in this app can't
 * do that — it only runs after JavaScript loads, which search engines index
 * slowly and unreliably.
 *
 * We talk to Firestore's plain REST API with `fetch` rather than the SDK, so
 * Next.js can cache the response and re-use it across every blog page.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_projectId;
const API_KEY = process.env.NEXT_PUBLIC_apiKey;

/** How many seconds a fetched list is re-used before Firestore is asked again. */
export const BLOG_REVALIDATE_SECONDS = 60;

type FirestoreValue = Record<string, any>;

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
}

/** Converts Firestore's `{ stringValue: "hi" }` wrappers into plain JS values. */
function decodeValue(value: FirestoreValue | undefined): any {
  if (!value) return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) return decodeFields(value.mapValue?.fields);
  if ("arrayValue" in value) return (value.arrayValue?.values || []).map(decodeValue);
  return undefined;
}

function decodeFields(fields?: Record<string, FirestoreValue>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields || {})) out[key] = decodeValue(value);
  return out;
}

/** Fetches an entire Firestore collection, following pagination if needed. */
async function fetchCollection(collection: string): Promise<FirestoreDocument[]> {
  if (!PROJECT_ID || !API_KEY) {
    console.error(
      `[blog] Cannot load "${collection}": NEXT_PUBLIC_projectId / NEXT_PUBLIC_apiKey are not set in this environment.`
    );
    return [];
  }

  const documents: FirestoreDocument[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}`
    );
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url.toString(), {
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [`firestore:${collection}`] },
    });

    if (!response.ok) {
      // A failed read must not take the whole page down: log loudly, show an
      // empty list, and let the next revalidation try again.
      console.error(`[blog] Firestore returned ${response.status} for "${collection}": ${await response.text()}`);
      return documents;
    }

    const body = (await response.json()) as { documents?: FirestoreDocument[]; nextPageToken?: string };
    documents.push(...(body.documents || []));
    pageToken = body.nextPageToken;
  } while (pageToken);

  return documents;
}

function toBlogPost(document: FirestoreDocument): BlogPost {
  const id = document.name.split("/").pop() as string;
  const data = decodeFields(document.fields);

  const title: string = data.title || "Untitled";
  const content: string = data.content || "";
  const categoryName: string = data.category?.name || "Uncategorized";

  return {
    id,
    // Posts written before slugs existed fall back to their document ID, so
    // every link that is already out in the wild keeps working.
    slug: data.slug ? slugify(data.slug) : id,
    title,
    content,
    excerpt: data.excerpt || buildExcerpt(content),
    imageUrl: data.imageUrl || undefined,
    author: data.author || undefined,
    categoryName,
    categorySlug: slugify(categoryName),
    createdAt: data.created_at || document.createTime || "",
    updatedAt: data.updated_at || document.updateTime || data.created_at || "",
  };
}

/** Every post, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = (await fetchCollection("blogs")).map(toBlogPost);
  return posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.categorySlug === categorySlug);
}

/**
 * Finds one post. Matches the new pretty slug first, then falls back to the
 * old Firestore document ID so previously shared links never 404.
 */
export async function getPost(categorySlug: string, slugOrId: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  const wanted = decodeURIComponent(slugOrId);
  return (
    posts.find((post) => post.categorySlug === categorySlug && post.slug === wanted) ||
    posts.find((post) => post.slug === wanted) ||
    posts.find((post) => post.id === wanted)
  );
}

/** Categories that actually have at least one post, with their post counts. */
export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const posts = await getAllPosts();
  const bySlug = new Map<string, { name: string; slug: string; count: number }>();

  for (const post of posts) {
    const existing = bySlug.get(post.categorySlug);
    if (existing) existing.count += 1;
    else bySlug.set(post.categorySlug, { name: post.categoryName, slug: post.categorySlug, count: 1 });
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}
