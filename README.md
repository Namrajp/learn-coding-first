# Learn Coding First

Astro 7 blog running on Cloudflare Workers, deployed at [learncodingfirst.com](https://learncodingfirst.com).

Posts are markdown files stored in this GitHub repo (`src/posts/`). The admin UI creates/edits/deletes
posts via the GitHub Contents API — every change is a real git commit. Auth is passwordless (Magic Link
via better-auth + Resend). Draft posts auto-publish on their scheduled date via a Cloudflare Cron Trigger.

For full architecture, routes, auth flow, caching, and gotchas, see [`AGENTS.md`](./AGENTS.md) — that file
is the source of truth for how this project works and is kept up to date with infra/behavior changes.

## Stack

Astro 7 · `@astrojs/cloudflare` (SSR on Workers) · Tailwind CSS 4 · better-auth + D1 + KV ·
Drizzle ORM · Resend · GitHub Contents API · `marked` + `sanitize-html`

## Commands

| Command                                               | Action                                                           |
| :---------------------------------------------------- | :--------------------------------------------------------------- |
| `npm install`                                         | Install dependencies                                             |
| `npm run dev`                                         | Start local dev server at `localhost:4321`                       |
| `npm run build`                                       | Build for production to `./dist/` (runs `postbuild` cron shim)   |
| `npx wrangler deploy`                                 | Deploy the built Worker to Cloudflare                            |
| `npx wrangler dev --config dist/server/wrangler.json` | Run the real built Worker locally (needed to test `scheduled()`) |
| `npx eslint src/`                                     | Lint                                                             |
| `npx prettier --write .`                              | Format                                                           |

Deploys normally happen automatically via `.github/workflows/deploy.yml` on every push to `main`.

## Local setup

1. `npm install`
2. Copy secrets into `.dev.vars` (not committed): `GITHUB_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`.
3. `npm run dev` — local dev reads posts from the filesystem (`src/posts/`), not the GitHub API.

## Testing the auto-publish cron locally

The `scheduled()` handler (auto-publishes due drafts) only exists in the **built** Worker, not in
`astro dev`. To test it:

```bash
npm run build
npx wrangler dev --config dist/server/wrangler.json --port 8788
curl "http://localhost:8788/cdn-cgi/handler/scheduled"
```

This uses the real `GITHUB_TOKEN` and **will make a real commit** for any post with `status: draft`
and a frontmatter `date` <= today — only run this against test posts, not real in-progress drafts.
