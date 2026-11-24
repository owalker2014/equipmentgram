import PostEditor from "@/components/studio/PostEditor";

// Blog studio > Posts > (a post) : the editor for an existing post.
export default function Page({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  return <PostEditor key={slug} slug={slug} />;
}
