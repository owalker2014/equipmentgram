// The thinking part of the "Bulk pages" tool: reading a spreadsheet saved as CSV
// and turning each row into a page by filling a template. Nothing in this file
// talks to the database or to the screen.

import { DEFAULT_AUTHOR } from "./config";
import { escapeHtml, slugify, slugProblem, stripHtml } from "./text";
import type { BlogFact, BlogPost, BulkTemplate } from "./types";

export type CsvRow = Record<string, string>;
export type CsvTable = {
  // For each column: the heading as typed, and the short name used in {{placeholders}}.
  columns: { header: string; key: string }[];
  rows: CsvRow[];
  problems: string[];
};

// "Operating weight (t)" -> "operating_weight_t"
export function columnKey(header: string): string {
  return slugify(header).replace(/-/g, "_");
}

function splitCsv(text: string, delimiter: string): string[][] {
  const table: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      table.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    table.push(row);
  }
  return table.filter((r) => r.some((c) => c.trim() !== ""));
}

// Reads CSV text. The first line holds the column headings.
// Commas, semicolons and tabs are all accepted as the separator.
export function parseCsv(input: string): CsvTable {
  const problems: string[] = [];
  const text = String(input || "").split(String.fromCharCode(0xfeff)).join("");
  const firstLine = text.split(/\r?\n/).find((line) => line.trim() !== "") || "";
  const delimiter = [",", ";", "\t"]
    .map((d) => ({ d, n: firstLine.split(d).length }))
    .sort((a, b) => b.n - a.n)[0].d;

  const table = splitCsv(text, delimiter);
  if (table.length < 2) {
    return { columns: [], rows: [], problems: ["The file needs a first line of column headings and at least one row under it."] };
  }

  const seen = new Set<string>();
  const columns = table[0].map((raw, i) => {
    const header = raw.trim() || `Column ${i + 1}`;
    let key = columnKey(header) || `column_${i + 1}`;
    if (seen.has(key)) {
      problems.push(`Two columns are both called "${header}". The second one was renamed.`);
      key = `${key}_${i + 1}`;
    }
    seen.add(key);
    return { header, key };
  });

  const rows = table.slice(1).map((cells, r) => {
    if (cells.length > columns.length) problems.push(`Row ${r + 2} has more cells than there are columns. The extra cells were ignored.`);
    const row: CsvRow = {};
    columns.forEach((col, i) => {
      row[col.key] = (cells[i] || "").trim();
    });
    return row;
  });

  return { columns, rows, problems: problems.slice(0, 20) };
}

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

// The placeholder names used in a piece of text, each once.
export function placeholdersIn(text: string): string[] {
  const found = new Set<string>();
  String(text || "").replace(PLACEHOLDER, (whole, name: string) => {
    found.add(name.toLowerCase());
    return whole;
  });
  return Array.from(found);
}

// Replaces every {{name}} with that row's value.
function fill(pattern: string, row: CsvRow, asHtml: boolean, missing: Set<string>): string {
  return String(pattern || "").replace(PLACEHOLDER, (_whole, rawName: string) => {
    const name = rawName.toLowerCase();
    const value = row[name];
    if (value === undefined || value === "") {
      missing.add(name);
      return "";
    }
    return asHtml ? escapeHtml(value) : value;
  });
}

export type PlannedPage = {
  rowNumber: number;
  post: BlogPost;
  problems: string[];
  // How much of the page's text comes from this row's own data, 0 to 100.
  uniqueShare: number;
};

export type BulkPlan = {
  pages: PlannedPage[];
  problems: string[];
  averageUniqueShare: number;
};

function tidy(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

// Builds one draft page per row. Nothing is saved here.
export function planPages(template: BulkTemplate, table: CsvTable, batchId: string, now: number): BulkPlan {
  const problems: string[] = [];
  const known = new Set(table.columns.map((c) => c.key));
  const patterns = [
    template.slugPattern,
    template.titlePattern,
    template.labelPattern,
    template.summaryPattern,
    template.seoTitlePattern,
    template.seoDescriptionPattern,
    template.bodyHtml,
  ];
  const unknown = new Set<string>();
  for (const pattern of patterns) for (const name of placeholdersIn(pattern)) if (!known.has(name)) unknown.add(name);
  if (unknown.size) {
    problems.push(
      `The template uses ${Array.from(unknown).map((n) => `{{${n}}}`).join(", ")} but the file has no such column.`
    );
  }
  if (!placeholdersIn(template.slugPattern).length) problems.push("The address pattern needs at least one {{placeholder}}, or every page would get the same address.");
  if (!placeholdersIn(template.titlePattern).length) problems.push("The title pattern needs at least one {{placeholder}}, or every page would get the same title.");

  const templateTextLength = stripHtml(template.bodyHtml.replace(PLACEHOLDER, "")).length;
  const slugs = new Map<string, number>();
  const titles = new Map<string, number>();

  const pages: PlannedPage[] = table.rows.map((row, i) => {
    const rowProblems: string[] = [];
    const missing = new Set<string>();

    const slug = slugify(fill(template.slugPattern, row, false, missing));
    const title = tidy(fill(template.titlePattern, row, false, missing));
    const contentHtml = fill(template.bodyHtml, row, true, missing);
    const summary = tidy(fill(template.summaryPattern, row, false, missing));
    const listLabel = tidy(fill(template.labelPattern, row, false, missing));
    const seoTitle = tidy(fill(template.seoTitlePattern, row, false, missing));
    const seoDescription = tidy(fill(template.seoDescriptionPattern, row, false, missing));
    const facts: BlogFact[] = template.factColumns
      .map((key) => ({ label: (table.columns.find((c) => c.key === key) || { header: key }).header, value: row[key] || "" }))
      .filter((fact) => fact.value);

    const problem = slugProblem(slug);
    if (problem) rowProblems.push(problem);
    if (!title) rowProblems.push("The title is empty.");
    if (slugs.has(slug)) rowProblems.push(`Same address as row ${slugs.get(slug)}.`);
    else slugs.set(slug, i + 2);
    if (title && titles.has(title.toLowerCase())) rowProblems.push(`Same title as row ${titles.get(title.toLowerCase())}.`);
    else titles.set(title.toLowerCase(), i + 2);
    if (missing.size) rowProblems.push(`Empty: ${Array.from(missing).join(", ")}.`);

    const bodyTextLength = stripHtml(contentHtml).length;
    const factsLength = facts.reduce((sum, fact) => sum + fact.value.length, 0);
    const own = Math.max(0, bodyTextLength - templateTextLength) + factsLength;
    const total = bodyTextLength + factsLength;

    const post: BlogPost = {
      slug,
      title,
      summary,
      contentHtml,
      coverUrl: "",
      coverAlt: "",
      categorySlug: template.categorySlug,
      authorName: DEFAULT_AUTHOR,
      listLabel,
      facts,
      faq: [],
      seoTitle,
      seoDescription,
      canonicalUrl: "",
      noindex: false,
      inFeed: false,
      status: "draft",
      hasChanges: false,
      source: "bulk",
      batchId,
      createdAt: now,
      updatedAt: now,
      publishedAt: 0,
    };

    return { rowNumber: i + 2, post, problems: rowProblems, uniqueShare: total ? Math.round((own / total) * 100) : 0 };
  });

  const averageUniqueShare = pages.length ? Math.round(pages.reduce((sum, p) => sum + p.uniqueShare, 0) / pages.length) : 0;
  return { pages, problems, averageUniqueShare };
}

// Below this share of row-specific text, pages are close to copies of each other.
export const LOW_UNIQUE_SHARE = 30;
