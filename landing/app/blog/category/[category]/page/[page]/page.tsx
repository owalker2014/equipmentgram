import { notFound, redirect } from "next/navigation";
import { CategoryPage, categoryPageMetadata } from "@/components/blog/pages";
import { categoryPath } from "@/lib/blog/seo";
import { pageNumber, safeDecode } from "@/lib/blog/text";

// /blog/category/some-name/page/2 ... : the later pages of one category.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: { category: string; page: string } };

export function generateMetadata({ params }: Props) {
  return categoryPageMetadata(safeDecode(params.category), pageNumber(params.page) || 1);
}

export default function Page({ params }: Props) {
  const slug = safeDecode(params.category);
  const page = pageNumber(params.page);
  if (!page) notFound();
  if (page === 1) redirect(categoryPath(slug));
  return <CategoryPage slug={slug} page={page} />;
}
