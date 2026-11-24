"use client";

// Blog studio > Status check: tests the blog's connection to Firebase and repairs the lists.

import { Alert, Button, Group, Loader, Paper, Progress, Stack, Table, Text } from "@mantine/core";
import { IconCircleCheck, IconCircleX, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { friendlyError, getListingIndexes, rebuildAllListings, runDatabaseChecks, type CheckResult, type ListingReport } from "@/lib/blog/admin-data";
import { DIRECTORY_PER_PAGE, POSTS_PER_PAGE, SITEMAP_MAX_POSTS } from "@/lib/blog/config";
import { FEED_INDEX_ID, categoryIndexId } from "@/lib/blog/keys";
import { testImageUpload } from "@/lib/blog/upload";
import { notifyError, notifyOk, useCategories } from "./shared";

export default function StatusCheck() {
  const { categories } = useCategories();
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<ListingReport | null>(null);
  const [stale, setStale] = useState<string[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const lookAtListings = useCallback(async () => {
    try {
      const indexes = await getListingIndexes();
      const old: string[] = [];
      let sum = 0;
      const feed = indexes[FEED_INDEX_ID];
      if (feed && feed.count > 0 && feed.pageSize !== POSTS_PER_PAGE) old.push("Main blog list");
      for (const category of categories) {
        const index = indexes[categoryIndexId(category.slug)];
        if (!index) continue;
        sum += index.count;
        const wanted = category.layout === "directory" ? DIRECTORY_PER_PAGE : POSTS_PER_PAGE;
        if (index.count > 0 && index.pageSize !== wanted) old.push(category.name);
      }
      setStale(old);
      setTotal(sum);
    } catch {
      setTotal(null);
    }
  }, [categories]);

  useEffect(() => {
    lookAtListings();
  }, [lookAtListings]);

  const runChecks = useCallback(async () => {
    setChecking(true);
    const found = await runDatabaseChecks();
    try {
      await testImageUpload();
      found.push({ name: "Upload pictures", ok: true, detail: "Pictures can be stored." });
    } catch (error) {
      found.push({ name: "Upload pictures", ok: false, detail: friendlyError(error) });
    }
    setResults(found);
    setChecking(false);
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const rebuild = async () => {
    setRebuilding(true);
    setProgress(0);
    try {
      const done = await rebuildAllListings((n, of) => setProgress(Math.round((n / of) * 100)));
      setReport(done);
      notifyOk("The lists were rebuilt and every blog page will be drawn afresh on its next visit.");
      await lookAtListings();
    } catch (error) {
      notifyError(error);
    } finally {
      setRebuilding(false);
    }
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={700}>Connection to Firebase</Text>
          <Button variant="default" size="xs" leftSection={<IconRefresh size={14} />} onClick={runChecks} loading={checking}>
            Run the checks again
          </Button>
        </Group>
        {!results && (
          <Group gap="xs">
            <Loader size="xs" />
            <Text size="sm">Checking...</Text>
          </Group>
        )}
        {results && (
          <Stack gap="xs">
            {results.map((result) => (
              <Group key={result.name} gap="sm" align="flex-start" wrap="nowrap">
                {result.ok ? <IconCircleCheck size={22} className="flex-none text-green-600" /> : <IconCircleX size={22} className="flex-none text-red-600" />}
                <div>
                  <Text size="sm" fw={600}>
                    {result.name}
                  </Text>
                  <Text size="sm" c={result.ok ? "dimmed" : "red"}>
                    {result.detail}
                  </Text>
                </div>
              </Group>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Text fw={700} mb="xs">
          Lists and page numbers
        </Text>
        <Text size="sm" c="dimmed" mb="sm">
          The blog keeps a small record of where each page of each list starts. It is updated every time you publish. Press the button if a list or a post ever looks out of date on the site, or after changing the number of posts per page in lib/blog/config.ts. It also tells the site to draw every blog page afresh.
        </Text>
        {stale.length > 0 && (
          <Alert color="yellow" mb="sm" title="A rebuild is needed">
            The number of posts per page changed for: {stale.join(", ")}.
          </Alert>
        )}
        {total !== null && total > SITEMAP_MAX_POSTS * 0.9 && (
          <Alert color="yellow" mb="sm" title="The sitemap is almost full">
            The blog has {total} published pages and the sitemap lists at most {SITEMAP_MAX_POSTS}. Ask a developer to split the sitemap before you add more.
          </Alert>
        )}
        <Group gap="sm">
          <Button onClick={rebuild} loading={rebuilding} className="bg-blue-700">
            Rebuild listings
          </Button>
          {total !== null && (
            <Text size="sm" c="dimmed">
              {total} published {total === 1 ? "page" : "pages"} in {categories.length} {categories.length === 1 ? "category" : "categories"}
            </Text>
          )}
        </Group>
        {rebuilding && <Progress value={progress} animated mt="sm" />}
        {report && (
          <Table mt="md" verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>List</Table.Th>
                <Table.Th>Posts</Table.Th>
                <Table.Th>Pages</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {report.map((row) => (
                <Table.Tr key={row.name}>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.count}</Table.Td>
                  <Table.Td>{row.pages}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
