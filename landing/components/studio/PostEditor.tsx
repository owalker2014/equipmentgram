"use client";

/* eslint-disable @next/next/no-img-element */
// The screen where a post is written: Blog studio > New post, or the pencil next to a post.

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  FileButton,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconAlertTriangle, IconChevronLeft, IconExternalLink, IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  deletePost,
  friendlyError,
  getPost,
  publishPost,
  publishProblems,
  renameDraft,
  saveDraft,
  saveProblems,
  unpublishPost,
} from "@/lib/blog/admin-data";
import PostLayout from "@/components/blog/PostLayout";
import { DEFAULT_AUTHOR, SITE_URL } from "@/lib/blog/config";
import { toLive } from "@/lib/blog/keys";
import { withSiteName } from "@/lib/blog/seo";
import { clip, slugify, slugProblem } from "@/lib/blog/text";
import type { BlogPost } from "@/lib/blog/types";
import { uploadBlogImage } from "@/lib/blog/upload";
import RichEditor from "./RichEditor";
import { emptyPost, notifyError, notifyOk, shortDateTime, useCategories } from "./shared";

const siteHost = SITE_URL.replace(/^https?:\/\//, "");

function Counter({ length, good }: { length: number; good: number }) {
  return (
    <Text span size="xs" c={length > good ? "orange" : "dimmed"}>
      {length} / {good}
    </Text>
  );
}

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Text fw={700} mb="sm">
        {title}
      </Text>
      <Stack gap="sm">{children}</Stack>
    </Paper>
  );
}

