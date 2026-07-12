# Learn Coding First

A blog about programming fundamentals and AI, built with Astro 7 and deployed on Cloudflare Workers.

**Live site:** [learncodingfirst.com](https://learncodingfirst.com)

## Overview

Learn Coding First is a technical blog covering Python, AI tools, web development, and software architecture. Posts are stored as markdown files in a GitHub repository and managed through an admin UI with Magic Link authentication.

## Features

- **Blog posts** with tag-based filtering and pagination
- **Admin dashboard** for creating, editing, and deleting posts
- **Magic Link login** — no passwords, just email
- **Markdown editor** with live preview
- **Dark/light theme toggle** — persists preference, respects system settings
- **SEO-friendly** — prerendered pages, sitemap, RSS feed
- **Responsive design** with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 7 (SSR + prerendering) |
| Hosting | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) — auth tables only |
| Storage | Cloudflare KV — session store |
| Auth | better-auth + magic link plugin |
| Email | Resend (magic link delivery) |
| Posts | GitHub Contents API (markdown files) |
| Styling | Tailwind CSS 4 |
| ORM | Drizzle ORM |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Cloudflare Worker               │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   D1     │  │   KV     │  │  GitHub API  │   │
│  │  (auth)  │  │ (session)│  │  (posts)     │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
│                                                   │
│  SSR Pages: /, /admin/*, /api/*                  │
│  Prerendered: /<slug>, /tag/*, /blog/page/*     │
└─────────────────────────────────────────────────┘
```

### How Posts Work

1. Posts live as `.md` files in `src/posts/` of the GitHub repo
2. Admin creates/edits/deletes via the GitHub Contents API (each action = a git commit)
3. Prerendered pages (`/<slug>`, `/tag/*`) are built at deploy time
4. Admin dashboard fetches fresh data from GitHub on every load
5. Public pages require a redeploy to show new/changed posts

### How Auth Works

1. User enters email at `/login`
2. Server sends a magic link email via Resend
3. User clicks link → session created in D1/KV → cookie set
4. Middleware protects `/admin/*` and `/api/posts/*`

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account with D1 and KV
- GitHub Personal Access Token (Contents: Read/Write)
- Resend API key

### Local Development

```bash
# Install dependencies
npm install

# Set up local database
npx wrangler d1 migrations apply blog-auth-db --local

# Start dev server
npm run dev
```

Secrets go in `.dev.vars` (not committed):

```
GITHUB_TOKEN=ghp_...
BETTER_AUTH_SECRET=...
RESEND_API_KEY=re_...
```

### Deployment

```bash
# Build and deploy
npm run build
npx wrangler deploy

# Set secrets (first time only)
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put RESEND_API_KEY

# Apply database migrations
npx wrangler d1 migrations apply blog-auth-db --remote
```

## Project Structure

```
src/
├── components/         # Astro components
│   ├── Breadcrumb.astro
│   ├── PostCard.astro
│   ├── TagSidebar.astro
│   ├── ThemeToggle.astro  # Dark/light theme switch
│   ├── Nav.astro
│   └── Footer.astro
├── db/                 # Drizzle schema (auth tables)
├── layouts/            # Main Layout.astro
├── lib/                # Core modules
│   ├── auth.ts         # better-auth server instance
│   ├── auth-client.ts  # better-auth client instance
│   ├── email.ts        # Resend email sender
│   ├── frontmatter.ts  # YAML frontmatter parser
│   └── github.ts       # GitHub Contents API wrapper
├── pages/              # Routes
│   ├── [slug].astro    # Blog post (prerendered)
│   ├── index.astro     # Homepage (SSR) — 5 featured cards
│   ├── login.astro     # Magic link login
│   ├── admin/          # Admin dashboard + create/edit
│   ├── api/            # Auth + post CRUD endpoints
│   ├── blog/page/      # Paginated archive (prerendered)
│   └── tag/            # Tag filter pages (prerendered)
├── posts/              # Markdown blog posts
├── styles/             # Global CSS (Tailwind + dark mode)
└── middleware.ts        # Auth guard + env injection
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| ALL | `/api/auth/*` | better-auth handler (public) |
| GET | `/api/posts/list` | List all posts (auth required) |
| GET | `/api/posts/get?slug=` | Get single post (auth required) |
| POST | `/api/posts/create` | Create post (auth required) |
| POST | `/api/posts/update` | Update post (auth required) |
| POST | `/api/posts/delete` | Delete post (auth required) |

## Post Frontmatter

```yaml
---
title: "Post Title"
date: 2026-02-21
description: "Optional meta description"
tags:
  - tutorial
  - python
status: published  # or "draft"
---
```

## License

Private project by Namraj Pudasaini.
