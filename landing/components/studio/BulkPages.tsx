"use client";

// Blog studio > Bulk pages: one spreadsheet row becomes one draft page.
// Nothing made here is public until you publish it from the Posts screen.

import { Alert, Badge, Button, Checkbox, Code, FileButton, Group, Modal, MultiSelect, Paper, Progress, Select, Stack, Table, Text, TextInput, Textarea } from "@mantine/core";
import { IconAlertTriangle, IconFileSpreadsheet } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { deleteTemplate, listTemplates, saveManyDrafts, saveTemplate, type Skipped } from "@/lib/blog/admin-data";
import { LOW_UNIQUE_SHARE, parseCsv, planPages, type PlannedPage } from "@/lib/blog/bulk";
import { slugify } from "@/lib/blog/text";
import type { BulkTemplate } from "@/lib/blog/types";
import RichEditor from "./RichEditor";
import { notifyError, notifyOk, useCategories } from "./shared";

import "@/components/blog/blog.css";

function blankTemplate(): BulkTemplate {
  return {
    id: "",
    name: "",
    categorySlug: "",
    slugPattern: "",
    titlePattern: "",
    labelPattern: "",
    summaryPattern: "",
    seoTitlePattern: "",
    seoDescriptionPattern: "",
    bodyHtml: "",
    factColumns: [],
    updatedAt: 0,
  };
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group gap="sm" mb="sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">{number}</span>
        <Text fw={700}>{title}</Text>
      </Group>
      <Stack gap="sm">{children}</Stack>
    </Paper>
  );
}

// "inspection-guide-20261118-1504"
function makeBatchId(name: string): string {
  const d = new Date();
  const two = (n: number) => String(n).padStart(2, "0");
  return `${slugify(name).slice(0, 40) || "bulk"}-${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}`;
}

