import Link from "next/link";

// Shown when a blog address does not exist (or the post was unpublished).
export default function BlogNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-blue-700">We could not find that page</h1>
      <p className="mt-3 text-gray-500">The post may have been moved or taken down.</p>
      <Link
        href="/blog"
        className="mt-8 inline-block rounded-full bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
      >
        Go to the blog
      </Link>
    </div>
  );
}
