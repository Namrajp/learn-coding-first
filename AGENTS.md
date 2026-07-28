# Agents

## Project

Astro 7 blog on Cloudflare Workers. Posts stored as markdown in GitHub repo (`Namrajp/learn-coding-first`). Admin UI for create/edit/delete via GitHub API. Magic Link auth via better-auth + Resend email. Role-based access control (admin/editor). Dark mode toggle with system preference support. Comprehensive SEO implementation with structured data, sitemaps, OG/Twitter meta, and breadcrumbs.

## Stack

- Astro 7 + `@astrojs/cloudflare` (SSR on Workers)
- Tailwind CSS 4 (class-based dark mode)
- better-auth + better-auth-cloudflare (D1 + KV)
- Drizzle ORM (SQLite/D1 for auth tables)
- Resend (magic link emails)
- GitHub Contents API (post CRUD)
- `marked` + `sanitize-html` via `src/lib/markdown.ts` (markdown rendering with XSS protection + TOC extraction)
- `@resvg/resvg-js` (build-time OG image PNG generation from SVG strings)
- `@astrojs/sitemap` (auto-generated sitemap index)
- `@astrojs/rss` (RSS feed with content:encoded)
- Google Search Console verified (meta tag), sitemaps submitted

## Commands

```bash
npm run build          # Astro build
npx wrangler deploy    # Deploy to Cloudflare Workers
npx eslint src/        # Lint
npx prettier --write . # Format
```

## Key Files

```
astro.config.mjs        # Cloudflare adapter, output: "server", @astrojs/sitemap, redirects, optimizeDeps.exclude
.prettierignore         # Excludes src/posts (authored markdown) + build/generated output
wrangler.toml           # Worker name, D1 + KV bindings, [triggers] crons (top-level source of truth for deploy)
scripts/inject-cron.mjs # Postbuild: injects cron_triggers + scheduled() auto-publish shim into dist/server/wrangler.json (see "Cron / Auto-Publish Drafts")
scripts/check-taxonomy.mjs # Prebuild (runs first): enforces slug/category/tag rules (see "Categories")
scripts/generate-og-pngs.mjs # Prebuild/predev: generates OG PNGs + manifest (see "OG Image Generation")
scripts/fonts/            # Vendored Inter OTF files for OG PNG rendering
src/lib/og-image.ts     # getOgImageUrl() — manifest lookup with og-default.png fallback
src/generated/og-manifest.json # Slug list written by prebuild (bundled into Worker at build time)
env.d.ts                # CloudflareBindings, App.Locals types
src/middleware.ts        # Auth guard + env injection (queries user table for role, protected: /admin, /api/posts, /api/admin)
src/lib/auth.ts         # better-auth instance (CSRF/origin enabled, additionalFields for role)
src/lib/auth-config.ts  # Authorized users list, DB queries, role management
src/lib/github.ts       # GitHub API (createOrUpdateFile, deleteFile, listFiles, getDirectorySha)
src/lib/email.ts        # Resend magic link sender
src/lib/frontmatter.ts  # YAML frontmatter (parseFrontmatter, parseFrontmatterBody, parsePostFile, yamlString, buildFrontmatter, normalizeTags)
src/lib/categories.ts   # CATEGORIES, CATEGORY_SLUGS, isCategory(), getCategory(), RESERVED_TAG_NAMES
src/lib/blog-helpers.ts # PAGE_SIZE, getPublishedPosts, getTagCounts, getCategoryCounts, filterPosts, pageUrl
src/content.config.ts   # Post schema (title, slug, date, description, category, tags, status)
src/db/auth.schema.ts   # Drizzle: user, session, verification, authorized_user tables
src/components/Nav.astro           # Site navigation (enabled in Layout)
src/components/ThemeToggle.astro   # Dark/light theme switch
src/components/Footer.astro        # Footer (shows Login/Admin based on auth)
src/components/Breadcrumb.astro    # Breadcrumb nav + BreadcrumbList JSON-LD
src/components/PrevNext.astro      # Previous/next post navigation
src/components/RelatedPosts.astro  # Tag-based related posts (top 3)
src/components/PostCard.astro      # Post card for archive/tag pages (shows category badge)
src/components/CategoryGrid.astro  # Category card grid on /blog (hides zero-count categories)
src/components/TagSidebar.astro    # Tag sidebar
src/components/NewsletterSignup.astro # Newsletter signup
src/components/PopularPosts.astro  # Popular posts in footer
src/components/ShareButtons.astro  # Share to X/Facebook/LinkedIn
src/components/TableOfContents.astro # Auto-generated TOC from headings
src/components/AuthorBio.astro     # Author section + Person schema + social links
src/lib/markdown.ts               # renderMarkdown() — marked + sanitize + TOC extraction
src/lib/site.ts                   # Centralized AUTHOR, SITE_URL, SOCIAL_LINKS constants
src/lib/tag-meta.ts               # formatTagTitle(), getTagDescription() for SEO-friendly tag pages
public/robots.txt       # Crawl directives + sitemap references
public/manifest.json    # PWA manifest (name, theme-color, icons)
public/og-default.png   # OG image (1200×630)
public/apple-touch-icon.png # Apple touch icon (180×180)
```

