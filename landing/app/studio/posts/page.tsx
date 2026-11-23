import { Suspense } from "react";
import PostsManager from "@/components/studio/PostsManager";

// Blog studio > Posts : the list of posts.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PostsManager />
    </Suspense>
  );
}
