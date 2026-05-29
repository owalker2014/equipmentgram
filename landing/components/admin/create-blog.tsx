"use client";

import { useCategories, useCreateBlog } from "@/lib/network/blog";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import UploadFileField from "../forms/upload-file-field";

type Props = {};

const CreateBlog = ({}: Props) => {
  const editor = useRef(null);
  const [content, setContent] = useState<any>("");
  const [imageUrl, setImageUrl] = useState<any>("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const mutation = useCreateBlog();

  const onCreateNewBlog = async () => {
    await mutation.mutateAsync({
      category: {
        name: category,
      },
      content: content,
      created_at: new Date().toISOString(),
      title: title,
      updated_at: new Date().toISOString(),
    });

    //reset
    setContent("");
    setImageUrl("");
    setTitle("");
    setCategory("");
  };

  const { data: categories } = useCategories();

  return (
    <div className="max-w-screen-lg space-y-4">
      <h1 className=" font-bold">Create Blog</h1>

      <TextInput value={title} onChange={(e) => setTitle(e.currentTarget.value)} label="Title" placeholder="Title" />

      <div className="grid grid-cols-2 gap-4">
        <UploadFileField fileName={title} onUploadComplete={(url) => setImageUrl(url)} />
        <Autocomplete
          value={category}
          label="Category"
          placeholder="Pick value or enter anything"
          data={categories?.map((category) => category.name)}
          onChange={(value) => setCategory(value)}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {imageUrl && <img className="max-h-[200px]" src={imageUrl} alt="" />}
      </div>

      <div>
        <label className="text-md font-medium">Content</label>
        <JoditEditor
          ref={editor}
          value={content}
          config={{
            readonly: false, // all options from https://xdsoft.net/jodit/doc/
          }}
          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {
            // console.log(newContent);
          }}
        />
      </div>

      <Button loading={mutation.isLoading} onClick={onCreateNewBlog}>
        Create Blog
      </Button>
    </div>
  );
};

export default CreateBlog;
