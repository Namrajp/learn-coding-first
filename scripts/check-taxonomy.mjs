// Build-time guard for the post taxonomy. Runs as the first `prebuild` step so
// a bad post fails the build instead of shipping a broken page.
//
// Enforces, for every file in src/posts/*.md:
//   1. `slug` frontmatter is present and equals the filename (minus .md)
//   2. `category` frontmatter is present and is one of the 8 known categories
//   3. no tag collides with a category name
//
// Usage: node scripts/check-taxonomy.mjs

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = resolve(__dirname, "../src/posts");

// Duplicated from src/lib/categories.ts — that file is the source of truth, but
// this script is plain node ESM and cannot import from src/lib. Keep in sync.
const CATEGORY_SLUGS = [
  "ai",
  "news",
  "tutorial",
  "web-development",
  "tools",
  "productivity",
  "essay",
  "miscellaneous",
];
const CATEGORY_LABELS = [
  "ai",
  "news",
  "tutorial",
  "web development",
  "tools",
  "productivity",
  "essay",
  "miscellaneous",
];
const RESERVED_TAG_NAMES = new Set([...CATEGORY_SLUGS, ...CATEGORY_LABELS]);

const SLUG_RE = /^[a-z0-9-]+$/;

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fm = match[1];

  const slugMatch = fm.match(/^slug:\s*"?(.+?)"?\s*$/m);
  const categoryMatch = fm.match(/^category:\s*"?(.+?)"?\s*$/m);

  let tags = [];
  const inlineMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  if (inlineMatch) {
    tags = inlineMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  } else {
    const listMatch = fm.match(/^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);
    if (listMatch) {
      tags = listMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean);
    }
  }

  return {
    slug: slugMatch ? slugMatch[1].trim() : "",
    category: categoryMatch ? categoryMatch[1].trim() : "",
    tags,
  };
}

const errors = [];
let checked = 0;

for (const file of readdirSync(postsDir).sort()) {
  if (!file.endsWith(".md") || file === "README.md") continue;
  checked++;

  const expectedSlug = file.replace(/\.md$/, "");
  const content = readFileSync(join(postsDir, file), "utf-8");
  const fm = parseFrontmatter(content);

  if (!fm) {
    errors.push(`${file}: no parseable frontmatter block`);
    continue;
  }

  if (!fm.slug) {
    errors.push(
      `${file}: missing "slug" frontmatter (expected "${expectedSlug}")`,
    );
  } else if (fm.slug !== expectedSlug) {
    errors.push(
      `${file}: slug "${fm.slug}" does not match filename (expected "${expectedSlug}")`,
    );
  }

  if (!SLUG_RE.test(expectedSlug)) {
    errors.push(
      `${file}: filename is not a valid slug — only lowercase letters, digits and hyphens are allowed`,
    );
  }

  if (!fm.category) {
    errors.push(`${file}: missing "category" frontmatter`);
  } else if (!CATEGORY_SLUGS.includes(fm.category)) {
    errors.push(
      `${file}: unknown category "${fm.category}" — must be one of: ${CATEGORY_SLUGS.join(", ")}`,
    );
  }

  for (const tag of fm.tags) {
    if (RESERVED_TAG_NAMES.has(tag.trim().toLowerCase())) {
      errors.push(
        `${file}: tag "${tag}" collides with a category name — categories and tags must stay distinct`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(
    `[check-taxonomy] FAILED — ${errors.length} problem(s) in ${checked} post(s):\n`,
  );
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  console.error(
    `\n[check-taxonomy] See the "Categories" section of AGENTS.md for the rules.`,
  );
  process.exit(1);
}

console.log(`[check-taxonomy] OK. ${checked} post(s) passed.`);
