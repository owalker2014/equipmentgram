"use client";

import CreateCategory from "@/components/sections/blog/create-category";
import { Tabs } from "@mantine/core";
import dynamic from "next/dynamic";
import React from "react";

const CreateBlog = dynamic(() => import("@/components/admin/create-blog"), { ssr: false });
const ManageBlogs = dynamic(() => import("@/components/admin/manage-blogs"), { ssr: false });

type Props = {};

const AdminTools = (props: Props) => {
  return (
    <Tabs defaultValue="blog" orientation="vertical">
      <Tabs.List miw={200}>
        <Tabs.Tab value="blog">Create Blog</Tabs.Tab>
        <Tabs.Tab value="manage">Manage Posts</Tabs.Tab>
        <Tabs.Tab value="category">Create Category</Tabs.Tab>
      </Tabs.List>

      <div className="px-10 w-full">
        <Tabs.Panel value="blog">
          <CreateBlog />
        </Tabs.Panel>
        <Tabs.Panel value="manage">
          <ManageBlogs />
        </Tabs.Panel>
        <Tabs.Panel value="category">
          <CreateCategory />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};

export default AdminTools;
