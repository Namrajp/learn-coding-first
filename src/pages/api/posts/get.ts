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

    const content = decodeURIComponent(
      atob(data.content)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid post format" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const frontmatter = frontmatterMatch[1];
    const markdownContent = frontmatterMatch[2];

    const titleMatch = frontmatter.match(/title:\s*"?(.+?)"?\s*$/m);
    const descriptionMatch = frontmatter.match(/description:\s*"?(.+?)"?\s*$/m);
    const statusMatch = frontmatter.match(/status:\s*(\w+)/);

    let tags: string[] = [];
    const inlineTagsMatch = frontmatter.match(/tags:\s*\[(.+)\]/);
    const listTagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);

    if (inlineTagsMatch) {
      tags = inlineTagsMatch[1].split(",").map((t) => t.trim().replace(/"/g, ""));
    } else if (listTagsMatch) {
      tags = listTagsMatch[1]
        .split("\n")
        .map((t) => t.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean);
    }

    return new Response(
      JSON.stringify({
        title: titleMatch ? titleMatch[1].trim() : "",
        description: descriptionMatch ? descriptionMatch[1].trim() : "",
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
