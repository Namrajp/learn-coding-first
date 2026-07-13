import type { APIRoute } from "astro";
import { createOrUpdateFile } from "../../../lib/github";

export const POST: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const env = ctx.locals.env;
    const { slug, title, content, description, tags, status } =
      await ctx.request.json();

    const tagsArray = tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const frontmatter = [
      "---",
      `title: "${title}"`,
      description ? `description: "${description}"` : null,
      `tags: [${tagsArray.map((t: string) => `"${t}"`).join(", ")}]`,
      `status: ${status || "draft"}`,
      "---",
    ]
      .filter(Boolean)
      .join("\n");

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
      `Update post: ${title}`,
    );

    await env.SESSION.delete("posts:list");

    return new Response(JSON.stringify({ success: true, url: result.url }), {
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
