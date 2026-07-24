# Monetization Infrastructure

## Overview

The monetization system supports three revenue streams: affiliate links, display ads, and newsletter sponsorships. All features are toggleable via a single config object in `monetization.ts`.

## Configuration

All monetization settings are centralized in `src/lib/monetization.ts`:

```typescript
export const MONETIZATION = {
  ads: {
    enabled: false,        // Master switch for all ads
    carbon: {
      enabled: false,
      tag: "",             // Paste Carbon Ads publisher tag here
    },
    ethicalads: {
      enabled: false,      // Uses ethicalads.io (no tag needed)
    },
  },
  affiliates: {
    enabled: true,         // Master switch for all affiliate links
    programs: {
      cloudflare: { ... },
      digitalocean: { ... },
      vercel: { ... },
      supabase: { ... },
      railway: { ... },
    },
  },
} as const;
```

**To disable all monetization**: Set `affiliates.enabled = false` and `ads.enabled = false`. All affiliate links and ad slots disappear instantly.

**To enable ads**: Apply to Carbon Ads (carbonads.net) or EthicalAds (ethicalads.io), paste the publisher tag in the config, and set `enabled: true`.

## Components

### `<AffiliateLink program="..." />`

Reusable affiliate link with built-in disclosure. Renders nothing when `MONETIZATION.affiliates.enabled` is `false`.

```astro
---
import AffiliateLink from "../components/AffiliateLink.astro";
---

<p>
  For hosting, I recommend <AffiliateLink program="cloudflare" /> Workers.
</p>
```

**Props:**
- `program` (required): One of `cloudflare | digitalocean | vercel | supabase | railway`
- `label` (optional): Custom display text (defaults to program name)

**Rendering:**
- Link opens in new tab with `rel="noopener noreferrer"`
- Disclosure asterisk (`*`) with tooltip on hover
- Screen reader text: `(affiliate)` appended via `sr-only` span

### `<AdSlot placement="..." />`

Display ad slot for Carbon Ads or EthicalAds. Renders nothing when `MONETIZATION.ads.enabled` is `false`.

```astro
---
import AdSlot from "../components/AdSlot.astro";
---

<AdSlot placement="sidebar" />
```

**Props:**
- `placement` (required): `"sidebar"` or `"inline"`

## Adding Affiliate Links to Posts

Add affiliate mentions to any markdown post's body:

```markdown
_Tools mentioned: <AffiliateLink program="digitalocean" label="DigitalOcean" />_
```

The `AffiliateLink` component is globally available in markdown via Astro's component import system.

## Revenue Projections (Realistic)

| Milestone | Affiliates | Newsletter | Total/Month |
|-----------|-----------|------------|-------------|
| 0-6 months | $0-50 | $0 | $0-50 |
| 6-12 months | $50-200 | $0-100 | $50-300 |
| 12-24 months | $200-500 | $100-300 | $300-800 |

## Current Programs

| Program | URL | Notes |
|---------|-----|-------|
| Cloudflare Workers | `cloudflare.com/?ref=learncodingfirst` | Blog runs on this |
| DigitalOcean | `digitalocean.com/?ref=learncodingfirst` | $200 free credit for referrals |
| Vercel | `vercel.com/?ref=learncodingfirst` | Frontend deployment |
| Supabase | `supabase.com/?ref=learncodingfirst` | Open-source Firebase alternative |
| Railway | `railway.app/?ref=learncodingfirst` | Modern full-stack deployment |

## Adding a New Affiliate Program

1. Add entry to `MONETIZATION.affiliates.programs` in `src/lib/monetization.ts`:

```typescript
newprogram: {
  name: "New Program",
  url: "https://newprogram.com/?ref=learncodingfirst",
  disclosure: "Affiliate link — I earn a commission if you sign up.",
},
```

2. Update the `AffiliateProgram` type (auto-inferred from `keyof typeof`)
3. Use in posts: `<AffiliateLink program="newprogram" />`

## File Locations

- `src/lib/monetization.ts` — Config, types, helper functions
- `src/components/AffiliateLink.astro` — Reusable affiliate link component
- `src/components/AdSlot.astro` — Display ad slot component
- `src/pages/tools.astro` — Dedicated tools/recommendations page with affiliate links

## Best Practices

1. **Context over spam**: Add affiliate links where they're genuinely useful, not everywhere
2. **Transparency**: Always use the disclosure asterisk — builds trust
3. **One or two per post**: Don't exceed 2 affiliate mentions per article
4. **Natural placement**: Put links in "Tools mentioned" sections, not inline with code
5. **Test links**: Verify referral URLs work before publishing
6. **Feature flags**: Use `enabled` switches to test before going live