export default function PostEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const { categories, loading: loadingCategories } = useCategories();
  const [post, setPost] = useState<BlogPost | null>(slug ? null : emptyPost());
  const [isNew, setIsNew] = useState(!slug);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saved, setSaved] = useState(""); // what is stored, as text, to spot unsaved changes
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState<"" | "save" | "publish" | "unpublish" | "delete" | "cover" | "rename">("");
  const [problems, setProblems] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<"" | "unpublish" | "delete">("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Open an existing post.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    getPost(slug)
      .then((found) => {
        if (cancelled) return;
        if (!found) setMissing(true);
        else {
          setPost(found);
          setSaved(JSON.stringify(found));
        }
      })
      .catch((error) => !cancelled && setLoadError(friendlyError(error)));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const dirty = !!post && JSON.stringify(post) !== saved && (!isNew || !!post.title || !!post.contentHtml);

  // Warn before the tab is closed with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const change = useCallback((patch: Partial<BlogPost>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const categoryOptions = useMemo(() => categories.map((c) => ({ value: c.slug, label: c.name })), [categories]);

  if (loadError) {
    return (
      <Alert color="red" title="The post could not be opened" icon={<IconAlertTriangle size={18} />}>
        {loadError}
      </Alert>
    );
  }
  if (missing) {
    return (
      <Alert color="yellow" title="No post has this address">
        It may have been deleted or renamed.{" "}
        <Link href="/studio/posts" className="text-blue-700 underline">
          Back to all posts
        </Link>
      </Alert>
    );
  }
  if (!post) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  const published = post.status === "published";
  const addressProblem = isNew && post.slug ? slugProblem(post.slug) : "";
  const googleTitle = clip(withSiteName(post.seoTitle || post.title || "Your title"), 70);
  const googleText = clip(post.seoDescription || post.summary || "Your summary appears here.", 160);

  const run = async (what: typeof busy, work: () => Promise<void>) => {
    setBusy(what);
    setProblems([]);
    try {
      await work();
    } catch (error) {
      notifyError(error);
    } finally {
      setBusy("");
    }
  };

  const afterSave = (stored: BlogPost, message: string) => {
    setPost(stored);
    setSaved(JSON.stringify(stored));
    notifyOk(message);
    if (isNew) {
      setIsNew(false);
      router.replace(`/studio/posts/edit/${stored.slug}`);
    }
  };

  const onSave = () => {
    const found = saveProblems(post);
    if (found.length) return setProblems(found);
    run("save", async () => {
      const stored = await saveDraft(post, isNew);
      afterSave(stored, published ? "Saved. Visitors still see the earlier version until you press Update." : "Draft saved.");
    });
  };

  const onPublish = () => {
    const found = publishProblems(post, categories);
    if (found.length) return setProblems(found);
    run("publish", async () => {
      let base = post;
      const wasNew = isNew;
      if (wasNew) {
        // A new post is saved first, which also checks that its address is free.
        base = await saveDraft(post, true);
        setIsNew(false);
        setPost(base);
        setSaved(JSON.stringify(base));
      }
      const stored = await publishPost(base, categories);
      setPost(stored);
      setSaved(JSON.stringify(stored));
      notifyOk(published ? "Updated. The site shows the new version." : "Published. The post is live.");
      if (wasNew) router.replace(`/studio/posts/edit/${stored.slug}`);
    });
  };

  const onUnpublish = () =>
    run("unpublish", async () => {
      const stored = await unpublishPost(post, categories);
      setConfirm("");
      afterSave(stored, "Unpublished. The post is a draft again.");
    });

  const onDelete = () =>
    run("delete", async () => {
      await deletePost(post, categories);
      setSaved(JSON.stringify(post));
      notifyOk("Post deleted.");
      router.push("/studio/posts");
    });

  const onRename = () =>
    run("rename", async () => {
      const moved = await renameDraft(post, slugify(newSlug));
      setRenameOpen(false);
      setPost(moved);
      setSaved(JSON.stringify(moved));
      notifyOk("Address changed.");
      router.replace(`/studio/posts/edit/${moved.slug}`);
    });

  const onCover = (file: File | null) => {
    if (!file) return;
    if (!post.slug) return setProblems(["Give the post a title before adding a picture."]);
    run("cover", async () => {
      const uploaded = await uploadBlogImage(file, post.slug);
      change({ coverUrl: uploaded.url });
    });
  };

  return (
    <div>
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="sm">
          <Button component={Link} href="/studio/posts" variant="subtle" leftSection={<IconChevronLeft size={16} />} px="xs">
            All posts
          </Button>
          <Badge color={published ? "green" : "gray"} variant="light" size="lg">
            {published ? "Published" : "Draft"}
          </Badge>
          {published && post.hasChanges && (
            <Badge color="orange" variant="light" size="lg">
              Edits not yet live
            </Badge>
          )}
          {dirty && (
            <Text size="sm" c="orange">
              Unsaved changes
            </Text>
          )}
        </Group>
        <Group gap="sm">
          {published && (
            <Button
              component="a"
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener"
              variant="default"
              rightSection={<IconExternalLink size={16} />}
            >
              View on site
            </Button>
          )}
          <Button variant="default" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          <Button variant="default" onClick={onSave} loading={busy === "save"} disabled={!!busy && busy !== "save"}>
            {published ? "Save without publishing" : "Save draft"}
          </Button>
          <Button onClick={onPublish} loading={busy === "publish"} disabled={!!busy && busy !== "publish"} className="bg-blue-700">
            {published ? "Update" : "Publish"}
          </Button>
        </Group>
      </Group>

      {problems.length > 0 && (
        <Alert color="red" title="Please fix this first" icon={<IconAlertTriangle size={18} />} mb="lg" withCloseButton onClose={() => setProblems([])}>
          <ul className="list-disc pl-5">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <TextInput
            label="Title"
            size="lg"
            placeholder="How to inspect a used excavator"
            value={post.title}
            onChange={(event) => {
              const title = event.currentTarget.value;
              change(isNew && !slugTouched ? { title, slug: slugify(title) } : { title });
            }}
          />

          {isNew ? (
            <TextInput
              label="Address"
              description="The end of the post's web address. It cannot be changed after the post is published."
              leftSection={<Text size="sm" c="dimmed">/blog/</Text>}
              leftSectionWidth={54}
              value={post.slug}
              error={addressProblem || undefined}
              onChange={(event) => {
                setSlugTouched(true);
                change({ slug: event.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") });
              }}
            />
          ) : (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Address: {siteHost}/blog/<b>{post.slug}</b>
              </Text>
              {!published && (
                <Button
                  size="compact-xs"
                  variant="subtle"
                  onClick={() => {
                    setNewSlug(post.slug);
                    setRenameOpen(true);
                  }}
                >
                  Change
                </Button>
              )}
            </Group>
          )}

          <Textarea
            label={
              <Group gap="xs">
                <span>Summary</span>
                <Counter length={post.summary.length} good={160} />
              </Group>
            }
            description="One or two sentences. Shown in the list of posts and, usually, under the title in Google."
            autosize
            minRows={2}
            value={post.summary}
            onChange={(event) => change({ summary: event.currentTarget.value })}
          />

          <div>
            <Text size="sm" fw={500} mb={4}>
              Post text
            </Text>
            <RichEditor
              key={slug || "new"}
              initialHtml={post.contentHtml}
              onChange={(html) => change({ contentHtml: html })}
              onUploadImage={(file) => {
                if (!post.slug) return Promise.reject(new Error("Give the post a title before adding a picture."));
                return uploadBlogImage(file, post.slug);
              }}
            />
          </div>

          <Box title="Key facts (optional)">
            <Text size="sm" c="dimmed">
              Short facts shown in a blue box at the top of the post, for example Time needed: 45 minutes.
            </Text>
            {post.facts.map((fact, i) => (
              <Group key={i} gap="xs" align="flex-end" wrap="nowrap">
                <TextInput
                  className="w-1/3"
                  aria-label={`Fact ${i + 1} name`}
                  placeholder="Time needed"
                  value={fact.label}
                  onChange={(event) => {
                    const label = event.currentTarget.value;
                    change({ facts: post.facts.map((f, j) => (j === i ? { ...f, label } : f)) });
                  }}
                />
                <TextInput
                  className="flex-1"
                  aria-label={`Fact ${i + 1} value`}
                  placeholder="45 to 60 minutes"
                  value={fact.value}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    change({ facts: post.facts.map((f, j) => (j === i ? { ...f, value } : f)) });
                  }}
                />
                <ActionIcon variant="subtle" color="red" size="lg" aria-label={`Remove fact ${i + 1}`} onClick={() => change({ facts: post.facts.filter((_, j) => j !== i) })}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            ))}
            <div>
              <Button variant="light" size="xs" leftSection={<IconPlus size={14} />} onClick={() => change({ facts: [...post.facts, { label: "", value: "" }] })}>
                Add a fact
              </Button>
            </div>
          </Box>

          <Box title="Questions and answers (optional)">
            <Text size="sm" c="dimmed">
              Shown at the end of the post under the heading Common questions.
            </Text>
            {post.faq.map((item, i) => (
              <Group key={i} gap="xs" align="flex-start" wrap="nowrap">
                <Stack gap={6} className="flex-1">
                  <TextInput
                    aria-label={`Question ${i + 1}`}
                    placeholder="Can I do this inspection myself?"
                    value={item.q}
                    onChange={(event) => {
                      const q = event.currentTarget.value;
                      change({ faq: post.faq.map((f, j) => (j === i ? { ...f, q } : f)) });
                    }}
                  />
                  <Textarea
                    aria-label={`Answer ${i + 1}`}
                    placeholder="The answer, in a few sentences."
                    autosize
                    minRows={2}
                    value={item.a}
                    onChange={(event) => {
                      const a = event.currentTarget.value;
                      change({ faq: post.faq.map((f, j) => (j === i ? { ...f, a } : f)) });
                    }}
                  />
                </Stack>
                <ActionIcon variant="subtle" color="red" size="lg" aria-label={`Remove question ${i + 1}`} onClick={() => change({ faq: post.faq.filter((_, j) => j !== i) })}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            ))}
            <div>
              <Button variant="light" size="xs" leftSection={<IconPlus size={14} />} onClick={() => change({ faq: [...post.faq, { q: "", a: "" }] })}>
                Add a question
              </Button>
            </div>
          </Box>
        </div>

        <div className="space-y-5">
          <Box title="Category">
            <Select
              aria-label="Category"
              placeholder={loadingCategories ? "Loading..." : "Choose a category"}
              data={categoryOptions}
              value={post.categorySlug || null}
              onChange={(value) => change({ categorySlug: value || "" })}
              searchable
              nothingFoundMessage="No such category"
            />
            <Text size="xs" c="dimmed">
              Need a new one?{" "}
              <Link href="/studio/categories" className="text-blue-700 underline">
                Manage categories
              </Link>
            </Text>
          </Box>

          <Box title="Cover picture">
            {post.coverUrl ? (
              <img src={post.coverUrl} alt="" className="aspect-[2/1] w-full rounded-lg object-cover" />
            ) : (
              <div className="flex aspect-[2/1] w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                No picture yet
              </div>
            )}
            <Group gap="xs">
              <FileButton onChange={onCover} accept="image/jpeg,image/png,image/webp">
                {(props) => (
                  <Button {...props} variant="default" size="xs" loading={busy === "cover"}>
                    {post.coverUrl ? "Replace picture" : "Upload picture"}
                  </Button>
                )}
              </FileButton>
              {post.coverUrl && (
                <Button variant="subtle" color="red" size="xs" onClick={() => change({ coverUrl: "", coverAlt: "" })}>
                  Remove
                </Button>
              )}
            </Group>
            <Text size="xs" c="dimmed">
              A wide picture works best (twice as wide as it is tall). Large photos are shrunk for you.
            </Text>
            {post.coverUrl && (
              <TextInput
                label="Describe the picture"
                description="For blind visitors and for Google Images."
                value={post.coverAlt}
                onChange={(event) => change({ coverAlt: event.currentTarget.value })}
              />
            )}
          </Box>

          <Box title="How it looks on Google">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="truncate text-xs text-gray-600">
                {siteHost} &rsaquo; blog &rsaquo; {post.slug || "address"}
              </div>
              <div className="truncate text-lg leading-6 text-[#1a0dab]">{googleTitle}</div>
              <div className="text-sm leading-5 text-gray-600">{googleText}</div>
            </div>
            <TextInput
              label={
                <Group gap="xs">
                  <span>Title for Google</span>
                  <Counter length={(post.seoTitle || post.title).length} good={60} />
                </Group>
              }
              description="Leave empty to use the post's title."
              value={post.seoTitle}
              onChange={(event) => change({ seoTitle: event.currentTarget.value })}
            />
            <Textarea
              label={
                <Group gap="xs">
                  <span>Description for Google</span>
                  <Counter length={(post.seoDescription || post.summary).length} good={160} />
                </Group>
              }
              description="Leave empty to use the summary."
              autosize
              minRows={2}
              value={post.seoDescription}
              onChange={(event) => change({ seoDescription: event.currentTarget.value })}
            />
          </Box>

          <Box title="More options">
            <TextInput
              label="Author"
              placeholder={DEFAULT_AUTHOR}
              value={post.authorName === DEFAULT_AUTHOR ? "" : post.authorName}
              onChange={(event) => change({ authorName: event.currentTarget.value })}
            />
            <TextInput
              label="Short name for lists"
              description='Used in A to Z lists and in Previous / Next links, for example "Cat 320". Leave empty to use the title.'
              value={post.listLabel}
              onChange={(event) => change({ listLabel: event.currentTarget.value })}
            />
            <DateTimePicker
              label="Publish date"
              description="Leave empty to use the moment you press Publish."
              clearable
              maxDate={new Date()}
              valueFormat="MMM D, YYYY h:mm A"
              value={post.publishedAt ? new Date(post.publishedAt) : null}
              onChange={(value) => change({ publishedAt: value ? Math.min(value.getTime(), Date.now()) : 0 })}
            />
            <Switch
              label="Show in the main blog list"
              description="Turn off for pages that should only appear in their category."
              checked={post.inFeed}
              onChange={(event) => change({ inFeed: event.currentTarget.checked })}
            />
            <Switch
              label="Hide from Google"
              description="The page stays on the site but asks search engines not to list it."
              checked={post.noindex}
              onChange={(event) => change({ noindex: event.currentTarget.checked })}
            />
            <TextInput
              label="Original address"
              description="Only if this text was first published somewhere else. Paste that page's full address."
              placeholder="https://"
              value={post.canonicalUrl}
              onChange={(event) => change({ canonicalUrl: event.currentTarget.value.trim() })}
            />
          </Box>

          {!isNew && (
            <Box title="Remove">
              {post.updatedAt > 0 && (
                <Text size="xs" c="dimmed">
                  Last saved {shortDateTime(post.updatedAt)}
                </Text>
              )}
              <Group gap="xs">
                {published && (
                  <Button variant="default" size="xs" onClick={() => setConfirm("unpublish")} disabled={!!busy}>
                    Unpublish
                  </Button>
                )}
                <Button variant="light" color="red" size="xs" onClick={() => setConfirm("delete")} disabled={!!busy}>
                  Delete post
                </Button>
              </Group>
            </Box>
          )}
        </div>
      </div>

      <Modal opened={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview: how the post will look on the site" fullScreen>
        {previewOpen && (
          <PostLayout
            post={toLive(post, post.publishedAt || Date.now(), Date.now())}
            category={categories.find((c) => c.slug === post.categorySlug) || null}
            // The text comes straight from the editor above, which only produces safe formatting.
            content={{ html: post.contentHtml, toc: [] }}
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title || "Your title", path: `/blog/${post.slug}` },
            ]}
            prev={null}
            next={null}
            related={[]}
          />
        )}
      </Modal>

      <Modal opened={confirm === "unpublish"} onClose={() => setConfirm("")} title="Unpublish this post?" centered>
        <Stack>
          <Text size="sm">Visitors will no longer see it. Your text is kept as a draft and can be published again.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setConfirm("")}>
              Cancel
            </Button>
            <Button color="orange" onClick={onUnpublish} loading={busy === "unpublish"}>
              Unpublish
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={confirm === "delete"} onClose={() => setConfirm("")} title="Delete this post?" centered>
        <Stack>
          <Text size="sm">
            This removes the post{published ? " from the site" : ""} and deletes your text. It cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setConfirm("")}>
              Cancel
            </Button>
            <Button color="red" onClick={onDelete} loading={busy === "delete"}>
              Delete for good
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={renameOpen} onClose={() => setRenameOpen(false)} title="Change the address" centered>
        <Stack>
          <TextInput
            label="New address"
            leftSection={<Text size="sm" c="dimmed">/blog/</Text>}
            leftSectionWidth={54}
            value={newSlug}
            onChange={(event) => setNewSlug(event.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
            error={newSlug && slugProblem(slugify(newSlug)) ? slugProblem(slugify(newSlug)) : undefined}
            data-autofocus
          />
          {dirty && (
            <Text size="sm" c="orange">
              Save your changes first: the address change uses the last saved version.
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onRename} loading={busy === "rename"} disabled={dirty || !newSlug || slugify(newSlug) === post.slug}>
              Change address
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
