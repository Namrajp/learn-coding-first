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
