# Roadmap: Traffic Growth & Architecture Improvements

Living plan for growing learncodingfirst.com's traffic and hardening its architecture. Based on a
full audit (2026-07-24) of analytics, performance, content taxonomy, SEO, distribution, testing,
and accessibility. Update this file as items ship or priorities change.

## Current state

| Area | Status (as of 2026-07-24, post-Tier-1) |
|---|---|
| Analytics | ✅ Cloudflare Web Analytics wired in — page views/referrers/Core Web Vitals now tracked. |
| Images / Cloudflare Images | ❌ Not declared in bindings, not used. No post currently has embedded images. |
| Content taxonomy | ✅ Tags normalized (lowercase/trimmed/deduped) going forward + backfilled. ⚠️ Still no category/series field. |
| Newsletter | ✅ Fully automated: signup → welcome email → new-post blast (create, update, **and cron auto-publish** all trigger it now), admin UI at `/admin/newsletter`. |
| Search | ⚠️ Title/tag substring match only, no full-text body search. Fine at ~28 published posts, won't scale. |
| Caching | ✅ Homepage, `/blog` archive, and `[slug].astro` all set `Cache-Control: public, max-age=60, stale-while-revalidate=300`. |
| SEO | ✅ Strong: structured data (WebSite/Article/BreadcrumbList/Person), sitemaps, OG/Twitter meta, canonical tags, RSS. ❌ One static OG image shared by every post/page. Naive tag-overlap-only related posts. |
| Social distribution | ⚠️ Manual share buttons (X, LinkedIn) only. No auto cross-posting, no comments/webmentions. |
| Testing | ❌ Zero test files or test runner configured. |
| Accessibility | ⚠️ No skip-link, no `<main>` landmark, no systemic focus-visible styles. |
| CI/CD safety | ✅ Post-deploy health check added — catches domain-binding/routing regressions automatically. |

Full audit detail: see the research notes in commit history / AGENTS.md for the current
infrastructure model (KV caching, cron auto-publish, GitHub-API-backed CRUD).

## Tier 1 — High impact, low effort

- [x] **Add Cloudflare Web Analytics.** *(Shipped 2026-07-24)* Beacon script added to
      `src/layouts/Layout.astro`'s `<head>` (token generated via the Cloudflare dashboard, since
      the automation API token doesn't have the RUM/Analytics scope to provision this
      programmatically). Closes the previous zero-visibility gap — page views, referrers, and
      Core Web Vitals are now tracked cookielessly.
- [x] **Cache the homepage and `/blog` archive.** *(Shipped 2026-07-24)* Added
      `Cache-Control: public, max-age=60, stale-while-revalidate=300` (matching `[slug].astro`'s
      existing pattern) to `src/pages/index.astro`, `src/pages/blog/index.astro`, and
      `src/pages/blog/[page].astro`.
- [x] **Normalize tag casing.** *(Shipped 2026-07-24)* Added `normalizeTags()` to
      `src/lib/frontmatter.ts` (lowercase, trim, dedupe), wired into `buildFrontmatter()` so all
      future create/update writes are normalized automatically. Backfilled all 20 affected existing
      posts via the new rerunnable `scripts/normalize-tags.mjs` (`node scripts/normalize-tags.mjs
      --dry-run` to preview, without `--dry-run` to apply).
