# Agents

## Project

Astro 7 blog on Cloudflare Workers. Posts stored as markdown in GitHub repo (`Namrajp/my-new-astro-blog`). Admin UI for create/edit/delete via GitHub API. Magic Link auth via better-auth + Resend email. Dark mode toggle with system preference support.

## Stack

- Astro 7 + `@astrojs/cloudflare` (SSR on Workers)
- Tailwind CSS 4 (class-based dark mode)
- better-auth + better-auth-cloudflare (D1 + KV)
- Drizzle ORM (SQLite/D1 for auth tables)
- Resend (magic link emails)
- GitHub Contents API (post CRUD)

## Commands

```bash
npm run build          # Astro build
npx wrangler deploy    # Deploy to Cloudflare Workers
npx eslint src/        # Lint
npx prettier --write . # Format
```

## Key Files

```
astro.config.mjs        # Cloudflare adapter, output: "server"
wrangler.toml           # D1 + KV bindings, secrets
env.d.ts                # CloudflareBindings, App.Locals types
src/middleware.ts        # Auth guard + env injection (always checks session)
src/lib/auth.ts         # better-auth instance (CSRF/origin enabled)
src/lib/github.ts       # GitHub API (createOrUpdateFile, deleteFile, listFiles)
src/lib/email.ts        # Resend magic link sender
src/lib/frontmatter.ts  # YAML frontmatter (parseFrontmatter, parseFrontmatterBody, parsePostFile, yamlString, buildFrontmatter)
src/content.config.ts   # Post schema (title, date, tags, status)
src/db/auth.schema.ts   # Drizzle: user, session, verification tables
src/components/ThemeToggle.astro  # Dark/light theme switch
src/components/Footer.astro       # Footer (shows Login/Admin based on auth)
```

## Routes

```
/                       Homepage (SSR)
/<slug>                 Blog post (SSR, draft posts hidden)
/blog/page/[page]       Paginated archive (prerendered)
/tag/[tag]              Posts by tag (prerendered)
/login                  Magic link login
/admin                  Dashboard (SSR, protected)
/admin/new              Create post (SSR, protected)
/admin/edit/[slug]      Edit post (SSR, protected)
/api/auth/[...all]      better-auth handler (public, rate-limited)
/api/posts/*            Post CRUD API (protected)
/404                    Custom 404 page
```

## Auth Flow

1. User enters email at `/login`
2. Client sends POST to `/api/auth/sign-in/magic-link`
3. Server sends magic link email via Resend (rate-limited: 3/15 min per IP+email)
4. User clicks link → session cookie set → redirected to `/admin`
5. Middleware always checks session, redirects to `/login` if not authenticated on protected routes
6. Footer shows "Login" when not logged in, "Admin" when logged in

## Post Storage

Posts are markdown files in `src/posts/` of the GitHub repo. Admin CRUD goes through GitHub Contents API — every create/edit/delete is a git commit. The `[slug].astro` page fetches directly via `api.github.com` (not `raw.githubusercontent.com` which caches). Draft posts are hidden from public pages.

## Frontmatter

Use shared helpers from `src/lib/frontmatter.ts`:
- `parseFrontmatter(content)` — parses frontmatter from raw markdown (handles quoted/unquoted titles)
- `parseFrontmatterBody(content)` — extracts markdown body after frontmatter
- `parsePostFile(content)` — combines both into `{ data, body }`
- `yamlString(s)` — escapes `\`, `"`, newlines, tabs for safe YAML output
- `buildFrontmatter({title, date, tags, status, description})` — generates frontmatter block

```yaml
---
title: "Post Title"
date: 2026-02-21
description: "Optional description"
tags:
  - tutorial
  - python
status: published
---
```

Tags support both inline (`tags: [a, b]`) and YAML list format.

## Slug Validation

All post API routes (`create`, `update`, `get`, `delete`) validate slugs with `/^[a-z0-9-]+$/`. Invalid slugs return 400. Slugs are generated from titles via `generateSlug()` in `github.ts`.

## Cloudflare Bindings

- `DB` — D1 database (auth tables)
- `SESSION` — KV namespace (session store, rate limiting counters, post list cache with `posts:list` key)
- `GITHUB_TOKEN` — Secret (GitHub PAT with Contents: Read/Write)
- `RESEND_API_KEY` — Secret (Resend API)
- `BETTER_AUTH_SECRET` — Secret (session signing)
- `BETTER_AUTH_URL` — Env var (`https://learncodingfirst.com`)

## Gotchas

- `import { env } from "cloudflare:workers"` does NOT work in Astro API routes. Use `ctx.locals.env` set by middleware.
- GitHub API requires `User-Agent` header. Cloudflare Workers `fetch` doesn't send one by default.
- Prerendered pages don't update until redeploy. Admin dashboard fetches fresh data from GitHub API.
- Session table needs Cloudflare geolocation columns (timezone, city, country, etc.) or better-auth throws 500.
- Theme toggle button needs `z-[100]` to stay above the homepage banner (`z-50`).
- Theme toggle script must clone/replace button on `astro:after-swap` to avoid duplicate event listeners.
- Use `api.github.com/repos/.../contents/...` for always-fresh data. `raw.githubusercontent.com` caches after writes.
- `marked` needs `optimizeDeps.exclude` in astro.config.mjs — Vite's dep optimizer breaks the import.
- `BETTER_AUTH_URL` in `[vars]` applies to local dev. Override in `.dev.vars` with `http://localhost:4321`.
- Cancel/navigation links should be outside `<form>` tags to avoid browser quirks.
- Edit page SSR should fetch file directly (`src/posts/${slug}.md`) instead of calling `listFiles()` first.
- All GitHub API responses must be decoded with UTF-8 safe `decodeURIComponent(atob(...))` — plain `atob()` crashes on non-ASCII content.
- Post list is cached in KV (`posts:list` key, 60s TTL). Invalidate on create/update/delete.
- Always use `buildFrontmatter()` for writing frontmatter — never interpolate user input directly into YAML strings.
- Magic link endpoint is rate-limited via KV counters. Keys use `ratelimit:magic-link:{ip}:{email}` with 15-min TTL.
- CSRF and origin checks are enabled. `trustedOrigins` includes `https://learncodingfirst.com` and `http://localhost:4321`.
- Footer auth state is SSR — middleware sets `locals.user` on all routes, not just protected ones.
