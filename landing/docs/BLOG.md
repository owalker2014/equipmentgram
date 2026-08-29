# The EquipmentGram Blog — a plain-English guide

This is written for someone who has **never touched Next.js**. You do not need to
understand the code to publish articles. Part 1 is the only part you need for
day-to-day use.

---

## First, the short version of what changed

You already had a blog at `/blog`, but search engines effectively could not see it:

| Problem before | Why it mattered | Now |
|---|---|---|
| Articles were drawn by JavaScript *after* the page loaded | Google downloads the raw page first. It was arriving empty. | Articles are in the page from the first byte |
| Every page shared one title: `EquimentGram` (with a typo) | The title is the blue link in Google. Every page competed with itself. | Each article has its own title and description |
| No `sitemap.xml`, no `robots.txt` | Google had no list of your pages | Both generated automatically |
| URLs looked like `/blog/Heavy Equipment/xK92mNq3` | Random IDs rank worse and look untrustworthy | `/blog/heavy-equipment/how-to-inspect-an-excavator` |
| No "Blog" link in the menu | Google finds pages by following links. Nothing linked there. | Blog is in the header and footer |
| No author, date, or article data for Google | No rich results | Structured data on every article |
| The cover image you uploaded was silently discarded | Broken social previews | Fixed |
| No way to edit a post after publishing | Couldn't fix typos or refresh content | New "Manage Posts" screen |

**Old links still work.** Anything already shared publicly still loads, and quietly
tells Google the new address is the real one.

---

## Part 1 — Publishing an article (the only part you need weekly)

1. Go to **https://www.equipmentgram.com/admin/tools** and sign in as an admin.
2. Stay on the **Create Blog** tab.
3. Fill in the fields:

   - **Title** — this is the blue headline in Google. Put the phrase people
     actually type first. `Used Excavator Inspection Checklist` beats
     `Our Thoughts On Buying Equipment`. Keep it under ~60 characters.
   - **URL slug** — leave it blank and it builds itself from the title. Only
     change it if the title is long.
   - **Meta description** — the grey summary under the Google result. Write a
     real sentence that makes someone click. The counter warns you past 155
     characters. Leave blank and it uses your opening sentences.
   - **Cover image** — upload one. This is what shows when the link is shared
     on LinkedIn, Facebook or in a text message.
   - **Category** — pick an existing one, or type a new name to create it.
     Categories become their own pages (`/blog/heavy-equipment`) which can rank
     on their own.
   - **Author** — a real person's name. Google's guidelines favour content with
     a named human behind it.
   - **Content** — write the article. Use the editor's heading buttons for
     section headings, not bold text. Google reads headings to understand
     structure; it can't tell that bold text was meant as a heading.

4. Click **Publish post**.
5. Wait up to **60 seconds**, then visit the URL shown in the confirmation
   message. That one-minute delay is the caching that makes the blog load fast.

### Fixing or updating a post

Go to **Manage Posts**, click **Edit** next to the article, change what you need,
click **Save changes**. Same one-minute delay.

Updating old articles is real SEO work, not busywork. An article refreshed with
current information usually outranks the same article left untouched for a year.

---

## Part 2 — One-time setup (do this once, after the next deploy)

### 2.1 Tell Google the site exists

1. Go to **https://search.google.com/search-console**.
2. Add `https://www.equipmentgram.com` as a property and verify ownership
   (the DNS or HTML-file method — Search Console walks you through it).
3. In the left menu click **Sitemaps**.
4. Type `sitemap.xml` in the box and click **Submit**.

That's the single highest-value thing on this list. It's how Google learns about
every new article automatically, forever.

### 2.2 Check the pieces are live

Open these two URLs in a browser. Both should show text, not an error:

- https://www.equipmentgram.com/robots.txt
- https://www.equipmentgram.com/sitemap.xml

### 2.3 Set the site address (only if the domain ever changes)

