# Blog Launch MVP Plan

## Branch

Working branch: `blog-launch-mvp-plan`

This plan assumes:

- Launch scope is the blog only.
- Primary launch objective is traffic.
- Secondary objective later is email signups.
- Audience is beginner to mid-level developers and students.
- Main visitor action is reading key posts.

## MVP Definition

Minimum launch surface:

- Homepage
- Blog index
- 3-5 strong launch posts
- About page
- Contact or CTA destination

## Current Audit

### 1. Homepage

Status: exists, not launch-ready

Current gaps:

- `src/pages/index.astro` is still a generic "Homepage" with a post list.
- There is no clear positioning for beginner to mid-level developers/students.
- There is no featured-post strategy.
- There is no strong CTA such as "Start here" or "Read the guides".

### 2. Blog Index

Status: exists, mostly reusable

Current gaps:

- `src/pages/blog/page/[page].astro` functions as an archive, not a curated launch landing page.
- Tag exploration exists, but there is no topic prioritization for the target audience.
- Copy is functional but generic.

### 3. Launch Posts

Status: enough raw inventory exists, but selection is not curated

Current candidate posts for launch:

- `src/posts/python-guide.md`
- `src/posts/prompting-guide.md`
- `src/posts/claude-commands.md`
- `src/posts/numpy-guide.md`
- `src/posts/pandas-guide.md`

Backup candidates:

- `src/posts/python_environments.md`
- `src/posts/generators-and-iterators-in-python.md`
- `src/posts/oop-in-python-and-inheritance.md`

Current gaps:

- No visible "start here" sequence for new readers.
- Some older posts appear more tutorial-note-like than launch-anchor content.
- There is no editorial order by learning path.

### 4. About Page

Status: missing

Current gap:

- There is no route in `src/pages` for an about page.

### 5. Contact or CTA Destination

Status: missing

Current gaps:

- There is no contact page.
- There is no newsletter/signup flow yet, which is acceptable for MVP.
- The immediate MVP replacement should be a simple contact page or a "read next" CTA path.

### 6. Branding, Metadata, and Trust

Status: not launch-ready

Current gaps:

- `src/config.ts` still uses placeholder site title, description, and URL.
- `src/layouts/Layout.astro` references a placeholder Open Graph image path.
- Footer branding and copyright text are inconsistent with the blog launch.
- `README.md` is still the Astro starter template.

## Recommended Execution Order

Solve the launch in this order:

1. Freeze positioning and launch content
2. Curate the 3-5 launch posts
3. Rebuild the homepage around those posts
4. Add the missing About page
5. Add the missing Contact or CTA destination
6. Clean navigation, footer, and site branding
7. Fix metadata, SEO, and sharing basics
8. Run launch QA and build verification

This order matters because the homepage, nav, and metadata should reflect the chosen launch posts and audience, not the other way around.

## Implementation Plan

### Phase 1: Content and Message Freeze

Goal: define what readers should see first

Tasks:

- Pick the final 3-5 launch posts from the existing inventory.
- Decide the teaching angle for the blog:
  beginner-friendly practical guides for developers and students.
- Write a short positioning statement for the homepage hero.
- Write a short "Start here" explanation for first-time readers.

Definition of done:

- Final launch-post list is fixed.
- Homepage message is fixed in plain text before UI edits begin.

### Phase 2: Information Architecture

Goal: make the site structure support the launch intent

Tasks:

- Keep top navigation minimal: `Home`, `Blog`, `About`, `Contact`.
- Decide whether the homepage shows:
  featured posts, newest posts, topic groups, or all three.
- Decide the CTA path:
  `Read the guides` and `Start here`.

Definition of done:

- Required routes are known.
- Header/footer link structure is fixed.

### Phase 3: Page Implementation

Goal: satisfy the MVP page set

Tasks:

- Rewrite `src/pages/index.astro` as a launch homepage.
- Keep `src/pages/blog/page/[page].astro` as the archive, but improve copy and structure.
- Add `src/pages/about.astro`.
- Add `src/pages/contact.astro` or a lightweight CTA page.

Definition of done:

- All MVP pages exist and are linked from navigation/footer.

### Phase 4: Content Curation

Goal: make the blog feel intentional on day one

Tasks:

- Feature the launch posts on the homepage.
- Add a "Start here" section for beginners.
- Ensure post titles and descriptions are consistent and readable.
- Remove weak placeholder content from featured areas.

Definition of done:

- A new visitor can tell what to read first in under 10 seconds.

### Phase 5: Metadata and Trust Layer

Goal: make the site shareable and credible

Tasks:

- Replace placeholder values in `src/config.ts`.
- Update metadata in `src/layouts/Layout.astro`.
- Ensure RSS and sitemap use the final site identity.
- Normalize footer/site branding.

Definition of done:

- Site identity is consistent across page titles, descriptions, and social previews.

### Phase 6: Launch QA

Goal: avoid obvious launch regressions

Tasks:

- Check internal links.
- Check mobile navigation behavior.
- Check page titles/descriptions.
- Check archive pagination.
- Run production build.
- Review the homepage on mobile and desktop.

Definition of done:

- Build passes and the main user journey works.

## Suggested Next Implementation Sequence In This Branch

Implement in this order:

1. Add this launch plan document
2. Finalize the 3-5 launch posts
3. Update site config and branding
4. Create `about` and `contact` pages
5. Rewrite the homepage around featured posts and "Start here"
6. Tidy the blog archive copy and navigation
7. Verify metadata, RSS, and build output

## Immediate Next Tasks

The next practical coding pass should do only these items:

1. Replace placeholder site metadata in `src/config.ts`
2. Add `src/pages/about.astro`
3. Add `src/pages/contact.astro`
4. Rewrite `src/pages/index.astro` into a real launch homepage
5. Update `src/layouts/Layout.astro` nav/footer to expose the new pages

That gives the site a coherent public shape before spending time on refinements.
