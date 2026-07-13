import type { APIRoute } from "astro";
import { createOrUpdateFile, generateSlug } from "../../../lib/github";
import { buildFrontmatter } from "../../../lib/frontmatter";

const SLUG_RE = /^[a-z0-9-]+$/;

export const POST: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const env = ctx.locals.env;
    const { title, content, description, tags, status } =
      await ctx.request.json();

    if (!env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: "GitHub token not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const slug = generateSlug(title);

    if (!SLUG_RE.test(slug)) {
      return new Response(JSON.stringify({ error: "Invalid slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const date = new Date().toISOString().split("T")[0];
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
    const filePath = `src/posts/${slug}.md`;

    const result = await createOrUpdateFile(
      {
        token: env.GITHUB_TOKEN,
        owner: "Namrajp",
        repo: "my-new-astro-blog",
      },
      filePath,
      fileContent,
      `Add post: ${title}`,
    );

    await env.SESSION.delete("posts:list");

    return new Response(
      JSON.stringify({ success: true, slug, url: result.url }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
