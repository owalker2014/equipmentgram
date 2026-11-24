import { FeedPage, feedMetadata } from "@/components/blog/pages";

// /blog : the first page of the list of posts.
// "revalidate" is how many seconds a finished page is reused before it is rebuilt.
export const revalidate = 60;

export function generateMetadata() {
  return feedMetadata(1);
}

export default function Page() {
  return <FeedPage page={1} />;
}
