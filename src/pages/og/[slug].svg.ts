import { getEntry } from "astro:content";

export const prerender = false;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && current.length + 1 + word.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

export const GET = async ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const entry = await getEntry("posts", slug);
  if (!entry) {
    return new Response("Post not found", { status: 404 });
  }

  const { data } = entry as {
    data: {
      title: string;
      date: string;
      tags: string[];
      description?: string;
      status: string;
    };
  };

  if (data.status === "draft") {
    return new Response("Draft post", { status: 404 });
  }

  const title = data.title || slug;
  const tags = data.tags || [];

  const titleLines = wrapText(title, 22);
  const titleFontSize = titleLines.length > 3 ? 40 : 48;
  const titleY = titleLines.length > 3 ? 260 : 280;

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<tspan x="600" dy="${i === 0 ? 0 : titleFontSize * 1.2}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const tagPills = tags
    .slice(0, 5)
    .map((tag, i) => {
      const pillWidth = tag.length * 14 + 32;
      const totalWidth = tags
        .slice(0, 5)
        .reduce((sum, t) => sum + t.length * 14 + 32 + 12, -12);
      const startX = 600 - totalWidth / 2;
      let x = startX;
      for (let j = 0; j < i; j++) {
        x += tags[j].length * 14 + 32 + 12;
      }
      return `<rect x="${x}" y="480" width="${pillWidth}" height="32" rx="16" fill="rgba(255,255,255,0.15)"/>
<text x="${x + pillWidth / 2}" y="501" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" fill="rgba(255,255,255,0.85)" text-anchor="middle">${escapeXml(tag)}</text>`;
    })
    .join("\n");

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#2d5a87"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="80" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="32" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-weight="500">Learn Coding First</text>
  <text x="600" y="${titleY}" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${titleFontSize}" fill="white" text-anchor="middle" font-weight="800">
    ${titleSvg}
  </text>
  ${tagPills}
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
    },
  });
};
