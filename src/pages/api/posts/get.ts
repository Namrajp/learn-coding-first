import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const env = ctx.locals.env;
    const url = new URL(ctx.request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: "GitHub token not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = `src/posts/${slug}.md`;
    const apiUrl = `https://api.github.com/repos/Namrajp/my-new-astro-blog/contents/${filePath}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
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

    // Decode base64 content
    const content = decodeURIComponent(
      atob(data.content)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid post format" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const frontmatter = frontmatterMatch[1];
    const markdownContent = frontmatterMatch[2];

    // Parse frontmatter fields
    const titleMatch = frontmatter.match(/title:\s*"(.+)"/);
    const descriptionMatch = frontmatter.match(/description:\s*"(.+)"/);
    const tagsMatch = frontmatter.match(/tags:\s*\[(.+)\]/);
    const statusMatch = frontmatter.match(/status:\s*(\w+)/);

    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t) => t.trim().replace(/"/g, ""))
      : [];

    return new Response(
      JSON.stringify({
        title: titleMatch ? titleMatch[1] : "",
        description: descriptionMatch ? descriptionMatch[1] : "",
        tags: tags.join(", "),
        status: statusMatch ? statusMatch[1] : "draft",
        content: markdownContent.trim(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