export default function BulkPages() {
  const { categories } = useCategories();
  const [csvText, setCsvText] = useState("");
  const [templates, setTemplates] = useState<BulkTemplate[]>([]);
  const [template, setTemplate] = useState<BulkTemplate>(blankTemplate);
  const [editorKey, setEditorKey] = useState(0);
  const [preview, setPreview] = useState<PlannedPage | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ created: number; updated: number; skipped: Skipped[]; batchId: string } | null>(null);

  useEffect(() => {
    listTemplates().then(setTemplates).catch(notifyError);
  }, []);

  const table = useMemo(() => (csvText.trim() ? parseCsv(csvText) : null), [csvText]);
  const plan = useMemo(() => {
    if (!table || !table.rows.length || !template.slugPattern || !template.titlePattern) return null;
    return planPages(template, table, "", Date.now());
  }, [table, template]);

  const good = plan ? plan.pages.filter((page) => !page.problems.length) : [];
  const withProblems = plan ? plan.pages.length - good.length : 0;
  const set = (patch: Partial<BulkTemplate>) => setTemplate((current) => ({ ...current, ...patch }));
  const category = categories.find((c) => c.slug === template.categorySlug);

  const loadTemplate = (id: string | null) => {
    const found = templates.find((t) => t.id === id);
    setTemplate(found ? { ...found } : blankTemplate());
    setEditorKey((key) => key + 1);
    setResult(null);
  };

  const onSaveTemplate = async () => {
    const id = slugify(template.name);
    if (!id) return notifyError(new Error("Give the template a name first."));
    try {
      const saved = { ...template, id };
      await saveTemplate(saved);
      setTemplate(saved);
      setTemplates(await listTemplates());
      notifyOk("Template saved. You can reuse it with a new spreadsheet any time.");
    } catch (error) {
      notifyError(error);
    }
  };

  const onDeleteTemplate = async () => {
    if (!template.id) return;
    try {
      await deleteTemplate(template.id);
      setTemplates(await listTemplates());
      loadTemplate(null);
      notifyOk("Template deleted. Pages already made with it are not affected.");
    } catch (error) {
      notifyError(error);
    }
  };

  const onCreate = async () => {
    if (!plan || !good.length) return;
    setWorking(true);
    setProgress(0);
    setResult(null);
    try {
      const batchId = makeBatchId(template.name || category?.name || "bulk");
      const now = Date.now();
      const posts = good.map((page) => ({ ...page.post, batchId, createdAt: now, updatedAt: now }));
      const done = await saveManyDrafts(posts, refresh ? "update" : "skip", (n, of) => setProgress(Math.round((n / of) * 100)));
      setResult({ ...done, batchId });
      notifyOk(`${done.created} drafts created${done.updated ? `, ${done.updated} refreshed` : ""}.`);
    } catch (error) {
      notifyError(error);
    } finally {
      setWorking(false);
    }
  };

  return (
    <Stack gap="lg">
      <Alert color="blue" title="Read this before you make pages in bulk">
        Google removes sites that publish many near-identical pages made only to catch searches. Each page here must be useful on its own: give every row facts that are true only for that row. Start with a small set, publish it, and watch how it does in Search Console before you add more. The manual has the details in Part 7.
      </Alert>

      <Step number={1} title="Your spreadsheet">
        <Text size="sm" c="dimmed">
          One row per page, with column headings in the first row. In Excel or Google Sheets choose File, then Download or Save as, then CSV.
        </Text>
        <Group gap="sm">
          <FileButton
            accept=".csv,text/csv,text/plain"
            onChange={async (file) => {
              if (file) setCsvText(await file.text());
            }}
          >
            {(props) => (
              <Button {...props} variant="default" leftSection={<IconFileSpreadsheet size={16} />}>
                Choose a CSV file
              </Button>
            )}
          </FileButton>
          {csvText && (
            <Button variant="subtle" color="gray" onClick={() => setCsvText("")}>
              Clear
            </Button>
          )}
        </Group>
        <Textarea
          aria-label="Spreadsheet contents"
          placeholder={"...or paste the rows here\nBrand,Model,Operating weight\nCat,320,about 22 t"}
          autosize
          minRows={3}
          maxRows={8}
          styles={{ input: { fontFamily: "monospace", fontSize: 13 } }}
          value={csvText}
          onChange={(event) => setCsvText(event.currentTarget.value)}
        />
        {table && table.problems.length > 0 && (
          <Alert color="yellow" icon={<IconAlertTriangle size={18} />}>
            {table.problems.map((problem) => (
              <div key={problem}>{problem}</div>
            ))}
          </Alert>
        )}
        {table && table.columns.length > 0 && (
          <div>
            <Text size="sm" mb={6}>
              <b>{table.rows.length}</b> {table.rows.length === 1 ? "row" : "rows"}. Use these names in the template to drop in each row's value:
            </Text>
            <Group gap={6}>
              {table.columns.map((column) => (
                <Code key={column.key} title={column.header}>{`{{${column.key}}}`}</Code>
              ))}
            </Group>
          </div>
        )}
      </Step>

      <Step number={2} title="The template">
        <Group gap="sm" align="flex-end">
          <Select
            label="Start from a saved template"
            placeholder={templates.length ? "Choose one" : "None saved yet"}
            data={templates.map((t) => ({ value: t.id, label: t.name }))}
            value={template.id || null}
            onChange={loadTemplate}
            clearable
            w={320}
          />
          {template.id && (
            <Button variant="subtle" color="red" onClick={onDeleteTemplate}>
              Delete this template
            </Button>
          )}
        </Group>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput label="Template name" placeholder="Inspection guide by model" value={template.name} onChange={(event) => set({ name: event.currentTarget.value })} />
          <Select
            label="Category for the pages"
            description="A category shown as an A to Z list of links suits large sets."
            placeholder="Choose a category"
            data={categories.map((c) => ({ value: c.slug, label: `${c.name}${c.layout === "directory" ? " (A to Z list)" : ""}` }))}
            value={template.categorySlug || null}
            onChange={(value) => set({ categorySlug: value || "" })}
          />
          <TextInput
            label="Address pattern"
            description="Becomes /blog/..., in small letters with dashes."
            placeholder="{{brand}}-{{model}}-inspection-guide"
            value={template.slugPattern}
            onChange={(event) => set({ slugPattern: event.currentTarget.value })}
          />
          <TextInput
            label="Title pattern"
            placeholder="{{brand}} {{model}} inspection guide"
            value={template.titlePattern}
            onChange={(event) => set({ titlePattern: event.currentTarget.value })}
          />
          <TextInput
            label="Short name pattern"
            description="The name shown in the A to Z list."
            placeholder="{{brand}} {{model}}"
            value={template.labelPattern}
            onChange={(event) => set({ labelPattern: event.currentTarget.value })}
          />
          <TextInput
            label="Title for Google pattern (optional)"
            value={template.seoTitlePattern}
            onChange={(event) => set({ seoTitlePattern: event.currentTarget.value })}
          />
          <Textarea
            label="Summary pattern"
            autosize
            minRows={2}
            placeholder="Key numbers for the {{brand}} {{model}} and what to look at first."
            value={template.summaryPattern}
            onChange={(event) => set({ summaryPattern: event.currentTarget.value })}
          />
          <Textarea
            label="Description for Google pattern (optional)"
            autosize
            minRows={2}
            value={template.seoDescriptionPattern}
            onChange={(event) => set({ seoDescriptionPattern: event.currentTarget.value })}
          />
        </div>
        <MultiSelect
          label="Columns to show in the Key facts box"
          description="Each chosen column becomes one line in the blue box at the top of the page."
          placeholder={table ? "Choose columns" : "Add your spreadsheet first"}
          data={(table ? table.columns : []).map((c) => ({ value: c.key, label: c.header }))}
          value={template.factColumns.filter((key) => !table || table.columns.some((c) => c.key === key))}
          onChange={(value) => set({ factColumns: value })}
        />
        <div>
          <Text size="sm" fw={500} mb={4}>
            Page text
          </Text>
          <RichEditor
            key={editorKey}
            initialHtml={template.bodyHtml}
            onChange={(html) => set({ bodyHtml: html })}
            placeholder="Write the page once. Type {{column_name}} wherever a row's own value should appear."
          />
        </div>
        <div>
          <Button variant="default" onClick={onSaveTemplate} disabled={!template.name.trim()}>
            Save template
          </Button>
        </div>
      </Step>

      <Step number={3} title="Check the result">
        {!plan && (
          <Text size="sm" c="dimmed">
            Add a spreadsheet, an address pattern and a title pattern to see the pages here.
          </Text>
        )}
        {plan && (
          <>
            <Group gap="sm">
              <Badge size="lg" variant="light" color="green">
                {good.length} ready
              </Badge>
              {withProblems > 0 && (
                <Badge size="lg" variant="light" color="red">
                  {withProblems} with problems (skipped)
                </Badge>
              )}
              <Badge size="lg" variant="light" color={plan.averageUniqueShare < LOW_UNIQUE_SHARE ? "orange" : "blue"}>
                {plan.averageUniqueShare}% of each page is its own
              </Badge>
            </Group>
            {plan.problems.map((problem) => (
              <Alert key={problem} color="red" icon={<IconAlertTriangle size={18} />}>
                {problem}
              </Alert>
            ))}
            {plan.averageUniqueShare < LOW_UNIQUE_SHARE && (
              <Alert color="orange" title="These pages are close to copies of each other" icon={<IconAlertTriangle size={18} />}>
                On average only {plan.averageUniqueShare}% of the words on a page come from its own row. Google treats sets of pages that differ by little more than a name as spam. Add columns with real, row-specific facts, or shorten the shared text.
              </Alert>
            )}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={60}>Row</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th w={90}>Its own</Table.Th>
                    <Table.Th w={90} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {plan.pages.slice(0, 15).map((page) => (
                    <Table.Tr key={page.rowNumber}>
                      <Table.Td>{page.rowNumber}</Table.Td>
                      <Table.Td>
                        {page.post.title || <span className="text-gray-400">(empty)</span>}
                        {page.problems.length > 0 && <div className="text-xs text-red-600">{page.problems.join(" ")}</div>}
                      </Table.Td>
                      <Table.Td className="text-sm text-gray-600">/blog/{page.post.slug}</Table.Td>
                      <Table.Td>{page.uniqueShare}%</Table.Td>
                      <Table.Td>
                        <Button size="compact-xs" variant="light" onClick={() => setPreview(page)}>
                          Preview
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {plan.pages.length > 15 && <div className="px-4 py-2 text-sm text-gray-500">and {plan.pages.length - 15} more rows</div>}
            </div>
          </>
        )}
      </Step>

      <Step number={4} title="Create the drafts">
        <Text size="sm" c="dimmed">
          This saves the pages as drafts. Nothing appears on the site until you open them in Posts and press Publish.
        </Text>
        <Checkbox
          label="Also refresh pages that an earlier run already created"
          description="Use this when you have corrected the spreadsheet or the template. Hand-written posts are never overwritten."
          checked={refresh}
          onChange={(event) => setRefresh(event.currentTarget.checked)}
        />
        <div>
          <Button
            onClick={onCreate}
            loading={working}
            disabled={!plan || !good.length || plan.problems.length > 0 || !template.categorySlug}
            className="bg-blue-700"
          >
            {good.length ? `Create ${good.length} ${good.length === 1 ? "draft" : "drafts"}` : "Create drafts"}
          </Button>
          {plan && !template.categorySlug && (
            <Text size="sm" c="red" mt={6}>
              Choose a category in step 2 first.
            </Text>
          )}
        </div>
        {working && <Progress value={progress} animated />}
        {result && (
          <Alert color="green" title="Drafts saved">
            <Stack gap="xs">
              <Text size="sm">
                {result.created} created, {result.updated} refreshed, {result.skipped.length} skipped.
              </Text>
              {result.skipped.slice(0, 6).map((item) => (
                <Text size="sm" key={item.slug}>
                  <b>{item.slug}</b>: {item.reason}
                </Text>
              ))}
              {result.skipped.length > 6 && <Text size="sm">and {result.skipped.length - 6} more</Text>}
              <div>
                <Button component={Link} href={`/studio/posts?batch=${encodeURIComponent(result.batchId)}`} variant="white">
                  Review and publish them in Posts
                </Button>
              </div>
            </Stack>
          </Alert>
        )}
      </Step>

      <Modal opened={!!preview} onClose={() => setPreview(null)} title="Preview of one page" size="xl">
        {preview && (
          <div>
            <Text size="xs" c="dimmed">
              /blog/{preview.post.slug}
            </Text>
            <h2 className="mb-2 mt-1 text-2xl font-extrabold tracking-tight text-gray-900">{preview.post.title}</h2>
            {preview.post.summary && <p className="mb-4 text-gray-500">{preview.post.summary}</p>}
            {preview.post.facts.length > 0 && (
              <dl className="mb-6 grid grid-cols-1 gap-x-8 gap-y-2 rounded-2xl bg-blue-50 p-4 sm:grid-cols-2">
                {preview.post.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-sm text-gray-500">{fact.label}</dt>
                    <dd className="font-semibold text-gray-900">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {/* The text comes from your own template; spreadsheet values are escaped before they are dropped in. */}
            <div
              className="blog-prose prose max-w-none prose-headings:font-bold prose-a:text-blue-700"
              dangerouslySetInnerHTML={{ __html: preview.post.contentHtml }}
            />
          </div>
        )}
      </Modal>
    </Stack>
  );
}
