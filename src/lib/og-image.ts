import ogManifest from "../generated/og-manifest.json";
import { SITE_URL } from "./site";

const ogSlugs = new Set(ogManifest.slugs);

/** Per-post OG PNG when prebuild generated one; otherwise site default. */
export function getOgImageUrl(slug: string): string {
  if (ogSlugs.has(slug)) {
    return `${SITE_URL}/og/${slug}.png`;
  }
  return `${SITE_URL}/og-default.png`;
}
