// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
// The template calls this a "tag". Here it shows the post's category.
import Link from "next/link";
import { categoryPath } from "@/lib/blog/seo";

export default function CategoryLabel({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={categoryPath(slug)}
      className="mr-3 text-sm font-medium uppercase tracking-wide text-blue-700 hover:text-blue-900"
    >
      {name}
    </Link>
  );
}
