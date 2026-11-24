import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// POST /api/blog/refresh
//
// The admin screens call this right after you publish, update, unpublish or
// delete, so the public pages are rebuilt on their next visit instead of up to
// a minute later. It can do exactly one thing: mark blog pages as out of date.
// It reads nothing and changes nothing in the database, which is why it needs
// no sign-in. A small limit stops anyone from calling it in a loop.

const SLUG = /^[a-z0-9-]{1,80}$/;
const MAX_CALLS_PER_MINUTE = 120;
let windowStart = 0;
let callsInWindow = 0;

function tooMany(): boolean {
  const now = Date.now();
  if (now - windowStart > 60000) {
    windowStart = now;
    callsInWindow = 0;
  }
  callsInWindow += 1;
  return callsInWindow > MAX_CALLS_PER_MINUTE;
}

export async function POST(request: Request) {
  if (tooMany()) return NextResponse.json({ ok: false, reason: "Too many requests. Try again in a minute." }, { status: 429 });

  let body: { posts?: unknown; lists?: unknown; all?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "Send JSON." }, { status: 400 });
  }

  // Everything under /blog. Used by the "Rebuild listings" button on the Status check screen.
  if (body.all === true) {
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ ok: true, refreshed: "everything" });
  }

  const posts = Array.isArray(body.posts) ? body.posts.filter((s): s is string => typeof s === "string" && SLUG.test(s)).slice(0, 200) : [];
  for (const slug of posts) revalidatePath(`/blog/${slug}`);

  // The lists: /blog and its later pages, every category page, the feed and the sitemap.
  if (body.lists === true) {
    revalidatePath("/blog");
    revalidatePath("/blog/page/[page]", "page");
    revalidatePath("/blog/category/[category]", "page");
    revalidatePath("/blog/category/[category]/page/[page]", "page");
    revalidatePath("/blog/feed.xml");
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({ ok: true, refreshed: posts.length, lists: body.lists === true });
}
