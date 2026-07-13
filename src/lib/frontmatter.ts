export interface ParsedFrontmatter {
  title: string;
  date: string;
  tags: string[];
  status: string;
  description: string;
}

export function parseFrontmatter(content: string): ParsedFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  const fm = match[1];
  const titleMatch = fm.match(/^title:\s*"?(.+?)"?\s*$/m);
  const dateMatch = fm.match(/^date:\s*(\S+)$/m);
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

  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    date: dateMatch ? dateMatch[1].trim() : "2024-01-01",
    tags,
    status: statusMatch ? statusMatch[1] : "draft",
    description: descMatch ? descMatch[1].trim() : "",
  };
}

export function parseFrontmatterBody(content: string): string | null {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : null;
}
