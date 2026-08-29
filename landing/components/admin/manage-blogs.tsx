"use client";

import { slugify } from "@/lib/blog/slug";
import { IBlogWithId, useBlogs, useUpdateBlog } from "@/lib/network/blog";
import { Button, Loader, Table } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import BlogForm from "./blog-form";

type Props = {};

/**
 * Lists existing posts and lets an admin edit one. Refreshing and expanding
 * older articles is a large part of SEO work, so this needs to be easy.
 */
const ManageBlogs = ({}: Props) => {
  const { data: posts, isLoading } = useBlogs();
  const [editing, setEditing] = useState<IBlogWithId | null>(null);
  const mutation = useUpdateBlog();

  if (isLoading) return <Loader />;

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">Editing: {editing.title}</h1>
          <Button variant="subtle" onClick={() => setEditing(null)}>
            Back to all posts
          </Button>
        </div>
        <BlogForm
          post={editing}
          submitLabel="Save changes"
          loading={mutation.isLoading}
          onSubmit={async (blog) => {
            await mutation.mutateAsync({ ...blog, id: editing.id });
            setEditing(null);
          }}
        />
      </div>
    );
  }

  if (!posts || posts.length === 0) return <p>No posts yet. Use the “Create Blog” tab to write the first one.</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-bold">Manage Posts</h1>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Meta description</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {posts.map((post) => (
            <Table.Tr key={post.id}>
              <Table.Td>
                <Link
                  href={`/blog/${slugify(post.category?.name || "")}/${post.slug || post.id}`}
                  target="_blank"
                  className="text-blue-700 hover:underline"
                >
                  {post.title || "Untitled"}
                </Link>
              </Table.Td>
              <Table.Td>{post.category?.name}</Table.Td>
              <Table.Td>
                {post.excerpt ? (
                  <span className="text-sm text-gray-600">{post.excerpt.slice(0, 60)}…</span>
                ) : (
                  <span className="text-sm text-orange-600">Missing — add one for better search results</span>
                )}
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="light" onClick={() => setEditing(post)}>
                  Edit
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default ManageBlogs;
