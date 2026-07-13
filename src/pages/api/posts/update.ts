import type { APIRoute } from "astro";
import { createOrUpdateFile } from "../../../lib/github";
import { parseFrontmatter } from "../../../lib/frontmatter";

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

  try {
    const env = ctx.locals.env;
    const { slug, title, content, description, tags, status } =
      await ctx.request.json();

    const filePath = `src/posts/${slug}.md`;
    const apiUrl = `https://api.github.com/repos/Namrajp/my-new-astro-blog/contents/${filePath}`;
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
      const existingData = (await existingRes.json()) as { content: string; encoding: string };
      const rawContent = decodeGitHubContent(existingData.content);
      const fm = parseFrontmatter(rawContent);
      if (fm) date = fm.date;
    }

    const tagsArray = tags
      .split(",")
      .map((t: string) => t.trim().replace(/"/g, ""))
      .filter(Boolean);

    const safeTitle = title.replace(/"/g, '\\"');
    const safeDescription = description ? description.replace(/"/g, '\\"') : null;

    const frontmatter = [
      "---",
      `title: "${safeTitle}"`,
      `date: ${date}`,
      safeDescription ? `description: "${safeDescription}"` : null,
      `tags: [${tagsArray.map((t: string) => `"${t}"`).join(", ")}]`,
      `status: ${status || "draft"}`,
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    const fileContent = `${frontmatter}\n\n${content}`;

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
  } catch {
    return new Response(JSON.stringify({ error: "Failed to update post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
