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
src/middleware.ts        # Auth guard + env injection
src/lib/auth.ts         # better-auth instance
src/lib/github.ts       # GitHub API (createOrUpdateFile, deleteFile, listFiles)
src/lib/email.ts        # Resend magic link sender
src/lib/frontmatter.ts  # YAML frontmatter parser
src/content.config.ts   # Post schema (title, date, tags, status)
src/db/auth.schema.ts   # Drizzle: user, session, verification tables
src/components/ThemeToggle.astro  # Dark/light theme switch
```

## Routes

```
/                       Homepage (SSR)
/<slug>                 Blog post (prerendered)
/blog/page/[page]       Paginated archive (prerendered)
/tag/[tag]              Posts by tag (prerendered)
/login                  Magic link login
/admin                  Dashboard (SSR, protected)
/admin/new              Create post (SSR, protected)
/admin/edit/[slug]      Edit post (SSR, protected)
/api/auth/[...all]      better-auth handler (public)
/api/posts/*            Post CRUD API (protected)
```

## Auth Flow

1. User enters email at `/login`
2. Client sends POST to `/api/auth/sign-in/magic-link`
3. Server sends magic link email via Resend
4. User clicks link → session cookie set → redirected to `/admin`
5. Middleware protects `/admin/*` and `/api/posts/*`

## Post Storage

Posts are markdown files in `src/posts/` of the GitHub repo. Admin CRUD goes through GitHub Contents API — every create/edit/delete is a git commit. Prerendered pages (`[slug].astro`, `[tag].astro`) are built at deploy time, so changes require redeploy to appear publicly.

## Frontmatter Format

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

Tags support both inline (`tags: [a, b]`) and YAML list format (`tags:\n  - a\n  - b`). Use the shared parser at `src/lib/frontmatter.ts`.

## Cloudflare Bindings

- `DB` — D1 database (auth tables)
- `SESSION` — KV namespace (session store)
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
