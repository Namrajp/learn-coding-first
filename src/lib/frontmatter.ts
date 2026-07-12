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
  const titleMatch = fm.match(/title:\s*"(.+)"/);
  const dateMatch = fm.match(/date:\s*(.+)/);
  const statusMatch = fm.match(/status:\s*(\w+)/);
  const descMatch = fm.match(/description:\s*"(.+)"/);

  let tags: string[] = [];
  // Inline format: tags: [a, b, c]
  const inlineTags = fm.match(/tags:\s*\[(.+)\]/);
  if (inlineTags) {
    tags = inlineTags[1].split(",").map((t) => t.trim().replace(/"/g, ""));
  } else {
    // YAML list format:
    // tags:
    //   - python
    //   - numpy
    const listMatch = fm.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/);
    if (listMatch) {
      tags = listMatch[1]
        .split("\n")
        .map((line) => line.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean);
    }
  }

  return {
    title: titleMatch ? titleMatch[1] : "",
    date: dateMatch ? dateMatch[1].trim() : "2024-01-01",
    tags,
    status: statusMatch ? statusMatch[1] : "draft",
    description: descMatch ? descMatch[1] : "",
  };
}
