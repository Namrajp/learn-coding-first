import { getCollection } from "astro:content";

export interface BlogPost {
  id: string;
  data: {
    title: string;
    date: Date;
    tags: string[];
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

export function blogPath(): string {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}blog` : `${base}/blog`;
}

export function pageUrl(p: number): string {
  if (p === 1) return `${blogPath()}/`;
  return `${blogPath()}/${p}/`;
}
