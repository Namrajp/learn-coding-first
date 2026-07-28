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
      exclude: ["marked"],
    },
    ssr: {
      noExternal: ["sanitize-html", "better-auth"],
    },
  },
  site: "https://learncodingfirst.com",
  integrations: [sitemap()],
  redirects: {
    "/blog/page/1": "/blog",
    "/24-11-2025-create-minimal-api": "/create-minimal-api-asp-net-core",
    "/24-11-2025-dependency-injection": "/dependency-injection-in-asp-net",
    "/python_environments": "/virtual-environments-in-python",
  },
});
