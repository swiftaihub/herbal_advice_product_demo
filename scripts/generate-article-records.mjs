import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const articlesDir = path.join(repoRoot, "content", "articles");
const outputFile = path.join(repoRoot, "src", "lib", "data", "article-records.generated.ts");

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(input) {
  let output = escapeHtml(input);

  output = output.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`,
  );

  return output;
}

function renderMarkdownToHtml(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  const isBlockStart = (line) =>
    line.startsWith("> ") ||
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith("- ");

  while (index < lines.length) {
    const line = lines[index].trimEnd();

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];

      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(`<blockquote><p>${renderInline(quoteLines.join(" "))}</p></blockquote>`);
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(`<h3>${renderInline(line.slice(4).trim())}</h3>`);
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(`<h2>${renderInline(line.slice(3).trim())}</h2>`);
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(`<li>${renderInline(lines[index].trim().slice(2))}</li>`);
        index += 1;
      }

      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const paragraphLines = [];

    while (index < lines.length) {
      const current = lines[index].trimEnd();

      if (!current.trim() || isBlockStart(current.trim())) {
        break;
      }

      paragraphLines.push(current.trim());
      index += 1;
    }

    blocks.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function readingMinutesFromText(input) {
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(wordCount / 180));
}

function serialize(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const articleEntries = await fs.readdir(articlesDir, { withFileTypes: true });
  const records = {};

  for (const entry of articleEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const articleRoot = path.join(articlesDir, entry.name);
    const [metaRaw, enSource, zhSource] = await Promise.all([
      fs.readFile(path.join(articleRoot, "meta.json"), "utf8"),
      fs.readFile(path.join(articleRoot, "en.mdx"), "utf8"),
      fs.readFile(path.join(articleRoot, "zh.mdx"), "utf8"),
    ]);

    const meta = JSON.parse(metaRaw);

    records[entry.name] = {
      meta,
      bodyHtml: {
        en: renderMarkdownToHtml(enSource),
        zh: renderMarkdownToHtml(zhSource),
      },
      readingMinutes: {
        en: readingMinutesFromText(enSource),
        zh: readingMinutesFromText(zhSource),
      },
    };
  }

  const output = `import type { ArticleMeta, Locale } from "@/lib/types";

export interface ArticleRecord {
  meta: ArticleMeta;
  bodyHtml: Record<Locale, string>;
  readingMinutes: Record<Locale, number>;
}

export const articleRecords: Record<string, ArticleRecord> = ${serialize(records)} as const;
`;

  await fs.writeFile(outputFile, output, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
