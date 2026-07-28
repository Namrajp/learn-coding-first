import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORY_SLUGS } from "./lib/categories";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    date: z.date(),
    description: z.string().min(20).max(300),
    category: z.enum(CATEGORY_SLUGS),
    tags: z.array(z.string()),
    status: z.enum(["draft", "published"]).default("published"),
  }),
});

export const collections = {
  posts: posts,
};
