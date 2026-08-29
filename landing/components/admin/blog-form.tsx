"use client";

import { slugify } from "@/lib/blog/slug";
import { IBlog, IBlogWithId, useCategories } from "@/lib/network/blog";
import { Autocomplete, Button, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import UploadFileField from "../forms/upload-file-field";

/** Google truncates meta descriptions past roughly this many characters. */
const EXCERPT_LIMIT = 155;

type BlogFormProps = {
  /** Pass an existing post to edit it; leave empty to write a new one. */
  post?: IBlogWithId;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (blog: IBlog) => Promise<unknown>;
};

/**
 * The write/edit form. Shared by "Create Blog" and "Manage Posts" so the two
 * screens can never drift apart.
 */
export default function BlogForm({ post, submitLabel, loading, onSubmit }: BlogFormProps) {
  const editor = useRef(null);
  const [content, setContent] = useState<string>(post?.content || "");
  const [imageUrl, setImageUrl] = useState<string>(post?.imageUrl || "");
  const [title, setTitle] = useState(post?.title || "");
  const [category, setCategory] = useState(post?.category?.name || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [author, setAuthor] = useState(post?.author || "");

  // The slug follows the title until you type your own, then it stays put.
  const effectiveSlug = useMemo(() => slugify(slug || title), [slug, title]);

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim() || !content) {
      notifications.show({ message: "Title, category and content are all required.", color: "red" });
      return;
    }

    await onSubmit({
      category: { name: category.trim() },
      content,
      // On the old form the uploaded cover image was never saved with the post.
      imageUrl: imageUrl || undefined,
      slug: effectiveSlug,
      excerpt: excerpt.trim() || undefined,
      author: author.trim() || undefined,
      created_at: post?.created_at || new Date().toISOString(),
      title: title.trim(),
      updated_at: new Date().toISOString(),
    });

    notifications.show({
      message: `Saved. Live at /blog/${slugify(category)}/${effectiveSlug} within a minute.`,
      color: "green",
    });

    if (!post) {
      setContent("");
      setImageUrl("");
      setTitle("");
      setCategory("");
      setSlug("");
      setExcerpt("");
      setAuthor("");
    }
  };

  const { data: categories } = useCategories();

  return (
    <div className="max-w-screen-lg space-y-4">
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        label="Title"
        description="This becomes the blue headline in Google. Aim for under 60 characters and lead with the phrase people search for."
        placeholder="How to inspect a used excavator before you buy"
        withAsterisk
      />

      <TextInput
        value={slug}
        onChange={(e) => setSlug(e.currentTarget.value)}
        label="URL slug"
        description={`Leave blank to build it from the title. This post lives at /blog/${
          slugify(category) || "category"
        }/${effectiveSlug || "..."}`}
        placeholder="how-to-inspect-a-used-excavator"
      />

      <Textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.currentTarget.value)}
        label="Meta description"
        description={`The grey summary under the Google result. ${excerpt.length}/${EXCERPT_LIMIT} characters. Leave blank to use the opening sentences.`}
        placeholder="A step-by-step checklist for spotting hydraulic leaks, undercarriage wear and engine trouble before you buy a used excavator."
        autosize
        minRows={2}
        error={excerpt.length > EXCERPT_LIMIT ? "Too long — Google will cut this off." : undefined}
      />

      <div className="grid grid-cols-2 gap-4">
        <UploadFileField fileName={title} onUploadComplete={(url) => setImageUrl(url)} />
        <Autocomplete
          value={category}
          label="Category"
          placeholder="Pick a value or type a new one"
          data={categories?.map((entry) => entry.name)}
          onChange={setCategory}
          withAsterisk
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {imageUrl && <img className="max-h-[200px]" src={imageUrl} alt="" />}
      </div>

      <TextInput
        value={author}
        onChange={(e) => setAuthor(e.currentTarget.value)}
        label="Author"
        description="Shown on the article and sent to Google as structured data."
        placeholder="Tobi Walker"
      />

      <div>
        <label className="text-md font-medium">Content</label>
        <JoditEditor
          ref={editor}
          value={content}
          config={{ readonly: false }}
          // Jodit only reports the final value on blur, which is cheaper than
          // re-rendering on every keystroke.
          onBlur={(newContent) => setContent(newContent)}
          onChange={() => {}}
        />
      </div>

      <Button loading={loading} onClick={handleSubmit}>
        {submitLabel}
      </Button>
    </div>
  );
}