## Routes

```
/                       Homepage (SSR)
/<slug>                 Blog post (SSR, draft posts hidden, prev/next nav, related posts)
/blog                   Blog archive, page 1 (SSR, category hub, search, tag + category filters)
/blog/[page]            Blog archive, page 2+ (SSR, search/filter via query params)
/tag/[tag]              Posts by tag (prerendered)
/category/[category]    Posts by category (prerendered, all 8 including empty ones)
/login                  Magic link login (noindex)
/admin                  Dashboard (SSR, protected, inline user management for admins)
/admin/new              Create post (SSR, protected)
/admin/edit/[slug]      Edit post (SSR, protected)
/admin/users            User management page (admin-only)
/api/auth/[...all]      better-auth handler (public, rate-limited)
/api/posts/*            Post CRUD API (protected)
/api/admin/users        User management API (admin-only: GET/POST/DELETE)
/sitemap-posts.xml      Custom sitemap for SSR blog posts
/rss.xml                RSS feed with descriptions + content:encoded
/404                    Custom 404 page (noindex)
```

## Auth Flow

1. User enters email at `/login`
2. Client sends POST to `/api/auth/sign-in/magic-link`
3. Server checks email against `authorized_user` table + hardcoded list (403 if unauthorized)
4. Server sends magic link email via Resend (rate-limited: 3/15 min per IP+email)
5. User clicks link → session cookie set → redirected to `/admin`
6. Middleware protects `/admin/*` and `/api/posts/*`
7. Footer shows "Login" on public pages, "Admin" on protected pages

## Role-Based Access Control

Two roles: `admin` (full access) and `editor` (create/edit only).

**Admin-only features:**

- `/admin/users` — manage authorized users
- Delete posts (button hidden for editors)
- Manage Users section on admin dashboard

**Role assignment:**

- Roles stored in `user` table via better-auth `additionalFields` with `returned: true`
- New users get `editor` by default; admins auto-assigned via `databaseHooks.user.create.after`
- Authorized emails checked against `authorized_user` table (D1) with hardcoded fallback
- Role changes require re-login (session cookie caches user data)

## Post Storage

Posts are markdown files in `src/posts/` of the GitHub repo. Admin CRUD goes through GitHub Contents API — every create/edit/delete is a git commit. The `[slug].astro` page uses KV caching with SHA-based invalidation (see below). Draft posts are hidden from public pages.

## Categories

Every post has exactly one `category` (a single string, never an array). The 8 category slugs are
defined in `src/lib/categories.ts`, which is the **source of truth** for slugs, display labels, and
SEO descriptions:

| Slug              | Label           |
| ----------------- | --------------- |
| `ai`              | AI              |
| `news`            | News            |
| `tutorial`        | Tutorial        |
| `web-development` | Web Development |
| `tools`           | Tools           |
| `productivity`    | Productivity    |
| `essay`           | Essay           |
| `miscellaneous`   | Miscellaneous   |

