import { CategoryPage, categoryPageMetadata } from "@/components/blog/pages";
import { safeDecode } from "@/lib/blog/text";

// /blog/category/some-name : the first page of one category.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: { category: string } };

export function generateMetadata({ params }: Props) {
  return categoryPageMetadata(safeDecode(params.category), 1);
}

export default function Page({ params }: Props) {
  return <CategoryPage slug={safeDecode(params.category)} page={1} />;
}
