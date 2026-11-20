// @ts-check
import { readFileSync, readdirSync } from "node:fs";

import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

/**
 * Category pages are prerendered for all 8 categories so a URL always exists,
 * but an empty one is thin content. It renders with `noindex, follow`, and is
 * kept out of the sitemap here so Search Console doesn't report a "Submitted
 * URL marked noindex" warning for it.
 */
function categoriesWithPosts() {
  const populated = new Set();
  for (const file of readdirSync("./src/posts")) {
    if (!file.endsWith(".md")) continue;
    const content = readFileSync(`./src/posts/${file}`, "utf-8");
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
    if (!frontmatter) continue;
    if (/^status:\s*draft/m.test(frontmatter)) continue;
    const category = frontmatter.match(/^category:\s*"?([a-z-]+)"?\s*$/m)?.[1];
    if (category) populated.add(category);
  }
  return populated;
}

const populatedCategories = categoriesWithPosts();

function publishedPostUrls() {
  const postsDirectory = new URL("./src/posts/", import.meta.url);

  return readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => {
      const content = readFileSync(
        new URL(file, postsDirectory),
        "utf-8",
      );

      const frontmatter = content.match(
        /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
      )?.[1];

      // Skip files without frontmatter and posts marked as draft.
      if (!frontmatter) return false;

      return !/^status:\s*["']?draft["']?\s*(?:#.*)?$/m.test(
        frontmatter,
      );
    })
    .map((file) => {
      const slug = file.slice(0, -3);
      return `https://learncodingfirst.com/${encodeURIComponent(slug)}`;
    });
}

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["marked"],
    },
    ssr: {
      noExternal: ["sanitize-html", "better-auth"],
    },
  },
  site: "https://learncodingfirst.com",
  integrations: [
    sitemap({
      customPages: [
      "https://learncodingfirst.com/redux-in-simple-terms",
    ],
      filter: (page) => {
        const category = page.match(/\/category\/([a-z-]+)\/?$/)?.[1];
        return !category || populatedCategories.has(category);
      },
    }),
  ],
  redirects: {
    "/blog/page/1": "/blog",
    "/24-11-2025-create-minimal-api": "/create-minimal-api-asp-net-core",
    "/24-11-2025-dependency-injection": "/dependency-injection-in-asp-net",
    "/python_environments": "/virtual-environments-in-python",
  },
});
