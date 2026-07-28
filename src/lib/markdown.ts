import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

const slugCounts: Record<string, number> = {};
let imageIndex = 0;
const tocItems: TocItem[] = [];

function slugifyHeading(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  slugCounts[base] = (slugCounts[base] || 0) + 1;
  return slugCounts[base] > 1 ? `${base}-${slugCounts[base]}` : base;
}

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = text.replace(/<[^>]+>/g, "");
      const id = slugifyHeading(plain);

      if (depth >= 2 && depth <= 3) {
        tocItems.push({ id, text: plain, level: depth });
      }

      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
    image({ href, title, text }) {
      imageIndex += 1;
      const isFirst = imageIndex === 1;
      const alt = text || "";
      const titleAttr = title
        ? ` title="${title.replace(/"/g, "&quot;")}"`
        : "";
      const loading = isFirst ? "eager" : "lazy";
      const fetchPriority = isFirst ? ' fetchpriority="high"' : "";

      return `<img src="${href}" alt="${alt.replace(/"/g, "&quot;")}"${titleAttr} loading="${loading}"${fetchPriority} decoding="async" />`;
    },
  },
});

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: [
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      "decoding",
      "fetchpriority",
    ],
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    h5: ["id"],
    h6: ["id"],
  },
  transformTags: {
    img: (_tagName, attribs) => {
      if (!attribs.alt) {
        attribs.alt = "";
      }
      if (!attribs.loading) {
        imageIndex += 1;
        attribs.loading = imageIndex === 1 ? "eager" : "lazy";
        if (imageIndex === 1) {
          attribs.fetchpriority = "high";
        }
      }
      if (!attribs.decoding) {
        attribs.decoding = "async";
      }
      return { tagName: "img", attribs };
    },
  },
};

export function renderMarkdown(content: string): RenderedMarkdown {
  Object.keys(slugCounts).forEach((key) => delete slugCounts[key]);
  tocItems.length = 0;
  imageIndex = 0;

  const rawHtml = marked.parse(content) as string;
  const html = sanitizeHtml(rawHtml, sanitizeOptions);

  return {
    html,
    toc: [...tocItems],
  };
}
