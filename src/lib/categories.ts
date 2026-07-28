export const CATEGORY_SLUGS = [
  "ai",
  "news",
  "tutorial",
  "web-development",
  "tools",
  "productivity",
  "essay",
  "miscellaneous",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
}

export const DEFAULT_CATEGORY: CategorySlug = "miscellaneous";

export const CATEGORIES: readonly Category[] = [
  {
    slug: "ai",
    label: "AI",
    description:
      "Hands-on guides to AI tools, models, and prompting techniques for developers.",
  },
  {
    slug: "news",
    label: "News",
    description:
      "Industry updates and what the latest releases mean for working developers.",
  },
  {
    slug: "tutorial",
    label: "Tutorial",
    description:
      "Step-by-step how-to guides you can follow from start to finish.",
  },
  {
    slug: "web-development",
    label: "Web Development",
    description:
      "Front-end, back-end, and full-stack web development from fundamentals to production.",
  },
  {
    slug: "tools",
    label: "Tools",
    description:
      "Software and utilities that make building, shipping, and debugging easier.",
  },
  {
    slug: "productivity",
    label: "Productivity",
    description:
      "Workflows, shortcuts, and habits that help you write more code in less time.",
  },
  {
    slug: "essay",
    label: "Essay",
    description:
      "Opinion pieces and deep dives on coding, careers, and where software is heading.",
  },
  {
    slug: "miscellaneous",
    label: "Miscellaneous",
    description:
      "Everything else worth writing down that does not fit the other categories.",
  },
];

export function isCategory(value: unknown): value is CategorySlug {
  return (
    typeof value === "string" &&
    (CATEGORY_SLUGS as readonly string[]).includes(value)
  );
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

/**
 * Category names that may never be used as a tag. Includes both the slug
 * (`web-development`) and the human label (`web development`) so the two
 * taxonomies can never collide. Enforced by normalizeTags() in
 * src/lib/frontmatter.ts and by scripts/check-taxonomy.mjs at build time.
 */
export const RESERVED_TAG_NAMES: readonly string[] = [
  ...CATEGORY_SLUGS,
  ...CATEGORIES.map((category) => category.label.toLowerCase()),
];
