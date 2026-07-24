import type { APIRoute } from "astro";
import { createOrUpdateFile } from "../../../lib/github";
import { parseFrontmatter, buildFrontmatter } from "../../../lib/frontmatter";
import { checkRateLimit } from "../../../lib/rate-limit";

const SLUG_RE = /^[a-z0-9-]+$/;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60; // 1 minute

function decodeGitHubContent(encoded: string): string {
  return decodeURIComponent(
    atob(encoded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
}

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

  const contentLength = ctx.request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 1_048_576) {
    return new Response(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const env = ctx.locals.env;
    const { slug, title, content, description, tags, status } =
      await ctx.request.json();

    if (!slug || !SLUG_RE.test(slug)) {
      return new Response(JSON.stringify({ error: "Invalid slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!title || typeof title !== "string" || title.length > 200) {
      return new Response(
        JSON.stringify({ error: "Title must be 1-200 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (
      description &&
      typeof description === "string" &&
      description.length > 500
    ) {
      return new Response(
        JSON.stringify({ error: "Description must be under 500 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!content || typeof content !== "string" || content.length === 0) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = `src/posts/${slug}.md`;
    const apiUrl = `https://api.github.com/repos/Namrajp/learn-coding-first/contents/${filePath}`;
    const existingRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "learncodingfirst-blog",
      },
    });

    let date = new Date().toISOString().split("T")[0];
    if (existingRes.ok) {
      const existingData = (await existingRes.json()) as {
        content: string;
        encoding: string;
      };
      const rawContent = decodeGitHubContent(existingData.content);
      const fm = parseFrontmatter(rawContent);
      if (fm) date = fm.date;
    }

    const tagsArray = tags
      .split(",")
      .map((t: string) => t.trim().replace(/"/g, ""))
      .filter(Boolean);

    const frontmatter = buildFrontmatter({
      title,
      date,
      description: description || undefined,
      tags: tagsArray,
      status: status || "draft",
    });

    const fileContent = `${frontmatter}\n\n${content}`;

    const result = await createOrUpdateFile(
      {
        token: env.GITHUB_TOKEN,
        owner: "Namrajp",
        repo: "learn-coding-first",
      },
      filePath,
      fileContent,
      `Update post: ${title}`,
    );

    await env.SESSION.delete("cache:posts:list");
    await env.SESSION.delete(`cache:post:${slug}`);
    await env.SESSION.delete("cache:posts:dir-sha");

    return new Response(JSON.stringify({ success: true, url: result.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to update post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
