import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(_context: APIContext) {
  const blog = await getCollection(
    "posts",
    (post) => post.data.status !== "draft",
  );
  return rss({
    title: "Learn Coding First",
    description: "A blog about programming, AI, and developer skills.",
    site: "https://learncodingfirst.com",
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || post.data.title,
      categories: [post.data.category],
      link: `/${post.id}`,
      customData: `<content:encoded><![CDATA[${post.body}]]></content:encoded>`,
    })),
  });
}
