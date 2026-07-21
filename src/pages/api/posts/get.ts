import type { APIRoute } from "astro";
import {
  parseFrontmatter,
  parseFrontmatterBody,
} from "../../../lib/frontmatter";

const SLUG_RE = /^[a-z0-9-]+$/;

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
    const url = new URL(ctx.request.url);
    const slug = url.searchParams.get("slug");

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
    const apiUrl = `https://api.github.com/repos/Namrajp/my-new-astro-blog/contents/${filePath}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "learncodingfirst-blog",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      content: string;
      encoding: string;
    };

    const content = decodeGitHubContent(data.content);
    const fm = parseFrontmatter(content);
    const body = parseFrontmatterBody(content);

    if (!fm || !body) {
      return new Response(JSON.stringify({ error: "Invalid post format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        title: fm.title,
        description: fm.description,
        tags: fm.tags.join(", "),
        status: fm.status,
        content: body.trim(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
