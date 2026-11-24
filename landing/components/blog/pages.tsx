// The two kinds of list page, written once and used by four addresses:
//   /blog                      and /blog/page/2, /blog/page/3 ...
//   /blog/category/some-name   and /blog/category/some-name/page/2 ...
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_DESCRIPTION, BLOG_HEADING } from "@/lib/blog/config";
import { getCategoryPage, getFeedPage, getSiteLists } from "@/lib/blog/public-data";
import { blogMetadata, breadcrumbJsonLd, categoryMetadata, categoryPath, feedPath, jsonLdText } from "@/lib/blog/seo";
import ListLayout, { DirectoryList, PostList } from "./ListLayout";
import Pagination from "./Pagination";
import SectionContainer from "./SectionContainer";

export async function feedMetadata(page: number): Promise<Metadata> {
  return blogMetadata(page);
}

export async function FeedPage({ page }: { page: number }) {
  const lists = await getSiteLists();
  const listing = await getFeedPage(page, lists);
  if (!listing) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <SectionContainer wide>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(breadcrumbJsonLd(crumbs)) }} />
      <ListLayout
        heading={BLOG_HEADING}
        description={BLOG_DESCRIPTION}
        categories={lists.categories}
        indexes={lists.indexes}
        currentCategory=""
      >
        <PostList cards={listing.cards} categories={lists.categories} />
        <Pagination currentPage={listing.page} totalPages={listing.totalPages} hrefFor={feedPath} />
      </ListLayout>
    </SectionContainer>
  );
}

export async function categoryPageMetadata(slug: string, page: number): Promise<Metadata> {
  const lists = await getSiteLists();
  const category = lists.categories.find((c) => c.slug === slug);
  if (!category) return { title: "Not found", robots: { index: false, follow: false } };
  return categoryMetadata(category, page);
}

export async function CategoryPage({ slug, page }: { slug: string; page: number }) {
  const lists = await getSiteLists();
  const category = lists.categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const listing = await getCategoryPage(category, page, lists);
  if (!listing) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: category.name, path: categoryPath(category.slug) },
  ];

  return (
    <SectionContainer wide>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(breadcrumbJsonLd(crumbs)) }} />
      <ListLayout
        heading={category.name}
        description={category.description}
        categories={lists.categories}
        indexes={lists.indexes}
        currentCategory={category.slug}
      >
        {category.layout === "directory" ? (
          <DirectoryList cards={listing.cards} />
        ) : (
          <PostList cards={listing.cards} categories={lists.categories} />
        )}
        <Pagination
          currentPage={listing.page}
          totalPages={listing.totalPages}
          hrefFor={(n) => categoryPath(category.slug, n)}
        />
      </ListLayout>
    </SectionContainer>
  );
}
