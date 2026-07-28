import { getCollection } from "astro:content";
import type { CategorySlug } from "./categories";

export interface BlogPost {
  id: string;
  data: {
    title: string;
    date: Date;
    tags: string[];
    category: CategorySlug;
    description: string;
    status: string;
  };
}

export const PAGE_SIZE = 8;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = (await getCollection("posts")).filter(
    (post) => post.data.status !== "draft",
  );
  return posts.sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );
}

export function getTagCounts(posts: BlogPost[]): {
  tags: string[];
  tagCounts: Record<string, number>;
} {
  const tagSet = new Set<string>();
  const tagCounts: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagSet.add(tag);
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  return { tags: [...tagSet].sort(), tagCounts };
}

export function getCategoryCounts(
  posts: BlogPost[],
): Record<CategorySlug, number> {
  const counts = {} as Record<CategorySlug, number>;
  for (const post of posts) {
    const category = post.data.category;
    if (!category) continue;
    counts[category] = (counts[category] || 0) + 1;
  }
  return counts;
}

export interface BlogFilters {
  q?: string;
  tag?: string;
  category?: string;
}

/**
 * Applies the /blog search box and the tag/category dropdowns with AND logic.
 */
export function filterPosts(
  posts: BlogPost[],
  { q, tag, category }: BlogFilters,
): BlogPost[] {
  let result = posts;

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(
      (post) =>
        post.data.title.toLowerCase().includes(query) ||
        post.data.description.toLowerCase().includes(query) ||
        post.data.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  if (tag) {
    result = result.filter((post) => post.data.tags.includes(tag));
  }

  if (category) {
    result = result.filter((post) => post.data.category === category);
  }

  return result;
}

export function blogPath(): string {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}blog` : `${base}/blog`;
}

export function pageUrl(p: number, filters: BlogFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.category) params.set("category", filters.category);
  const qs = params.toString();
  if (p === 1) return `${blogPath()}/${qs ? `?${qs}` : ""}`;
  return `${blogPath()}/${p}/${qs ? `?${qs}` : ""}`;
}
