import type { APIRoute } from "astro";
import { listFiles } from "../../../lib/github";
import { parseFrontmatter } from "../../../lib/frontmatter";

const CACHE_KEY = "posts:list";
const CACHE_TTL = 60; // 60 seconds

export const GET: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const env = ctx.locals.env;
    if (!env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: "GitHub token not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cached = await env.SESSION.get(CACHE_KEY, { type: "json" });
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = await listFiles(
      { token: env.GITHUB_TOKEN, owner: "Namrajp", repo: "my-new-astro-blog" },
      "src/posts",
    );

    const posts = [];
    for (const file of files) {
      const url = `https://raw.githubusercontent.com/Namrajp/my-new-astro-blog/main/${file.path}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "learncodingfirst-blog",
        },
      });
      if (!response.ok) continue;

      const content = await response.text();
      const fm = parseFrontmatter(content);
      if (!fm) continue;

      const slug = file.name.replace(/\.md$/, "");
      posts.push({
        slug,
        title: fm.title || slug,
        date: fm.date,
        tags: fm.tags,
        status: fm.status,
      });
    }

    posts.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
    );

    await env.SESSION.put(CACHE_KEY, JSON.stringify(posts), { expirationTtl: CACHE_TTL });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