- [x] **Trigger newsletter blast from the cron auto-publish path.** *(Shipped 2026-07-24)*
      `scripts/inject-cron.mjs`'s generated `scheduled()` shim now inlines a `sendPostNotification()`
      equivalent (mirrors `src/lib/newsletter.ts`, duplicated rather than imported since the shim is
      a standalone post-build file with no access to Astro's hashed build chunks) and calls it after
      each successful auto-publish. Also fixed the equivalent gap in `src/pages/api/posts/update.ts`
      — manually flipping a draft to published via the admin edit UI now notifies subscribers too
      (only on the draft→published transition, not on every edit of an already-published post).
      Verified end-to-end against the real repo + Resend's `delivered@resend.dev` test address.
- [x] **Add a post-deploy health check to CI.** *(Shipped 2026-07-24)* `.github/workflows/deploy.yml`
      now curls the live domain after `wrangler deploy` (5 retries, 10s apart) and asserts 200, then
      checks `sitemap-posts.xml` has at least 1 post — fails the CI run with a pointer to
      `skills/deployment/SKILL.md` if either check fails, to catch a repeat of the domain-binding
      regression automatically instead of relying on manual discovery.

## Tier 2 — Medium effort, meaningful SEO/growth levers

- [ ] **Per-post OG images.** Every post currently shares `public/og-default.png`, so social
      shares look identical regardless of content — hurts CTR from X/LinkedIn/Slack previews.
      Options: generate at publish time (Satori-style, run alongside the create/cron pipeline,
      commit the PNG back via GitHub Contents API or push to Cloudflare Images) vs. an on-demand
      OG-image Worker route rendered per-slug.
- [ ] **Full-text search via Pagefind.** Current search (`src/pages/blog/index.astro`) is
      title/tag substring matching only, no body content search, no ranking. Pagefind builds a
      static search index at build time — fits the existing SSG/SSR-hybrid model with no new
      backend cost.
- [ ] **Improve Related Posts algorithm.** `src/components/RelatedPosts.astro` currently does pure
      tag-overlap counting. Add recency weighting once tags are normalized (Tier 1), and consider
      surfacing same-series posts (see below) with priority over generic tag overlap.
- [ ] **Split long multi-part posts into a series.** E.g. the Docker post currently concatenates
      "Part 1–9" as headers inside a single markdown file. Add `series` / `seriesOrder` fields to
      `src/content.config.ts`, split into individually-indexable posts, and add a pillar/hub page
      per series — each part becomes independently rankable and internal linking improves.
- [ ] **Accessibility basics.** Add a skip-to-content link, wrap the page slot in a semantic
      `<main>` in `Layout.astro`, and add systemic `focus-visible` utility classes for nav/share/
      form interactive elements (currently only present ad-hoc on a couple of form inputs).

## Tier 3 — Larger / structural

- [ ] **Comments via giscus.** GitHub Discussions-backed, free, fits the already GitHub-centric
      architecture (posts, auth-adjacent infra already assume a GitHub relationship). Adds
      engagement/dwell-time signal with near-zero added infra.
- [ ] **Auto cross-post on publish.** Push new posts to X/Mastodon/LinkedIn automatically, using
      the same trigger points as the newsletter blast (`api/posts/create.ts` + the cron shim).
- [ ] **Add test coverage.** Zero tests exist today. Start with Vitest unit tests for pure-logic
      libs (`src/lib/frontmatter.ts`, `src/lib/markdown.ts`, rate-limiting, `auth-config.ts`), then
      a couple of Playwright smoke tests for the critical path (login → create → publish → verify
      live) to catch regressions in the CRUD/auth/cron pipeline before they reach production.
- [ ] **Reduce per-request GitHub API dependency (architecture change).** Today, KV cache misses
      fall back to live GitHub API calls at request time — real latency and rate-limit risk under
      traffic spikes. Consider a push-based model: every content-changing action (create/update/
      delete/cron-publish) already knows the content changed — have it write a full posts-index
      JSON directly into KV at that moment, so request-time reads become KV-only and the GitHub API
      is fully removed from the hot path (only touched on writes, never on reads).
- [ ] **Cloudflare Images.** Not declared in `wrangler.toml`/`env.d.ts` today. Add once posts start
      including cover images, paired with `astro:assets`/`<Image>` for responsive, lazy-loaded
      delivery instead of raw `<img>` tags.

## Notes

- Prioritization above is impact-vs-effort, not a hard sequence — re-order as real traffic data
  (once Tier 1's analytics ships) shows which levers actually move the needle.
- See `skills/deployment/SKILL.md` for the deploy/verify/rotate-secrets workflow and
  `AGENTS.md` for the current architecture reference (KV caching, cron auto-publish mechanics,
  auth flow, rate limiting).
