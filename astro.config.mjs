// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({ entrypoint: "./src/entry.mjs" }),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["marked"],
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
