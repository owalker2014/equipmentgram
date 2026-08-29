"use client";

import { useCreateBlog } from "@/lib/network/blog";
import BlogForm from "./blog-form";

type Props = {};

const CreateBlog = ({}: Props) => {
  const mutation = useCreateBlog();

  return (
    <div className="space-y-4">
      <h1 className="font-bold">Create Blog</h1>
      <BlogForm
        submitLabel="Publish post"
        loading={mutation.isLoading}
        onSubmit={(blog) => mutation.mutateAsync(blog)}
      />
    </div>
  );
};

export default CreateBlog;
