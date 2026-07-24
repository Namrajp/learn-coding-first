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
  const descMatch = fm.match(/^description:\\s*"?(.*?)"?\\s*$/m);
  return {
    status: statusMatch ? statusMatch[1] : "published",
    date: dateMatch ? dateMatch[1] : "",
    title: titleMatch ? titleMatch[1].trim() : "",
    description: descMatch ? descMatch[1].trim() : "",
  };
}

// Mirrors sendPostNotification() in src/lib/newsletter.ts. Inlined here
// (rather than imported) because this shim is generated post-build as a
// standalone file with no access to Astro's hashed build chunks.
const SITE_URL = "https://learncodingfirst.com";
const FROM = "Learn Coding First <newsletter@mail.learncodingfirst.com>";

function unsubscribeUrl(email) {
  return \`\${SITE_URL}/api/newsletter/unsubscribe?email=\${encodeURIComponent(email)}\`;
}

async function sendEmail(env, to, subject, html, text) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${env.RESEND_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
      text,
      headers: { "List-Unsubscribe": \`<\${unsubscribeUrl(to)}>\` },
    }),
  });
  if (!response.ok) {
    throw new Error(\`Failed to send email: \${await response.text()}\`);
  }
}

async function listContacts(env) {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) return [];
  const response = await fetch(
    \`https://api.resend.com/audiences/\${env.RESEND_AUDIENCE_ID}/contacts\`,
    { headers: { Authorization: \`Bearer \${env.RESEND_API_KEY}\` } },
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
}

async function sendPostNotification(env, post) {
  const contacts = await listContacts(env);
  const active = contacts.filter((c) => !c.unsubscribed);

  let sent = 0;
  let failed = 0;

  for (const contact of active) {
    try {
      const unsub = unsubscribeUrl(contact.email);
      const displayName = contact.name || "there";
      const postUrl = \`\${SITE_URL}/\${post.slug}\`;
      const excerpt = post.description || "New post on Learn Coding First";

      const html = \`
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: hsl(21, 62%, 45%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Learn Coding First</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937; margin-top: 0;">New post published!</h2>
              <p style="color: #4b5563; line-height: 1.6;">Hi \${displayName}, we just published a new post you might like:</p>
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;"><a href="\${postUrl}" style="color: hsl(21, 62%, 45%); text-decoration: none;">\${post.title}</a></h3>
                <p style="color: #6b7280; margin-bottom: 0;">\${excerpt}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="\${postUrl}" style="display: inline-block; padding: 14px 28px; background-color: hsl(21, 62%, 45%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Read More</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                You received this because you subscribed to the Learn Coding First newsletter.<br>
                <a href="\${unsub}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
          </body>
        </html>\`;

      const text = \`New post: \${post.title}\\n\\n\${excerpt}\\n\\nRead more: \${postUrl}\\n\\nUnsubscribe: \${unsub}\`;

      await sendEmail(env, contact.email, \`New post: \${post.title}\`, html, text);
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
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

        try {
          const { sent, failed } = await sendPostNotification(env, {
            slug,
            title: fm.title,
            description: fm.description || "",
          });
          console.log(
            \`[auto-publish] Newsletter notification for \${slug}: \${sent} sent, \${failed} failed\`,
          );
        } catch (e) {
          console.error(
            \`[auto-publish] Newsletter notification failed for \${slug}:\`,
            e,
          );
        }
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
