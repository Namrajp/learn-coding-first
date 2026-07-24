import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDir = resolve(__dirname, "../dist/server");
const wranglerPath = resolve(serverDir, "wrangler.json");

const config = JSON.parse(readFileSync(wranglerPath, "utf-8"));

const CRON = "0 0 * * *";
if (!config.triggers) config.triggers = {};
if (!config.triggers.crons) config.triggers.crons = [];
if (!config.triggers.crons.includes(CRON)) {
  config.triggers.crons.push(CRON);
}

// The @astrojs/cloudflare adapter has no way to inject a custom `scheduled()`
// export into the generated Worker entrypoint (there is no `entrypoint`
// option in v14+). To run the auto-publish cron, we wrap the Astro-generated
// entry file (config.main) in a small shim that re-exports `fetch` untouched
// and adds a `scheduled()` handler that flips due drafts to published via
// the GitHub Contents API.
const originalMain = config.main;
const shimFileName = "scheduled-entry.mjs";

const shimContent = `import astroWorker from "./${originalMain}";

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "Namrajp";
const REPO_NAME = "learn-coding-first";
const POSTS_DIR = "src/posts";

function decodeGitHubContent(encoded) {
  return decodeURIComponent(
    atob(encoded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
}

function base64Encode(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

async function githubFetch(url, token, method = "GET", body = null) {
  const headers = {
    Authorization: \`Bearer \${token}\`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "learncodingfirst-blog",
  };
  if (method !== "GET") headers["Content-Type"] = "application/json";

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok)
    throw new Error(\`GitHub API \${res.status}: \${await res.text()}\`);
  return res.json();
}

async function getFileSha(token, path) {
  const url = \`\${GITHUB_API}/repos/\${REPO_OWNER}/\${REPO_NAME}/contents/\${path}\`;
  const data = await githubFetch(url, token);
  return data.sha;
}

async function updateFile(token, path, content, message) {
  const sha = await getFileSha(token, path);
  const url = \`\${GITHUB_API}/repos/\${REPO_OWNER}/\${REPO_NAME}/contents/\${path}\`;
  await githubFetch(url, token, "PUT", {
    message,
    content: base64Encode(content),
    sha,
    branch: "main",
  });
}

function parseFrontmatterStatus(content) {
  const match = content.match(/^---\\n([\\s\\S]*?)\\n---\\n/);
  if (!match) return null;
  const fm = match[1];
  const statusMatch = fm.match(/^status:\\s*(\\w+)/m);
  const dateMatch = fm.match(/^date:\\s*(\\S+)$/m);
  const titleMatch = fm.match(/^title:\\s*"?(.+?)"?\\s*$/m);
  return {
    status: statusMatch ? statusMatch[1] : "published",
    date: dateMatch ? dateMatch[1] : "",
    title: titleMatch ? titleMatch[1].trim() : "",
  };
}

async function autoPublishDrafts(env) {
  const today = new Date().toISOString().split("T")[0];
  const token = env.GITHUB_TOKEN;

  if (!token) {
    console.error("[auto-publish] No GITHUB_TOKEN available");
    return;
  }

  console.log(
    \`[auto-publish] Cron triggered at \${new Date().toISOString()}, checking for drafts to publish (today: \${today})\`,
  );

  let publishedCount = 0;

  try {
    const listUrl = \`\${GITHUB_API}/repos/\${REPO_OWNER}/\${REPO_NAME}/contents/\${POSTS_DIR}\`;
    const files = await githubFetch(listUrl, token);
    const mdFiles = files.filter(
      (f) => f.type === "file" && f.name.endsWith(".md"),
    );

    for (const file of mdFiles) {
      try {
        const contentUrl = \`\${GITHUB_API}/repos/\${REPO_OWNER}/\${REPO_NAME}/contents/\${file.path}\`;
        const data = await githubFetch(contentUrl, token);
        const raw = decodeGitHubContent(data.content);
        const fm = parseFrontmatterStatus(raw);

        if (!fm || fm.status !== "draft") continue;
        if (fm.date > today) continue;

        const newContent = raw.replace(
          /^status:\\s*draft$/m,
          "status: published",
        );
        await updateFile(
          token,
          file.path,
          newContent,
          \`Auto-publish: \${fm.title}\`,
        );

        const slug = file.name.replace(/\\.md$/, "");
        try {
          await env.SESSION.delete(\`cache:post:\${slug}\`);
          await env.SESSION.delete("cache:posts:list");
          await env.SESSION.delete("cache:posts:dir-sha");
        } catch {
          // Cache invalidation is best-effort
        }

        console.log(\`[auto-publish] Published: \${fm.title} (\${slug})\`);
        publishedCount++;
      } catch (e) {
        console.error(\`[auto-publish] Failed to process \${file.name}:\`, e);
      }
    }
  } catch (e) {
    console.error("[auto-publish] Fatal error:", e);
  }

  console.log(\`[auto-publish] Done. Published \${publishedCount} post(s).\`);
}

export default {
  fetch: astroWorker.fetch,
  async scheduled(event, env, ctx) {
    ctx.waitUntil(autoPublishDrafts(env));
  },
};
`;

writeFileSync(resolve(serverDir, shimFileName), shimContent);
config.main = shimFileName;

writeFileSync(wranglerPath, JSON.stringify(config));
console.log(
  `[postbuild] Injected cron trigger (${CRON}) and scheduled() handler shim (main: ${originalMain} -> ${shimFileName})`,
);
