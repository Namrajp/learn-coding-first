import {
  DEFAULT_CATEGORY,
  RESERVED_TAG_NAMES,
  isCategory,
  type CategorySlug,
} from "./categories";

export interface ParsedFrontmatter {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category: CategorySlug;
  status: string;
  description: string;
}

export interface ParsedPostFile {
  data: ParsedFrontmatter;
  body: string;
}

export function parseFrontmatter(content: string): ParsedFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  const fm = match[1];
  const titleMatch = fm.match(/^title:\s*"?(.+?)"?\s*$/m);
  const slugMatch = fm.match(/^slug:\s*"?(.+?)"?\s*$/m);
  const dateMatch = fm.match(/^date:\s*(\S+)$/m);
  const categoryMatch = fm.match(/^category:\s*"?(.+?)"?\s*$/m);
  const statusMatch = fm.match(/^status:\s*(\w+)/m);
  const descMatch = fm.match(/^description:\s*"?(.*?)"?\s*$/m);

  let tags: string[] = [];
  const inlineTags = fm.match(/tags:\s*\[(.+)\]/);
  if (inlineTags) {
    tags = inlineTags[1].split(",").map((t) => t.trim().replace(/"/g, ""));
  } else {
    const listMatch = fm.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/);
    if (listMatch) {
      tags = listMatch[1]
        .split("\n")
        .map((line) => line.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean);
    }
  }

  const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : "";

  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    slug: slugMatch ? slugMatch[1].trim() : "",
    date: dateMatch ? dateMatch[1].trim() : "2024-01-01",
    tags,
    category: isCategory(category) ? category : DEFAULT_CATEGORY,
    status: statusMatch ? statusMatch[1] : "published",
    description: descMatch ? descMatch[1].trim() : "",
  };
}

export function parseFrontmatterBody(content: string): string | null {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : null;
}

export function parsePostFile(content: string): ParsedPostFile | null {
  const data = parseFrontmatter(content);
  const body = parseFrontmatterBody(content);
  if (!data || !body) return null;
  return { data, body };
}

/**
 * Normalize tags to a consistent, deduplicated casing (lowercase, trimmed).
 * Prevents tag fragmentation like "Python" vs "python" creating separate
 * /tag/[tag] pages and splitting search/related-posts matching.
 *
 * Tags that collide with a category name are dropped: categories and tags are
 * separate taxonomies and a name must belong to exactly one of them.
 */
export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    if (RESERVED_TAG_NAMES.includes(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

export function yamlString(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

export function buildFrontmatter(opts: {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category?: string;
  status: string;
  description?: string;
}): string {
  const lines = [
    "---",
    `title: "${yamlString(opts.title)}"`,
    `slug: "${yamlString(opts.slug)}"`,
    `date: ${opts.date}`,
  ];

  if (opts.description) {
    lines.push(`description: "${yamlString(opts.description)}"`);
  }

  const category = isCategory(opts.category) ? opts.category : DEFAULT_CATEGORY;
  const tags = normalizeTags(opts.tags);
  lines.push(
    `category: "${category}"`,
    `tags: [${tags.map((t) => `"${yamlString(t)}"`).join(", ")}]`,
    `status: ${opts.status}`,
    "---",
  );

  return lines.join("\n");
}