`miscellaneous` is the fallback: the post APIs default to it when `category` is absent, and
`[slug].astro` reads `post.category ?? "miscellaneous"` so KV entries cached before the taxonomy
shipped still render.

**Rules (all enforced at build time by `scripts/check-taxonomy.mjs`):**

- **One category per post.** Assignment follows a domain-first ladder: AI > Web Development > Tools
  > Productivity > Tutorial > Essay > News > Miscellaneous. A post lands in the first bucket that fits.
- **No tag/category collisions.** A tag may never be a category slug or label (`ai`, `news`,
  `tutorial`, `web-development`, `web development`, `tools`, `productivity`, `essay`,
  `miscellaneous`). `normalizeTags()` in `src/lib/frontmatter.ts` silently strips them from every
  post written through the admin UI; `RESERVED_TAG_NAMES` in `src/lib/categories.ts` is the list.
- **`slug` frontmatter must equal the filename** (minus `.md`), and the filename must match
  `/^[a-z0-9-]+$/`. `create.ts` writes the slug from `generateSlug(title)`; `update.ts` reads it back
  from the stored file (never regenerates it from the possibly-edited title) so it cannot drift.

`node scripts/check-taxonomy.mjs` runs as the **first** `prebuild` step, before
`generate-og-pngs.mjs`. It exits non-zero and names the offending file for a slug mismatch, a
missing/unknown category, or a reserved tag. `scripts/*.mjs` are plain node ESM and cannot import
from `src/lib`, so the category list is duplicated there — keep it in sync with
`src/lib/categories.ts`.

**Where categories surface:** the `/blog` category hub (`src/components/CategoryGrid.astro`), the
`?category=` filter on `/blog` and `/blog/[page]`, prerendered `/category/[category]` pages, the
badge on post pages and `PostCard`, the Home / Blog / Category / Post breadcrumb, `articleSection`
in the Article JSON-LD, each RSS item's `categories`, and the admin dashboard table + filter.

