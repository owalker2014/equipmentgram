"use client";

// Blog studio > Categories: the sections of the blog.

import { ActionIcon, Alert, Badge, Button, Group, Loader, Modal, NumberInput, Radio, Stack, Switch, Table, Text, TextInput, Textarea, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconExternalLink, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { deleteCategory, getListingIndexes, saveCategory } from "@/lib/blog/admin-data";
import { categoryIndexId } from "@/lib/blog/keys";
import { slugify, slugProblem } from "@/lib/blog/text";
import type { BlogCategory, ListingIndex } from "@/lib/blog/types";
import { notifyError, notifyOk, useCategories } from "./shared";

function blank(order: number): BlogCategory {
  return { slug: "", name: "", description: "", layout: "list", noindex: false, seoTitle: "", seoDescription: "", order, createdAt: 0, updatedAt: 0 };
}

export default function CategoriesManager() {
  const { categories, loading, error, reload } = useCategories();
  const [indexes, setIndexes] = useState<Record<string, ListingIndex>>({});
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<BlogCategory | null>(null);

  const loadCounts = useCallback(() => {
    getListingIndexes().then(setIndexes).catch(() => setIndexes({}));
  }, []);
  useEffect(loadCounts, [loadCounts]);

  const count = (slug: string) => (indexes[categoryIndexId(slug)] ? indexes[categoryIndexId(slug)].count : 0);

  const openNew = () => {
    setEditing(blank(categories.length + 1));
    setIsNew(true);
    setSlugTouched(false);
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      await saveCategory({ ...editing, name: editing.name.trim(), description: editing.description.trim() }, isNew);
      notifyOk(isNew ? "Category added." : "Category saved.");
      setEditing(null);
      await reload();
      loadCounts();
    } catch (e) {
      notifyError(e);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removing) return;
    setBusy(true);
    try {
      await deleteCategory(removing.slug);
      notifyOk("Category deleted.");
      setRemoving(null);
      await reload();
    } catch (e) {
      notifyError(e);
    } finally {
      setBusy(false);
    }
  };

  const addressProblem = editing && isNew && editing.slug ? slugProblem(editing.slug) : "";

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text c="dimmed" size="sm" maw={640}>
          Every post belongs to one category. Each category gets its own page at /blog/category/its-address and appears in the side panel of the blog.
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={openNew} className="bg-blue-700">
          New category
        </Button>
      </Group>

      {error && (
        <Alert color="red" title="The categories could not be loaded" icon={<IconAlertTriangle size={18} />} mb="md">
          {error}
        </Alert>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Shown as</Table.Th>
              <Table.Th>Published posts</Table.Th>
              <Table.Th>Order</Table.Th>
              <Table.Th w={120} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((category) => (
              <Table.Tr key={category.slug}>
                <Table.Td>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-xs text-gray-500">/blog/category/{category.slug}</div>
                </Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    <Badge variant="light" color={category.layout === "directory" ? "grape" : "blue"}>
                      {category.layout === "directory" ? "A to Z list of links" : "Posts, newest first"}
                    </Badge>
                    {category.noindex && (
                      <Badge variant="light" color="gray">
                        Hidden from Google
                      </Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>{count(category.slug)}</Table.Td>
                <Table.Td>{category.order}</Table.Td>
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Edit" withArrow>
                      <ActionIcon
                        variant="subtle"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => {
                          setEditing(category);
                          setIsNew(false);
                        }}
                      >
                        <IconPencil size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="View on site" withArrow>
                      <ActionIcon component="a" href={`/blog/category/${category.slug}`} target="_blank" rel="noopener" variant="subtle" color="gray" aria-label={`View ${category.name} on the site`}>
                        <IconExternalLink size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete" withArrow>
                      <ActionIcon variant="subtle" color="red" aria-label={`Delete ${category.name}`} onClick={() => setRemoving(category)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!loading && categories.length === 0 && !error && (
          <div className="px-4 py-12 text-center text-gray-500">No categories yet. Add one before you publish your first post.</div>
        )}
        {loading && (
          <Group justify="center" py="lg">
            <Loader size="sm" />
          </Group>
        )}
      </div>

      <Modal opened={!!editing} onClose={() => !busy && setEditing(null)} title={isNew ? "New category" : "Edit category"} centered size="lg">
        {editing && (
          <Stack>
            <TextInput
              label="Name"
              placeholder="Buying guides"
              value={editing.name}
              onChange={(event) => {
                const name = event.currentTarget.value;
                setEditing(isNew && !slugTouched ? { ...editing, name, slug: slugify(name) } : { ...editing, name });
              }}
              data-autofocus
            />
            {isNew ? (
              <TextInput
                label="Address"
                description="Becomes part of the web address and cannot be changed later."
                leftSection={<Text size="sm" c="dimmed">/blog/category/</Text>}
                leftSectionWidth={112}
                value={editing.slug}
                error={addressProblem || undefined}
                onChange={(event) => {
                  setSlugTouched(true);
                  setEditing({ ...editing, slug: event.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") });
                }}
              />
            ) : (
              <Text size="sm" c="dimmed">
                Address: /blog/category/{editing.slug}
              </Text>
            )}
            <Textarea
              label="Description"
              description="One or two sentences shown under the heading of the category page and in Google."
              autosize
              minRows={2}
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.currentTarget.value })}
            />
            <Radio.Group
              label="How should its page list the posts?"
              value={editing.layout}
              onChange={(value) => setEditing({ ...editing, layout: value === "directory" ? "directory" : "list" })}
            >
              <Stack gap="xs" mt="xs">
                <Radio value="list" label="Posts, newest first" description="Title, date, summary and picture. Right for articles you write by hand." />
                <Radio value="directory" label="A to Z list of links" description="A compact list of short names, 60 to a page. Right for large sets of similar pages made with Bulk pages." />
              </Stack>
            </Radio.Group>
            <NumberInput
              label="Order in the side panel"
              description="Lower numbers come first."
              value={editing.order}
              onChange={(value) => setEditing({ ...editing, order: typeof value === "number" ? value : Number(value) || 0 })}
              min={0}
              max={999}
              w={200}
            />
            <Switch
              label="Hide this category and its posts from Google"
              description="Useful while you prepare a new set of pages. Turn it off when they are ready."
              checked={editing.noindex}
              onChange={(event) => setEditing({ ...editing, noindex: event.currentTarget.checked })}
            />
            <TextInput
              label="Title for Google (optional)"
              description="Leave empty to use the name."
              value={editing.seoTitle}
              onChange={(event) => setEditing({ ...editing, seoTitle: event.currentTarget.value })}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setEditing(null)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={save} loading={busy} disabled={!editing.name.trim() || !editing.slug || !!addressProblem} className="bg-blue-700">
                {isNew ? "Add category" : "Save"}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal opened={!!removing} onClose={() => !busy && setRemoving(null)} title="Delete this category?" centered>
        <Stack>
          <Text size="sm">
            {removing?.name} will be removed from the blog. A category that still has posts, drafts included, cannot be deleted: move or delete those first.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setRemoving(null)} disabled={busy}>
              Cancel
            </Button>
            <Button color="red" onClick={remove} loading={busy}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
