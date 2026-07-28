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

| Milestone    | Affiliates | Newsletter | Total/Month |
| ------------ | ---------- | ---------- | ----------- |
| 0-6 months   | $0-50      | $0         | $0-50       |
| 6-12 months  | $50-200    | $0-100     | $50-300     |
| 12-24 months | $200-500   | $100-300   | $300-800    |

## Current Programs

| Program            | URL                                      | Notes                            |
| ------------------ | ---------------------------------------- | -------------------------------- |
| Cloudflare Workers | `cloudflare.com/?ref=learncodingfirst`   | Blog runs on this                |
| DigitalOcean       | `digitalocean.com/?ref=learncodingfirst` | $200 free credit for referrals   |
| Vercel             | `vercel.com/?ref=learncodingfirst`       | Frontend deployment              |
| Supabase           | `supabase.com/?ref=learncodingfirst`     | Open-source Firebase alternative |
| Railway            | `railway.app/?ref=learncodingfirst`      | Modern full-stack deployment     |

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

## Google AdSense

Google AdSense is the most accessible display ad network for new blogs. No minimum traffic required.

### Requirements

- ~20+ pages of original content (we have ~28 posts)
- A privacy policy page (required by AdSense)
- A site with clear navigation and professional design

### Setup Steps

1. **Sign up** at [adsense.google.com](https://adsense.google.com)
2. **Get approved** — review takes 1-14 days
3. **Create ad units** in AdSense dashboard (or use Auto Ads)
4. **Add the AdSense script** to `src/layouts/Layout.astro` `<head>`:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>
```

5. **Place ad units** using the `<AdSlot>` component or manual `<ins>` tags
6. **Create a privacy policy page** at `/privacy` (required by AdSense)

### Ad Placement Options

**In-post ads** (after share buttons in `[slug].astro`):

```astro
<AdSlot placement="inline" />
```

**Sidebar ads** (in sidebar components):

```astro
<AdSlot placement="sidebar" />
```

**Manual AdSense unit** (for specific placements):

```html
<ins
  class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"
></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Auto Ads vs Manual

| Feature         | Auto Ads           | Manual Units               |
| --------------- | ------------------ | -------------------------- |
| Setup           | Add one script tag | Create individual ad units |
| Placement       | Google decides     | You decide                 |
| Control         | Low                | High                       |
| Revenue         | Varies             | Often higher (targeted)    |
| Recommended for | Quick start        | Optimized layout           |

### AdSense Tips

- Place ads above the fold (visible without scrolling)
- Use responsive ad units (`data-full-width-responsive="true"`)
- Don't click your own ads or ask others to
- Add `rel="nofollow noopener"` to ad links if custom
- Monitor performance in AdSense dashboard

## Adding Affiliate Links to Posts

### Step-by-Step

1. **Open the post** in `src/posts/` (e.g., `wsl-development-tips.md`)
2. **Add affiliate links** using plain HTML `<a>` tags (Astro components don't work in markdown posts — `sanitize-html` strips unknown tags):

```markdown
_Tools mentioned: <a href="https://www.cloudflare.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">Cloudflare Workers</a> for edge deployment, <a href="https://www.digitalocean.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">DigitalOcean</a> for cloud servers._
```

3. **Use these affiliate URLs:**
   - Cloudflare: `https://www.cloudflare.com/?ref=learncodingfirst`
   - DigitalOcean: `https://www.digitalocean.com/?ref=learncodingfirst`
   - Vercel: `https://vercel.com/?ref=learncodingfirst`
   - Supabase: `https://supabase.com/?ref=learncodingfirst`
   - Railway: `https://railway.app/?ref=learncodingfirst`

### Important: Markdown vs Astro Components

**In markdown posts** (`src/posts/*.md`): Use plain HTML `<a>` tags. The `<AffiliateLink>` Astro component **does not work** in markdown — `marked` passes it as raw HTML, then `sanitize-html` strips it because it's not in the allowed tags list.

**In Astro components** (`.astro` files): Use `<AffiliateLink program="..." />` — it works correctly with disclosure, styling, and screen reader text.

### Guidelines

- **Max 2 affiliate mentions per post**
- Place in "Tools mentioned" or natural context
- Only link to tools you actually use
- Never put affiliate links in code blocks
- Verify referral URLs work before publishing

## Adding Display Ads to Posts

### Step-by-Step

1. **Enable ads** in `src/lib/monetization.ts`:

```typescript
ads: {
  enabled: true,  // Set to true
  ...
}
```

2. **Choose ad provider** (Carbon Ads, EthicalAds, or Google AdSense)
3. **Configure the provider** in `monetization.ts`:

```typescript
carbon: {
  enabled: true,
  tag: "CE7DK27J",  // Your Carbon Ads publisher tag
},
```

4. **The `<AdSlot>` component** is already placed in `[slug].astro` after share buttons
5. **Deploy** — ads appear automatically when `enabled: true`

### Adding AdSense Manually

If you prefer AdSense over Carbon/EthicalAds:

1. Add the AdSense script to `Layout.astro` `<head>`
2. Create ad units in AdSense dashboard
3. Place the `<ins>` tag in your page:

```astro
---
// In any .astro page
---

<ins
  class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Ad Placement Best Practices

- **Above the fold**: First ad visible without scrolling
- **After intro**: Place after 2-3 paragraphs of content
- **Between sections**: Natural breaks in content
- **End of post**: After conclusion, before related posts
- **Don't overload**: Max 3 ads per post for readability

## Revenue Projections (Realistic)

| Milestone    | Affiliates | Newsletter | Ads      | Total/Month |
| ------------ | ---------- | ---------- | -------- | ----------- |
| 0-6 months   | $0-50      | $0         | $0       | $0-50       |
| 6-12 months  | $50-200    | $0-100     | $50-150  | $100-450    |
| 12-24 months | $200-500   | $100-300   | $200-500 | $500-1,300  |

## Current Programs

| Program            | URL                                      | Notes                            |
| ------------------ | ---------------------------------------- | -------------------------------- |
| Cloudflare Workers | `cloudflare.com/?ref=learncodingfirst`   | Blog runs on this                |
| DigitalOcean       | `digitalocean.com/?ref=learncodingfirst` | $200 free credit for referrals   |
| Vercel             | `vercel.com/?ref=learncodingfirst`       | Frontend deployment              |
| Supabase           | `supabase.com/?ref=learncodingfirst`     | Open-source Firebase alternative |
| Railway            | `railway.app/?ref=learncodingfirst`      | Modern full-stack deployment     |
| Google AdSense     | `adsense.google.com`                     | Display ads (requires approval)  |
| Carbon Ads         | `carbonads.net`                          | Developer-focused ads            |
| EthicalAds         | `ethicalads.io`                          | Privacy-focused ads              |

## File Locations

- `src/lib/monetization.ts` — Config, types, helper functions
- `src/components/AffiliateLink.astro` — Reusable affiliate link component
- `src/components/AdSlot.astro` — Display ad slot component
- `src/pages/tools.astro` — Dedicated tools/recommendations page with affiliate links
- `src/pages/[slug].astro` — Blog post page (has `<AdSlot>` after share buttons)
- `src/layouts/Layout.astro` — Add ad scripts here (AdSense, etc.)

## Best Practices

1. **Context over spam**: Add affiliate links where they're genuinely useful, not everywhere
2. **Transparency**: Always use the disclosure asterisk — builds trust
3. **One or two per post**: Don't exceed 2 affiliate mentions per article
4. **Natural placement**: Put links in "Tools mentioned" sections, not inline with code
5. **Test links**: Verify referral URLs work before publishing
6. **Feature flags**: Use `enabled` switches to test before going live
7. **Ad balance**: Don't let ads hurt readability — content comes first
8. **Privacy policy**: Required for AdSense, good for all ad networks
9. **Disclosure**: FTC requires disclosure of affiliate relationships and sponsored content
