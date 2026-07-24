// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["marked", "sanitize-html", "better-auth"],
    },
    ssr: {
      noExternal: ["sanitize-html"],
    },
  },
  site: "https://learncodingfirst.com",
  integrations: [sitemap()],
  redirects: {
    "/blog/page/1": "/blog",
  },
});