All 8 `/category/[category]` pages are prerendered, including empty ones — `/category/news` renders
an empty state rather than a 404, so the URL already exists the moment a post is assigned to it.
Zero-count categories _are_ hidden from the `/blog` category hub and from the `?category=` dropdowns
(deliberate: don't surface a dead end you can still reach directly).

### Renamed posts (Jul 2026)

Three files were renamed so the filename is a clean slug. Old URLs 301-redirect via
`redirects` in `astro.config.mjs`:

- `/24-11-2025-create-minimal-api` → `/create-minimal-api-asp-net-core`
- `/24-11-2025-dependency-injection` → `/dependency-injection-in-asp-net`
- `/python_environments` → `/virtual-environments-in-python` (the underscore also failed
  `/^[a-z0-9-]+$/` in the post APIs, so that post could not be edited or deleted from the admin UI)

## Blog Search

The blog archive (`/blog` and `/blog/[page]`) has server-side search plus tag and category filtering:

- **Search**: `?q=keyword` — filters by title, description, or tag (case-insensitive substring match)
- **Tag filter**: `?tag=tagname` — filters to posts with exact tag match
- **Category filter**: `?category=web-development` — filters to posts in that category
- **Combined**: `?q=python&tag=api&category=web-development` — all filters applied with AND logic
- **Pagination**: Results are paginated (8 per page). Search/filter params are preserved across pages.
- **Redirect**: `/blog/page/1` → `/blog` (301 redirect in astro.config.mjs)

The search form uses `method="get"` with standard form fields (`name="q"`, `name="tag"`,
`name="category"`), so filters are reflected in the URL and are shareable/bookmarkable. The
filtering, counting, and pagination helpers live in `src/lib/blog-helpers.ts` (`filterPosts`,
`getTagCounts`, `getCategoryCounts`, `pageUrl`) and are shared by both blog pages.

## User Management

Admins can manage authorized users via:

- **Inline on dashboard** (`/admin`): Add user form + user table with remove buttons
- **Dedicated page** (`/admin/users`): Full user management UI

API endpoints at `/api/admin/users`:

- `GET` — list all authorized users (admin-only)
- `POST` — add/update user with role `{email, role}` (admin-only)
- `DELETE` — remove user `{email}` (admin-only)

The `authorized_user` table stores: `id`, `email`, `role`, `addedBy`, `createdAt`.

## Database Schema

Drizzle schema defined in `src/db/auth.schema.ts`:

- **user**: `id`, `name`, `email`, `emailVerified`, `image`, `role` (default: "editor"), `createdAt`, `updatedAt`
- **session**: `id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`, + Cloudflare geolocation fields
- **verification**: `id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`
- **authorized_user**: `id`, `email`, `role`, `addedBy`, `createdAt`

Migrations in `drizzle/`:

- `0000_stale_miek.sql` — base schema
- `0001_add_user_role.sql` — adds `role` column to user table
- `0002_add_authorized_user.sql` — creates `authorized_user` table

## KV Caching for Posts

The `[slug].astro` page uses two-layer caching to avoid hitting the GitHub API on every request:

- **`cache:posts:dir-sha`** (60s TTL) — stores the directory tree SHA of `src/posts/`. Any file change (create/update/delete) changes this SHA, invalidating all cached posts.
- **`cache:post:{slug}`** (300s TTL) — stores parsed frontmatter + body for each post. Cached with the directory SHA at time of fetch.

**Request flow (production):**

1. Get `cache:posts:dir-sha` from KV (1 GitHub API call per 60s if miss)
2. Get `cache:post:{slug}` from KV — if hit and dirSha matches, serve from KV (~1ms)
3. If miss or stale — fetch from GitHub API, store in KV

**Admin mutations** (`create.ts`, `update.ts`, `delete.ts`) invalidate `cache:post:{slug}`, `cache:posts:dir-sha`, and `cache:posts:list` immediately after success.

**Local dev:** Uses `getEntry("posts", slug)` from Astro's content collection (reads local `src/posts/` filesystem). No GitHub API calls, no draft filtering.

**Response headers:** `Cache-Control: public, max-age=60, stale-while-revalidate=300` — browsers cache HTML for 60s, serve stale for up to 5min while revalidating. Also set on `src/pages/index.astro`, `src/pages/blog/index.astro`, and `src/pages/blog/[page].astro` (the homepage and blog archive are the highest-traffic entry points and use the same 60s pattern).

## Tag Normalization

All tags are normalized (lowercased, trimmed, deduplicated) via `normalizeTags()` in
`src/lib/frontmatter.ts`, applied automatically inside `buildFrontmatter()` for every create/update.
This prevents `/tag/[tag]` page fragmentation and search/related-posts mismatches from casing
variants (e.g. `python` vs `Python`). Existing posts were backfilled once via
`scripts/normalize-tags.mjs` (rerunnable — `node scripts/normalize-tags.mjs --dry-run` to preview
any drift, without the flag to apply). `normalizeTags()` also **drops any tag that collides with a
category name** — see "Categories". Display-side capitalization (e.g. "Python" shown in the UI)
is handled separately by CSS `capitalize` classes and `formatTagTitle()` in `src/lib/tag-meta.ts` —
the underlying stored tag value should always stay lowercase.

## Newsletter Auto-Publish Notifications

`sendPostNotification()` (`src/lib/newsletter.ts`) emails all active (non-unsubscribed) Resend
audience contacts when a post goes live. It's triggered from three places, all on the
draft→published transition specifically (not on every edit of an already-published post):

- `src/pages/api/posts/create.ts` — creating a post with `status: published`.
- `src/pages/api/posts/update.ts` — editing a draft to `status: published` (compares against the
  post's previous status fetched from GitHub before overwriting).
- `scripts/inject-cron.mjs`'s generated `scheduled()` shim — the daily auto-publish cron. Since
  that shim is a standalone post-build file with no access to Astro's hashed build chunks, it
  inlines its own copy of the Resend API calls (`listContacts`/`sendEmail` equivalents) rather than
  importing `src/lib/newsletter.ts` directly. Keep both in sync if the email template or Resend API
  usage changes.

## Google Search Console

- **Property**: `learncodingfirst.com`
- **Verification method**: HTML meta tag in `<head>` — `<meta name="google-site-verification" content="XGluNkoesK7Q1TLP07cdzPkFPe9w-_pj_VyTHJsjz2A" />`
- **Sitemaps submitted**: `sitemap-index.xml`, `sitemap-posts.xml`
- **Crawl confirmed**: `methods-functions-and-prototypes-in-javascript` (Jul 23, 2026)

### Structured Data (JSON-LD)

- **WebSite** + SearchAction: homepage (`src/layouts/Layout.astro`)
- **Article**: each blog post (`src/pages/[slug].astro`), including `articleSection` (category label)
- **BreadcrumbList**: every page via `src/components/Breadcrumb.astro`
- **Person**: author bio section (`src/components/AuthorBio.astro`)

### SEO Components

- `src/components/TableOfContents.astro` — auto-generated from headings (3+ required)
- `src/components/ShareButtons.astro` — share to X, Facebook, LinkedIn
- `src/components/AuthorBio.astro` — author section with `rel="me"` social links
- `src/components/PopularPosts.astro` — popular posts in footer
- `src/lib/markdown.ts` — `renderMarkdown()` returns `{ html, toc }` (TOC extracted from headings)
- `src/lib/tag-meta.ts` — `formatTagTitle()`, `getTagDescription()` for SEO-friendly tag pages
- `src/lib/site.ts` — centralized `AUTHOR`, `SITE_URL`, `SOCIAL_LINKS` constants

### OG Image Generation

Each blog post gets a unique 1200×630 PNG OG image for social sharing (LinkedIn, Facebook, Twitter/X).

- **Build-time**: `scripts/generate-og-pngs.mjs` (runs as `prebuild` and `predev`) reads all `src/posts/*.md`, generates SVG via the same visual logic as the old `[slug].svg.ts` endpoint, converts to PNG using `@resvg/resvg-js`, and writes to `public/og/{slug}.png`. Drafts are skipped. Inter fonts are vendored in `scripts/fonts/` (no network fetch).
- **Manifest**: Prebuild writes `public/og/manifest.json` and `src/generated/og-manifest.json` (slug list). `src/lib/og-image.ts` → `getOgImageUrl()` returns per-post PNG URL when listed, else `og-default.png`.
- **Serving**: Static PNGs in `public/og/` are served directly by Astro/Cloudflare — no dynamic endpoint needed.
- **Fallback**: Posts created via admin after the last build have no pre-generated PNG. `getOgImageUrl()` falls back to `og-default.png` until the next deploy regenerates the manifest and PNG.
- **Why PNG, not SVG**: LinkedIn, Facebook, and Twitter do not support SVG for `og:image`. They require raster formats (PNG, JPEG, GIF, WebP). The old `src/pages/og/[slug].svg.ts` endpoint was removed.
- **Dependencies**: `@resvg/resvg-js` (SVG→PNG at build time, no runtime cost).
- **Meta tags**: `og:url` uses the canonical URL (not `Astro.url.href`). `og:image:alt` and `twitter:site` are set.

## Frontmatter

Use shared helpers from `src/lib/frontmatter.ts`:

- `parseFrontmatter(content)` — parses frontmatter from raw markdown (handles quoted/unquoted titles)
- `parseFrontmatterBody(content)` — extracts markdown body after frontmatter
- `parsePostFile(content)` — combines both into `{ data, body }`
- `yamlString(s)` — escapes `\`, `"`, newlines, tabs for safe YAML output
- `buildFrontmatter({title, slug, date, tags, category, status, description})` — generates the
  frontmatter block in that field order, normalizing tags and defaulting an unknown/absent category
  to `miscellaneous`

```yaml
---
title: "Post Title"
slug: "post-title"
date: 2026-02-21
description: "Optional description"
category: "tutorial"
tags: ["python", "generators"]
status: published
---
```

`slug` must equal the filename and `category` must be one of the 8 slugs — see "Categories".
Tags support both inline (`tags: [a, b]`) and YAML list format.

## Slug Validation

All post API routes (`create`, `update`, `get`, `delete`) validate slugs with `/^[a-z0-9-]+$/`. Invalid slugs return 400. Slugs are generated from titles via `generateSlug()` in `github.ts`.

## Input Validation

Post API routes enforce size limits to prevent abuse:

- **Payload size**: Max 1MB (`Content-Length` header check, returns 413)
- **Title**: 1-200 characters (required)
- **Description**: Max 500 characters (optional)
- **Content**: Required, non-empty string

## Rate Limiting

Admin write endpoints (`create`, `update`, `delete`) are rate-limited via KV counters:

- **Key**: `ratelimit:post-write:{ip}` (shared across all write operations)
- **Limit**: 10 requests per minute per IP
- **Window**: 60 seconds

Magic link endpoint uses `ratelimit:magic-link:{ip}:{email}` with 3 requests per 15 minutes.

## Cloudflare Bindings

- `DB` — D1 database (auth tables)
- `SESSION` — KV namespace (session store, rate limiting counters, post list cache with `cache:posts:list` key, post cache with `cache:post:{slug}` key, dir SHA cache with `cache:posts:dir-sha` key)
- `GITHUB_TOKEN` — Secret (GitHub PAT with Contents: Read/Write)
- `RESEND_API_KEY` — Secret (Resend API)
- `RESEND_AUDIENCE_ID` — Secret (Resend newsletter audience)
- `BETTER_AUTH_SECRET` — Secret (session signing)
- `BETTER_AUTH_URL` — Secret/env var (`https://learncodingfirst.com`)

Set secrets with `npx wrangler secret put <NAME>` (reads value from stdin). Local dev reads the same names from `.dev.vars`.

## Deployment & Worker Identity

- **Worker name**: `learn-coding-first` (must match `name` in `wrangler.toml` — this is the single source of truth for which Worker is "the project").
- **Custom domain**: `learncodingfirst.com` is bound to the `learn-coding-first` Worker via a Cloudflare Custom Domain (zone `learncodingfirst.com`), not a Route pattern.
- **CI/CD**: `.github/workflows/deploy.yml` triggers on push to `main` — `npm ci` → `npm run build` (runs `prebuild` → `scripts/generate-og-pngs.mjs`, then `postbuild` → `scripts/inject-cron.mjs`) → `wrangler deploy` via `cloudflare/wrangler-action@v3` using the `CLOUDFLARE_API_TOKEN` repo secret.
- **Verifying prod is in sync**: If prod behaves differently from local dev (e.g. stale data, missing features) with no code-level explanation, check whether the custom domain is actually bound to the `learn-coding-first` Worker and not an old/orphaned Worker name. Query via:
  ```bash
  curl -s -H "Authorization: Bearer $CF_TOKEN" \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/domains/records?zone_id=$ZONE_ID"
  ```
  This has bitten the project once before — an old Worker (`my-new-astro-blog`) held the domain and all the secrets while CI kept deploying an unrelated, secret-less Worker. Both stale Workers were deleted; only `learn-coding-first` should exist on the account now.

## Cron / Auto-Publish Drafts

Draft posts scheduled for the future are auto-published by a daily Cloudflare Cron Trigger — no manual "publish" click needed once the post's `date` arrives.

- **Schedule**: `wrangler.toml` → `[[cron_triggers]] cron = "0 0 * * *"` — runs once daily at **00:00 UTC**.
- **Publish rule**: for every `status: draft` post in `src/posts/`, compare frontmatter `date` (string `YYYY-MM-DD`) to today's UTC date (also `YYYY-MM-DD`):
  - `date <= today` → flip `status: draft` → `status: published` (commits directly via GitHub Contents API) and invalidate `cache:post:{slug}`, `cache:posts:list`, `cache:posts:dir-sha` in KV.
  - `date > today` → skip; stays a draft until its own day's midnight run.
  - A post dated **today** publishes on **today's** midnight-UTC run (not tomorrow's) — the check is `date <= today`, not `date < today`.
- **Implementation gotcha**: `@astrojs/cloudflare` v14+ has **no `entrypoint` option** — you cannot pass a custom Worker entry file to `cloudflare()` in `astro.config.mjs` to add a `scheduled()` export. An earlier attempt to do this (`adapter: cloudflare({ entrypoint: "./src/entry.mjs" })`) was silently ignored by the adapter; the cron fired on schedule but the deployed Worker had no `scheduled()` handler at all, so drafts never actually auto-published. Verify with `wrangler dev` + `curl "http://localhost:PORT/cdn-cgi/handler/scheduled"` against a real build — if it prints `Handler does not export a scheduled() function`, the handler isn't wired.
- **Fix / current mechanism**: `scripts/inject-cron.mjs` (run via `package.json`'s `postbuild` hook, after `astro build`) generates `dist/server/scheduled-entry.mjs` — a small shim that imports the real Astro-generated entry (`config.main`), re-exports `fetch` untouched, and adds the `scheduled()` handler with the auto-publish logic inline (no imports needed beyond global `fetch`/`atob`/`btoa`). It then rewrites `dist/server/wrangler.json`'s `main` to point at the shim instead of the original entry file. This is why the auto-publish logic lives in `scripts/inject-cron.mjs` rather than a `src/` file — it must be generated post-build, after Astro has produced the real entry point to wrap.
- **Testing the cron locally**: `npm run build && npx wrangler dev --config dist/server/wrangler.json --port 8788` then `curl "http://localhost:8788/cdn-cgi/handler/scheduled"`. This uses the real `GITHUB_TOKEN` from `.dev.vars` and **will make real commits** to the GitHub repo for any due draft — only run against test posts, not real in-progress drafts, unless you intend to publish them.

## Gotchas

- `import { env } from "cloudflare:workers"` does NOT work in Astro API routes. Use `ctx.locals.env` set by middleware.
- GitHub API requires `User-Agent` header. Cloudflare Workers `fetch` doesn't send one by default.
- Prerendered pages don't update until redeploy. Admin dashboard fetches fresh data from GitHub API.
- Session table needs Cloudflare geolocation columns (timezone, city, country, etc.) or better-auth throws 500.
- Theme toggle button needs `z-[100]` to stay above the homepage banner (`z-50`).
- Theme toggle script must clone/replace button on `astro:after-swap` to avoid duplicate event listeners.
- Use `api.github.com/repos/.../contents/...` for always-fresh data. `raw.githubusercontent.com` caches after writes.
- `marked` needs `optimizeDeps.exclude` in astro.config.mjs — Vite's dep optimizer breaks the import (stale/missing `deps_ssr` cache file errors). `sanitize-html` must NOT be in `optimizeDeps.exclude` — it causes `require is not defined` on post pages in the Cloudflare Workers dev runner. Both need `ssr.noExternal` for proper SSR bundling.
- `@astrojs/rss` must be >= 4.0.19. Older releases (e.g. 4.0.12) call `z.function().returns()` at module scope, which no longer exists in the Zod 4 that Astro 7 ships. The import throws before the route registers, so `/rss.xml` silently falls through to `[slug].astro` and 302-redirects to `/` instead of erroring — the feed looks "missing" rather than broken. Symptom to watch for: `[slug.rss.xml] Post not found in content collection` in the dev log.
- `rss.xml.ts` must filter `status !== "draft"` itself. `getCollection("posts")` returns drafts too, and unlike the page routes there is no other guard, so an unfiltered feed publishes unreleased posts.
- `BETTER_AUTH_URL` in `[vars]` applies to local dev. Override in `.dev.vars` with `http://localhost:4321`.
- Cancel/navigation links should be outside `<form>` tags to avoid browser quirks.
- Edit page SSR should fetch file directly (`src/posts/${slug}.md`) instead of calling `listFiles()` first.
- All GitHub API responses must be decoded with UTF-8 safe `decodeURIComponent(atob(...))` — plain `atob()` crashes on non-ASCII content.
- Post list is cached in KV (`cache:posts:list` key, 60s TTL). Invalidate on create/update/delete.
- Always use `buildFrontmatter()` for writing frontmatter — never interpolate user input directly into YAML strings. Any new frontmatter field must be added to `ParsedFrontmatter`, `parseFrontmatter()` AND `buildFrontmatter()`, or admin edits will silently wipe it on the next save.
- The KV post cache (`cache:post:{slug}`) stores a serialized post object. When its shape changes, read new fields defensively (`post.category ?? "miscellaneous"`) — entries written before the deploy live for up to 5 minutes and will not have them.
- `src/lib/categories.ts` is the source of truth for categories. `scripts/check-taxonomy.mjs` duplicates the list because plain node ESM scripts cannot import from `src/lib` — update both.
- Category pages are prerendered, so a post assigned to a category via the admin UI will not appear on `/category/<slug>` until the next deploy — the same constraint the `/tag/[tag]` pages have. The page itself always exists (all 8 are generated), so it is never a 404.
- `src/posts/` is in `.prettierignore`. `npx prettier --write .` used to restyle the code samples inside posts (collapsing hand-aligned trailing comments); post markdown is now formatted by hand. Don't remove that entry without checking the diff it produces.
- Magic link endpoint is rate-limited via KV counters. Keys use `ratelimit:magic-link:{ip}:{email}` with 15-min TTL.
- CSRF and origin checks are enabled. `trustedOrigins` includes `https://learncodingfirst.com` and `http://localhost:4321`.
- Do NOT check session on all routes in middleware — `createAuth()` creates a new better-auth + D1 connection per request, which makes `ClientRouter` navigation time out silently. Only check on protected routes.
- Protected routes in middleware: `["/admin", "/api/posts", "/api/admin"]`. Any new protected API route must be added here or `ctx.locals.user` will be undefined.
- Middleware queries the `user` table directly for the role (better-auth's `getSession` doesn't return custom fields). Role is stored in `context.locals.user.role`.
- better-auth `additionalFields` with `returned: true` is required to include custom fields (like `role`) in the session object. Without it, `session.user.role` will be undefined at runtime even if the type says otherwise.
- The `databaseHooks.user.create.after` hook runs only on NEW user creation. Existing users created before role column was added need manual UPDATE via D1 SQL.
- Role changes in the `user` table don't invalidate existing sessions — users must re-login to see updated role in the UI.
- The `authorized_user` table is separate from the `user` table. `authorized_user` controls who can receive magic links; `user.role` controls access level after login.
- Use `renderMarkdown()` from `src/lib/markdown.ts` — returns `{ html, toc }`. Do not import `marked`/`sanitizeHtml` directly in page components.
- `src/lib/site.ts` centralizes `AUTHOR`, `SITE_URL`, `SOCIAL_LINKS`. Use these instead of hardcoding URLs/names.
- `@astrojs/cloudflare`'s `cloudflare()` adapter has no `entrypoint` option (as of v14) — do not try to pass a custom Worker entry file there to add `scheduled()`/other exports; it's silently ignored. Use `scripts/inject-cron.mjs` (postbuild) to wrap the generated entry instead. See "Cron / Auto-Publish Drafts" above.
- OG images must be raster (PNG/JPEG), not SVG. LinkedIn, Facebook, and Twitter reject `og:image` with `Content-Type: image/svg+xml`. The old `src/pages/og/[slug].svg.ts` was replaced by build-time PNG generation in `scripts/generate-og-pngs.mjs`. Posts created after the last build have no PNG and fall back to `og-default.png` — redeploy to generate their OG image.
- If `/admin` (or any GitHub-API-backed page) shows fewer/older posts on production than in local dev with no code explanation, don't assume it's a caching or code bug first — check that `learncodingfirst.com`'s custom domain actually points at the `learn-coding-first` Worker (see "Deployment & Worker Identity" above). A second, orphaned Worker holding the domain + secrets is a real failure mode that happened here.
