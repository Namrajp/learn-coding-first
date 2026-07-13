# Blog Audit Report

## Critical Bugs — FIXED

### 1. Update drops post date
- **File:** `src/pages/api/posts/update.ts`
- **Status:** FIXED — Now fetches existing file date before saving

### 2. RSS links are broken
- **File:** `src/pages/rss.xml.ts`
- **Status:** FIXED — Links now use `/{slug}` instead of `/blog/{slug}`

## High Priority — FIXED

### 3. Draft posts are publicly visible
- **File:** `src/pages/[slug].astro`
- **Status:** FIXED — Draft posts now redirect to `/`

### 4. raw.githubusercontent.com serves stale content
- **File:** `src/pages/[slug].astro`, `src/pages/api/posts/list.ts`
- **Status:** FIXED — Switched to `api.github.com/repos/.../contents/...`

### 5. Slug page makes unnecessary API calls
- **File:** `src/pages/[slug].astro`
- **Status:** FIXED — Fetches file directly by slug (2 API calls → 1)

### 6. `atob()` crashes on non-ASCII content
- **Files:** `src/pages/admin/edit/[slug].astro`, `src/pages/admin/index.astro`, `src/pages/api/posts/list.ts`
- **Status:** FIXED — Uses `decodeURIComponent(atob(...))` for UTF-8 safe decode

### 7. Admin dashboard N+1 API calls
- **Files:** `src/pages/admin/index.astro`, `src/pages/api/posts/list.ts`
- **Status:** FIXED — Uses `Promise.allSettled()` for parallel fetches

## Medium Priority — FIXED

### 8. Frontmatter parser duplicated 4 times
- **Status:** FIXED — All callers now use shared `parseFrontmatter()` from `src/lib/frontmatter.ts`
- Added `parsePostFile()`, `parseFrontmatterBody()` helpers
- Added `buildFrontmatter()` and `yamlString()` for safe frontmatter generation

### 9. Homepage sorts oldest-first
- **File:** `src/pages/index.astro`
- **Status:** FIXED — Now sorts newest-first

### 10. Font Awesome loaded globally but unused
- **File:** `src/layouts/Layout.astro`
- **Status:** FIXED — Removed (~30-80KB saved per page)

### 11. Dead script loaded on every page
- **File:** `src/layouts/Layout.astro`
- **Status:** FIXED — Removed `<script src="/src/main.ts">` and deleted `src/main.ts`

### 12. OG image path wrong
- **File:** `src/layouts/Layout.astro`
- **Status:** FIXED — Changed `my-logo.svg` → `my_logo.svg`

### 13. YAML injection risk
- **Files:** `src/pages/api/posts/create.ts`, `src/pages/api/posts/update.ts`
- **Status:** FIXED — Uses `buildFrontmatter()` which applies `yamlString()` escaping

### 14. Missing files
- **Status:** FIXED — Added `public/robots.txt` and `src/pages/404.astro`

### 15. RSS title says "My cool blog"
- **File:** `src/layouts/Layout.astro`
- **Status:** FIXED — Changed to "Learn Coding First"

## Security Concerns — FIXED

### 1. CSRF and origin checks disabled
- **File:** `src/lib/auth.ts`
- **Status:** FIXED — Removed `disableCSRFCheck` and `skipOriginCheck`. Added `http://localhost:4321` to `trustedOrigins`.

### 2. No rate limiting on magic link endpoint
- **File:** `src/pages/api/auth/[...all].ts`
- **Status:** FIXED — KV-based rate limiter: max 3 requests per 15 min per IP+email. Returns 429 when exceeded.

### 3. GitHub API error details leaked to clients
- **Files:** All API routes
- **Status:** FIXED — All return generic error messages

### 4. Path traversal via slug
- **Files:** `src/pages/api/posts/create.ts`, `update.ts`, `get.ts`, `delete.ts`
- **Status:** FIXED — Slug validated with `/^[a-z0-9-]+$/`. Invalid slugs return 400.

## Remaining Low Priority — ALL DONE

- Dead scripts in `package.json` — `dev:simple` was already removed; `preview` runs `astro preview` (valid)
- `test.md` placeholder post — DELETED (was draft with no content)
