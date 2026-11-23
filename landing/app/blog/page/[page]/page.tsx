import { notFound, redirect } from "next/navigation";
import { FeedPage, feedMetadata } from "@/components/blog/pages";
import { pageNumber } from "@/lib/blog/text";

// /blog/page/2, /blog/page/3 ... : the later pages of the list of posts.
export const revalidate = 60;

// No pages are built ahead of time. Each one is built the first time someone asks for it.
export function generateStaticParams() {
  return [];
}

type Props = { params: { page: string } };

export function generateMetadata({ params }: Props) {
  return feedMetadata(pageNumber(params.page) || 1);
}

export default function Page({ params }: Props) {
  const page = pageNumber(params.page);
  if (!page) notFound();
  if (page === 1) redirect("/blog");
  return <FeedPage page={page} />;
}
