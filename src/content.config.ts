import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().min(20).max(300),
    tags: z.array(z.string()),
    status: z.enum(["draft", "published"]).default("published"),
  }),
});

export const collections = {
  posts: posts,
};
