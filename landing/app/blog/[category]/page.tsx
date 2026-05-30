"use client";

import CustomLoader from "@/components/Loader";
import NoBlogFound from "@/components/NoBlogFound";
import { ArticleCard } from "@/components/sections/blog/article-card";
import { useBlogByCategory } from "@/lib/network/blog";

export default function CategoryRoute({ params }: { params: { category: string } }) {
  const { category } = params;
  const { data, isLoading } = useBlogByCategory(category);

  if (isLoading) return <CustomLoader />;

  if (data?.length === 0) return <NoBlogFound />;

  console.log(data);

  return (
    <div>
      <h1 className="text-4xl text-center mt-10 font-bold">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-10 max-w-screen-xl mx-auto container px-4 my-20">
        {data?.map((article) => {
          return <ArticleCard key={article.id} {...article} />;
        })}
      </div>
    </div>
  );
}
