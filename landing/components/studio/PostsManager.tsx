"use client";

// Blog studio > Posts: every post, with its status, and the buttons to manage many at once.

import { ActionIcon, Alert, Badge, Button, Checkbox, Group, Loader, Modal, Progress, Select, Stack, Table, Text, TextInput, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconExternalLink, IconPencil, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import type { DocumentSnapshot } from "firebase/firestore/lite";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { friendlyError, listPosts, publishMany, removeMany, type PostFilter, type Skipped } from "@/lib/blog/admin-data";
import type { BlogPost, BlogStatus } from "@/lib/blog/types";
import { notifyError, notifyOk, shortDateTime, useCategories } from "./shared";

type BulkAction = "publish" | "unpublish" | "delete";

// The "no filter" choice in the category box. A real category address never contains a space.
const ANY = "any category";

const ACTION_WORDS: Record<BulkAction, { title: string; button: string; color: string; done: string }> = {
  publish: { title: "Publish the selected posts?", button: "Publish", color: "blue", done: "published" },
  unpublish: { title: "Unpublish the selected posts?", button: "Unpublish", color: "orange", done: "unpublished" },
  delete: { title: "Delete the selected posts?", button: "Delete for good", color: "red", done: "deleted" },
};

export default function PostsManager() {
  const router = useRouter();
  const params = useSearchParams();
  const batchId = params.get("batch") || "";
  const { categories } = useCategories();

  const [status, setStatus] = useState<BlogStatus | "">("");
  const [categorySlug, setCategorySlug] = useState("");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [action, setAction] = useState<BulkAction | "">("");
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [skipped, setSkipped] = useState<Skipped[]>([]);
  const cursor = useRef<DocumentSnapshot | null>(null);
  const request = useRef(0);

  const filter: PostFilter = useMemo(() => ({ status, categorySlug, batchId }), [status, categorySlug, batchId]);

  const load = useCallback(
    async (reset: boolean, everything = false) => {
      const mine = ++request.current;
      setLoading(true);
      try {
        let next = reset ? null : cursor.current;
        let hasMore = true;
        const fetched: BlogPost[] = [];
        do {
          const page = await listPosts(filter, next, everything ? 200 : 50);
          fetched.push(...page.posts);
          next = page.cursor;
          hasMore = page.more;
        } while (everything && hasMore && fetched.length < 5000 && mine === request.current);
        // A newer request (for example a changed filter) makes this answer out of date.
        if (mine !== request.current) return;
        cursor.current = next;
        setMore(hasMore);
        setPosts((current) => (reset ? fetched : [...current, ...fetched]));
        if (reset) setSelected(new Set());
        setError("");
      } catch (e) {
        if (mine === request.current) setError(friendlyError(e));
      } finally {
        if (mine === request.current) setLoading(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    load(true);
  }, [load]);

  const names = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);
  const visible = useMemo(() => {
    const words = search.trim().toLowerCase();
    if (!words) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(words) || p.slug.includes(words));
  }, [posts, search]);

  const chosen = visible.filter((p) => selected.has(p.slug));
  const allChosen = visible.length > 0 && chosen.length === visible.length;

  const toggle = (slug: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const runAction = async () => {
    if (!action) return;
    setWorking(true);
    setProgress(0);
    setSkipped([]);
    const onProgress = (done: number, total: number) => setProgress(total ? Math.round((done / total) * 100) : 100);
    try {
      let done = 0;
      if (action === "publish") {
        const result = await publishMany(chosen, categories, onProgress);
        done = result.done;
        setSkipped(result.skipped);
      } else {
        done = (await removeMany(chosen, action, categories, onProgress)).done;
      }
      notifyOk(`${done} ${done === 1 ? "post" : "posts"} ${ACTION_WORDS[action].done}.`);
      setAction("");
      await load(true);
    } catch (e) {
      notifyError(e);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="md" wrap="wrap">
        <Group gap="sm" wrap="wrap">
          <TextInput
            aria-label="Search the posts shown"
            placeholder="Search titles"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            w={220}
          />
          <Select
            aria-label="Status"
            data={[
              { value: "any", label: "Any status" },
              { value: "draft", label: "Drafts" },
              { value: "published", label: "Published" },
            ]}
            value={status || "any"}
            onChange={(value) => setStatus(value === "draft" || value === "published" ? value : "")}
            allowDeselect={false}
            w={150}
          />
          <Select
            aria-label="Category"
            data={[{ value: ANY, label: "Any category" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
            value={categorySlug || ANY}
            onChange={(value) => setCategorySlug(!value || value === ANY ? "" : value)}
            allowDeselect={false}
            w={230}
          />
          {batchId && (
            <Badge
              size="lg"
              variant="light"
              rightSection={
                <ActionIcon size="xs" variant="transparent" aria-label="Show all posts again" onClick={() => router.push("/studio/posts")}>
                  <IconX size={12} />
                </ActionIcon>
              }
            >
              Bulk run: {batchId}
            </Badge>
          )}
        </Group>
        <Button component={Link} href="/studio/posts/new" leftSection={<IconPlus size={16} />} className="bg-blue-700">
          New post
        </Button>
      </Group>

      {error && (
        <Alert color="red" title="The posts could not be loaded" icon={<IconAlertTriangle size={18} />} mb="md">
          {error}
        </Alert>
      )}

      {skipped.length > 0 && (
        <Alert color="yellow" title={`${skipped.length} not published`} mb="md" withCloseButton onClose={() => setSkipped([])}>
          <ul className="list-disc pl-5">
            {skipped.slice(0, 8).map((item) => (
              <li key={item.slug}>
                <b>{item.slug}</b>: {item.reason}
              </li>
            ))}
            {skipped.length > 8 && <li>and {skipped.length - 8} more</li>}
          </ul>
        </Alert>
      )}

      {chosen.length > 0 && (
        <Group mb="md" gap="sm" className="rounded-lg bg-blue-50 px-4 py-2">
          <Text size="sm" fw={600}>
            {chosen.length} selected
          </Text>
          <Button size="xs" onClick={() => setAction("publish")} className="bg-blue-700">
            Publish
          </Button>
          <Button size="xs" variant="default" onClick={() => setAction("unpublish")}>
            Unpublish
          </Button>
          <Button size="xs" variant="light" color="red" onClick={() => setAction("delete")}>
            Delete
          </Button>
        </Group>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  aria-label="Select all posts shown"
                  checked={allChosen}
                  indeterminate={chosen.length > 0 && !allChosen}
                  onChange={() => setSelected(allChosen ? new Set() : new Set(visible.map((p) => p.slug)))}
                />
              </Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last saved</Table.Th>
              <Table.Th w={90} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visible.map((post) => (
              <Table.Tr key={post.slug}>
                <Table.Td>
                  <Checkbox aria-label={`Select ${post.title}`} checked={selected.has(post.slug)} onChange={() => toggle(post.slug)} />
                </Table.Td>
                <Table.Td>
                  <Link href={`/studio/posts/edit/${post.slug}`} className="font-medium text-gray-900 hover:text-blue-700">
                    {post.title || "(no title)"}
                  </Link>
                  <div className="text-xs text-gray-500">/blog/{post.slug}</div>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{names.get(post.categorySlug) || <span className="text-gray-400">None</span>}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    <Badge color={post.status === "published" ? "green" : "gray"} variant="light">
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    {post.status === "published" && post.hasChanges && (
                      <Badge color="orange" variant="light">
                        Edits not live
                      </Badge>
                    )}
                    {post.source === "bulk" && (
                      <Badge color="blue" variant="outline">
                        Bulk
                      </Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {shortDateTime(post.updatedAt)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Edit" withArrow>
                      <ActionIcon component={Link} href={`/studio/posts/edit/${post.slug}`} variant="subtle" aria-label={`Edit ${post.title}`}>
                        <IconPencil size={18} />
                      </ActionIcon>
                    </Tooltip>
                    {post.status === "published" && (
                      <Tooltip label="View on site" withArrow>
                        <ActionIcon component="a" href={`/blog/${post.slug}`} target="_blank" rel="noopener" variant="subtle" color="gray" aria-label={`View ${post.title} on the site`}>
                          <IconExternalLink size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!loading && visible.length === 0 && !error && (
          <div className="px-4 py-12 text-center text-gray-500">
            {posts.length ? "No post matches your search." : "No posts yet. Press New post to write the first one."}
          </div>
        )}
        {loading && (
          <Group justify="center" py="lg">
            <Loader size="sm" />
          </Group>
        )}
      </div>

      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          Showing {visible.length} {visible.length === 1 ? "post" : "posts"}
          {more ? " (there are more)" : ""}
        </Text>
        {more && (
          <Group gap="xs">
            <Button variant="default" size="xs" onClick={() => load(false)} disabled={loading}>
              Load 50 more
            </Button>
            <Button variant="default" size="xs" onClick={() => load(false, true)} disabled={loading}>
              Load all
            </Button>
          </Group>
        )}
      </Group>

      <Modal opened={!!action} onClose={() => !working && setAction("")} title={action ? ACTION_WORDS[action].title : ""} centered>
        {action && (
          <Stack>
            <Text size="sm">
              {action === "publish" && `${chosen.length} ${chosen.length === 1 ? "post goes" : "posts go"} live on the site. Posts that are missing a category or a summary are skipped and listed afterwards.`}
              {action === "unpublish" && `${chosen.length} ${chosen.length === 1 ? "post is" : "posts are"} taken off the site and kept as drafts.`}
              {action === "delete" && `${chosen.length} ${chosen.length === 1 ? "post is" : "posts are"} removed from the site and deleted. This cannot be undone.`}
            </Text>
            {working && <Progress value={progress} animated />}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setAction("")} disabled={working}>
                Cancel
              </Button>
              <Button color={ACTION_WORDS[action].color} onClick={runAction} loading={working}>
                {ACTION_WORDS[action].button}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
