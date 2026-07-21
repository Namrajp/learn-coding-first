import type { APIRoute } from "astro";
import { deleteFile } from "../../../lib/github";
import { checkRateLimit } from "../../../lib/rate-limit";

const SLUG_RE = /^[a-z0-9-]+$/;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60; // 1 minute

export const POST: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ip = ctx.request.headers.get("cf-connecting-ip") || "unknown";
  const rateKey = `ratelimit:post-write:${ip}`;
  const { allowed } = await checkRateLimit(ctx.locals.env, {
    key: rateKey,
    max: RATE_LIMIT_MAX,
    window: RATE_LIMIT_WINDOW,
  });

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const env = ctx.locals.env;
    const { slug } = await ctx.request.json();

    if (!slug || !SLUG_RE.test(slug)) {
      return new Response(JSON.stringify({ error: "Invalid slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GITHUB_TOKEN) {
      return new Response(
        JSON.stringify({ error: "GitHub token not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const filePath = `src/posts/${slug}.md`;

    await deleteFile(
      {
        token: env.GITHUB_TOKEN,
        owner: "Namrajp",
        repo: "my-new-astro-blog",
      },
      filePath,
      `Delete post: ${slug}`,
    );

    await env.SESSION.delete("cache:posts:list");
    await env.SESSION.delete(`cache:post:${slug}`);
    await env.SESSION.delete("cache:posts:dir-sha");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to delete post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
