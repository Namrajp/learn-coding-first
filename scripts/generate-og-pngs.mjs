import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = resolve(__dirname, "../src/posts");
const outDir = resolve(__dirname, "../public/og");
const fontsDir = resolve(__dirname, "fonts");
const generatedDir = resolve(__dirname, "../src/generated");

mkdirSync(outDir, { recursive: true });
mkdirSync(generatedDir, { recursive: true });

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
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

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fm = match[1];
  const titleMatch = fm.match(/^title:\s*"?(.+?)"?\s*$/m);
  const statusMatch = fm.match(/^status:\s*(\w+)/m);
  const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  let tags = [];
  if (tagsMatch) {
    tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""));
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
    title: titleMatch ? titleMatch[1].trim() : "",
    status: statusMatch ? statusMatch[1] : "published",
    tags,
  };
}

function loadFonts() {
  const medium = readFileSync(resolve(fontsDir, "Inter-Medium.otf"));
  const bold = readFileSync(resolve(fontsDir, "Inter-Bold.otf"));
  return { medium, bold };
}

function buildSvg(title, tags) {
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
<text x="${x + pillWidth / 2}" y="501" font-family="Inter, sans-serif" font-size="14" fill="rgba(255,255,255,0.85)" text-anchor="middle">${escapeXml(tag)}</text>`;
    })
    .join("\n");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#2d5a87"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="80" font-family="Inter, sans-serif" font-size="32" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-weight="500">Learn Coding First</text>
  <text x="600" y="${titleY}" font-family="Inter, sans-serif" font-size="${titleFontSize}" fill="white" text-anchor="middle" font-weight="800">
    ${titleSvg}
  </text>
  ${tagPills}
</svg>`;
}

function writeManifest(slugs) {
  const manifest = { slugs: [...slugs].sort() };
  const json = JSON.stringify(manifest, null, 2) + "\n";
  writeFileSync(resolve(outDir, "manifest.json"), json);
  writeFileSync(resolve(generatedDir, "og-manifest.json"), json);
}

async function main() {
  console.log("[og-png] Loading vendored Inter fonts...");
  const { medium, bold } = loadFonts();
  console.log(
    `[og-png] Fonts loaded (medium: ${medium.length} bytes, bold: ${bold.length} bytes)`,
  );

  const { Resvg } = await import("@resvg/resvg-js");

  const files = readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const generatedSlugs = [];
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const content = readFileSync(resolve(postsDir, file), "utf-8");
    const fm = parseFrontmatter(content);

    if (!fm || fm.status === "draft") {
      skipped++;
      continue;
    }

    const title = fm.title || slug;
    const tags = fm.tags || [];
    const svg = buildSvg(title, tags);

    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: {
        loadSystemFonts: false,
        defaultFontFamily: "Inter, sans-serif",
        fontFiles: [
          { path: "Inter-Medium", data: medium },
          { path: "Inter-Bold", data: bold },
        ],
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    writeFileSync(resolve(outDir, `${slug}.png`), pngBuffer);
    generatedSlugs.push(slug);
  }

  writeManifest(generatedSlugs);
  console.log(
    `[og-png] Done. Generated ${generatedSlugs.length} PNGs, skipped ${skipped} drafts.`,
  );
}

main().catch((err) => {
  console.error("[og-png] Failed:", err);
  process.exit(1);
});
