import type { APIRoute } from "astro";
import { listFiles } from "../../../lib/github";
import { parseFrontmatter } from "../../../lib/frontmatter";

const CACHE_KEY = "cache:posts:list";
const CACHE_TTL = 60; // 60 seconds

function decodeGitHubContent(encoded: string): string {
  return decodeURIComponent(
    atob(encoded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
}

export const GET: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const env = ctx.locals.env;
    if (!env.GITHUB_TOKEN) {
      return new Response(
        JSON.stringify({ error: "GitHub token not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const cached = await env.SESSION.get(CACHE_KEY, { type: "json" });
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = await listFiles(
      { token: env.GITHUB_TOKEN, owner: "Namrajp", repo: "learn-coding-first" },
      "src/posts",
    );

    const results = await Promise.allSettled(
      files.map(async (file) => {
        const url = `https://api.github.com/repos/Namrajp/learn-coding-first/contents/${file.path}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "learncodingfirst-blog",
          },
        });
        if (!response.ok) return null;

        const json = (await response.json()) as {
          content: string;
          encoding: string;
        };
        const content = decodeGitHubContent(json.content);
        const fm = parseFrontmatter(content);
        if (!fm) return null;

        const slug = file.name.replace(/\.md$/, "");
        return {
          slug,
          title: fm.title || slug,
          date: fm.date,
          tags: fm.tags,
          category: fm.category,
          status: fm.status,
        };
      }),
    );

    const posts = results
      .filter(
        (
          r,
        ): r is PromiseFulfilledResult<{
          slug: string;
          title: string;
          date: string;
          tags: string[];
          category: string;
          status: string;
        } | null> => r.status === "fulfilled" && r.value !== null,
      )
      .map((r) => r.value!);

    posts.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
    );

    await env.SESSION.put(CACHE_KEY, JSON.stringify(posts), {
      expirationTtl: CACHE_TTL,
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to list posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
