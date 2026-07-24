// One-off / rerunnable maintenance script: normalizes tag casing across all
// posts in src/posts/*.md to lowercase + trimmed + deduplicated, matching the
// normalizeTags() logic in src/lib/frontmatter.ts (used for all future writes
// via the admin UI). Preserves each file's existing tags format (inline
// `tags: ["a", "b"]` vs YAML list `tags:\n  - a\n  - b`).
//
// Usage: node scripts/normalize-tags.mjs [--dry-run]

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = resolve(__dirname, "../src/posts");
const dryRun = process.argv.includes("--dry-run");

function normalizeTags(tags) {
  const seen = new Set();
  const result = [];
  for (const tag of tags) {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

let changedCount = 0;

for (const file of readdirSync(postsDir)) {
  if (!file.endsWith(".md")) continue;
  const filePath = join(postsDir, file);
  const content = readFileSync(filePath, "utf-8");

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];

  // Inline format: tags: ["a", "b"] or tags: [a, b]
  const inlineMatch = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  // YAML list format: tags:\n  - a\n  - b
  const listMatch = fm.match(/^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);

  let originalTags = [];
  let replaceFn = null;

  if (inlineMatch) {
    originalTags = inlineMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    replaceFn = (newTags) =>
      content.replace(
        /^tags:\s*\[.*\]\s*$/m,
        `tags: [${newTags.map((t) => `"${t}"`).join(", ")}]`,
      );
  } else if (listMatch) {
    originalTags = listMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*-\s*/, "").trim())
      .filter(Boolean);
    replaceFn = (newTags) =>
      content.replace(
        /^tags:\s*\n(?:\s*-\s*.+\n?)+/m,
        `tags:\n${newTags.map((t) => `  - ${t}`).join("\n")}\n`,
      );
  } else {
    continue;
  }

  const normalized = normalizeTags(originalTags);
  const unchanged =
    normalized.length === originalTags.length &&
    normalized.every((t, i) => t === originalTags[i]);

  if (unchanged) continue;

  changedCount++;
  console.log(
    `[normalize-tags] ${file}: [${originalTags.join(", ")}] -> [${normalized.join(", ")}]`,
  );

  if (!dryRun) {
    writeFileSync(filePath, replaceFn(normalized));
  }
}

console.log(
  `[normalize-tags] Done. ${changedCount} file(s) ${dryRun ? "would be" : ""} changed${dryRun ? " (dry run, no files written)" : ""}.`,
);