The site's address is used to build sitemap entries and social previews. It
defaults to `https://www.equipmentgram.com`. If that ever changes, set an
environment variable in your host (Vercel → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL = https://www.equipmentgram.com
```

### 2.4 Two things worth fixing separately

- **The homepage title is just "EquipmentGram"** (set in `app/page.tsx`). That
  only ranks for people already searching your brand name. Something like
  `Pre-Purchase Heavy Equipment Inspections | EquipmentGram` would compete for
  buyers who don't know you yet. It's a one-line change, but it's a branding
  call, so it was left alone.
- **The Google Maps API key is written directly into the source code** and is
  therefore public. That was already the case before these changes, and it isn't
  a leak (browser keys are always visible), but you should restrict it to your
  domain in the Google Cloud Console so nobody else can run up your bill.

---

## Part 3 — How to actually rank

The plumbing is done. Rankings now come down to what you write.

**Write for one question per article.** A person types `how much does a used
excavator inspection cost` into Google. The article that answers exactly that
question wins. One article, one question.

**Ideas that fit EquipmentGram**, roughly in order of commercial value:

- `used excavator inspection checklist`
- `how much does a heavy equipment inspection cost`
- `what to look for when buying a used skid steer`
- `signs of undercarriage wear on a dozer`
- `how to spot hydraulic leaks before buying`
- `should I buy at a heavy equipment auction`

These are things a buyer searches *right before* spending money — which is
exactly the moment they need an inspection.

**Practical rules:**

- Aim for 1,000+ words on buying-guide topics. Thin posts rarely rank.
- Put the search phrase in the title, the first paragraph, and one heading.
  Then stop — repeating it more looks like spam.
- Link from each article to `/inspection-request` or `/pricing`. Traffic that
  never reaches a booking page isn't worth much.
- Link articles to each other. It helps readers and helps Google.
- Publish consistently. Two solid articles a month beats ten in one week and
  then nothing.
- Results take **3–6 months**. That is normal, not a sign something is broken.

---

## Part 4 — When something looks wrong

**"My new post isn't showing up."**
Wait 60 seconds and reload. If it still isn't there, check the category name
matches what you expect — the URL uses a tidied-up version of it (`Heavy
Equipment` becomes `heavy-equipment`).

**"The blog page says there are no articles."**
The site couldn't reach the database. Check your hosting logs for a line
starting with `[blog]` — it will say exactly what went wrong. The usual cause is
missing `NEXT_PUBLIC_projectId` or `NEXT_PUBLIC_apiKey` environment variables.

**"Google still isn't showing my article."**
Getting indexed takes days to weeks. To hurry a specific page: in Search Console,
paste the URL into the search bar at the top, then click **Request Indexing**.

**"`npm install` fails with a peer-dependency error."**
Pre-existing, unrelated to the blog: `@mantine/notifications` wants a newer
`@mantine/core` than the one pinned. Use `npm install --legacy-peer-deps`.
Worth fixing properly by aligning the Mantine package versions.

---

## Part 5 — For whoever maintains the code

### Files added

| File | Purpose |
|---|---|
| `lib/site.ts` | Site URL/name in one place |
| `lib/blog/types.ts` | The `BlogPost` shape |
| `lib/blog/slug.ts` | Slugs, excerpts, reading time, dates |
| `lib/blog/server.ts` | Server-side Firestore reads over the REST API |
| `app/providers.tsx` | Client providers, split out of the root layout |
| `app/sitemap.ts` | Generates `/sitemap.xml` |
| `app/robots.ts` | Generates `/robots.txt` |
| `components/admin/blog-form.tsx` | Shared create/edit form |
| `components/admin/manage-blogs.tsx` | Post list + edit screen |

### Notes

- **Why the Firestore REST API instead of the SDK.** Blog pages are server
  components. The REST call goes through `fetch`, so Next.js caches it
  (`revalidate: 60`) and reuses one response across the index, category and
  article pages. It needs no admin service-account credentials, and it can't
  fail the way the browser SDK does in a serverless runtime.
- **Failures degrade, they don't crash.** A Firestore error logs `[blog] ...`
  and returns an empty list, so a database blip shows an empty blog rather than
  a 500 across the site.
- **The root layout is now a server component.** Client-side context lives in
  `app/providers.tsx`. This is what makes `metadata` exports work at all — in a
  client component they are silently ignored, which is why every page previously
  shared one hardcoded title.
- **Slug resolution order** (`getPost`): category + slug → slug alone → document
  ID. The last one keeps pre-existing links alive; `alternates.canonical` always
  points at the clean URL so Google consolidates them.
- **`useUpdateBlog` was broken.** It wrote `updateDoc(ref, { blog })`, nesting
  every field one level too deep. Nothing called it, so it was never noticed. It
  now spreads the fields correctly.
- **Article HTML is rendered with `dangerouslySetInnerHTML`.** That is
  acceptable only because `/admin/tools` is staff-only. If post creation is ever
  opened to untrusted users, sanitise the HTML first.

### Possible next steps

- A `published` / draft flag — right now saving a post publishes it immediately.
- On-demand revalidation (`revalidateTag('firestore:blogs')`) after publishing,
  to remove the 60-second delay.
- Swap `<img>` for `next/image` (needs `images.remotePatterns` in
  `next.config.js` for the Firebase Storage host) for better Core Web Vitals.
- Delete-post support in **Manage Posts**.
