export interface Contact {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  unsubscribed: boolean;
}

interface PostPreview {
  slug: string;
  title: string;
}

const SITE_URL = "https://learncodingfirst.com";
const FROM = "Learn Coding First <newsletter@mail.learncodingfirst.com>";

function emailHeader(title: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: hsl(21, 62%, 45%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Learn Coding First</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>`;
}

function emailFooter(unsubscribeUrl: string): string {
  return `
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            You received this because you subscribed to the Learn Coding First newsletter.<br>
            <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
          </p>
        </div>
      </body>
    </html>`;
}

function unsubscribeUrl(email: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

async function sendEmail(
  env: CloudflareBindings,
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl(to)}>`,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}

export async function listContacts(
  env: CloudflareBindings,
): Promise<Contact[]> {
  const response = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
    {
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { data: Contact[] };
  return data.data || [];
}

export async function addSubscriber(
  env: CloudflareBindings,
  email: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, unsubscribed: false }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}

export async function deleteContact(
  env: CloudflareBindings,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}

export async function unsubscribeContact(
  env: CloudflareBindings,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unsubscribed: true }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}

async function getRecentPosts(
  env: CloudflareBindings,
  count = 3,
): Promise<PostPreview[]> {
  if (!env.GITHUB_TOKEN) return [];

  try {
    const listRes = await fetch(
      `https://api.github.com/repos/Namrajp/learn-coding-first/contents/src/posts`,
      {
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "learncodingfirst-blog",
        },
      },
    );

    if (!listRes.ok) return [];
    const files = (await listRes.json()) as {
      name: string;
      path: string;
      type: string;
    }[];

    const mdFiles = files
      .filter((f) => f.type === "file" && f.name.endsWith(".md"))
      .slice(0, 10);

    const posts: PostPreview[] = [];

    for (const file of mdFiles) {
      if (posts.length >= count) break;

      const contentRes = await fetch(
        `https://api.github.com/repos/Namrajp/learn-coding-first/contents/${file.path}`,
        {
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "learncodingfirst-blog",
          },
        },
      );

      if (!contentRes.ok) continue;
      const json = (await contentRes.json()) as {
        content: string;
        encoding: string;
      };

      const content = decodeURIComponent(
        atob(json.content)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const statusMatch = content.match(/^status:\s*(.+)$/m);
      if (statusMatch && statusMatch[1].trim() !== "published") continue;

      const titleMatch = content.match(/^title:\s*(.+)$/m);
      if (!titleMatch) continue;

      const slug = file.name.replace(/\.md$/, "");
      const title = titleMatch[1].trim().replace(/^["']|["']$/g, "");

      posts.push({ slug, title });
    }

    return posts;
  } catch {
    return [];
  }
}

export async function sendWelcomeEmail(
  env: CloudflareBindings,
  email: string,
  name: string,
): Promise<void> {
  const unsub = unsubscribeUrl(email);
  const displayName = name || "there";
  const posts = await getRecentPosts(env);

  const postLinks =
    posts.length > 0
      ? posts
          .map(
            (p) =>
              `<li><a href="${SITE_URL}/${p.slug}" style="color: hsl(21, 62%, 45%); text-decoration: none;">${p.title}</a></li>`,
          )
          .join("\n      ")
      : `<li><a href="${SITE_URL}" style="color: hsl(21, 62%, 45%); text-decoration: none;">Visit the blog</a></li>`;

  const postText =
    posts.length > 0
      ? posts.map((p) => `- ${p.title}: ${SITE_URL}/${p.slug}`).join("\n")
      : `- ${SITE_URL}`;

  const html = `
    ${emailHeader("Welcome to the newsletter!")}
    <p style="color: #4b5563; line-height: 1.6;">
      Hi ${displayName}, thanks for subscribing! You'll get notified when we publish new tutorials and articles about coding.
    </p>
    <p style="color: #4b5563; line-height: 1.6;">
      Here are our latest posts to get you started:
    </p>
    <ul style="color: #4b5563; line-height: 2;">
      ${postLinks}
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}" style="display: inline-block; padding: 14px 28px; background-color: hsl(21, 62%, 45%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Visit the Blog
      </a>
    </div>
    ${emailFooter(unsub)}`;

  const text = `Welcome to Learn Coding First!\n\nHi ${displayName}, thanks for subscribing. You'll get notified when we publish new tutorials.\n\nLatest posts:\n${postText}\n\nVisit: ${SITE_URL}\n\nUnsubscribe: ${unsub}`;

  await sendEmail(env, email, "Welcome to Learn Coding First!", html, text);
}

export async function sendPostNotification(
  env: CloudflareBindings,
  post: { slug: string; title: string; description: string },
): Promise<{ sent: number; failed: number }> {
  const contacts = await listContacts(env);
  const active = contacts.filter((c) => !c.unsubscribed);

  let sent = 0;
  let failed = 0;

  for (const contact of active) {
    try {
      const unsub = unsubscribeUrl(contact.email);
      const displayName = contact.name || "there";
      const postUrl = `${SITE_URL}/${post.slug}`;
      const excerpt = post.description || "New post on Learn Coding First";

      const html = `
        ${emailHeader("New post published!")}
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${displayName}, we just published a new post you might like:
        </p>
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">
            <a href="${postUrl}" style="color: hsl(21, 62%, 45%); text-decoration: none;">${post.title}</a>
          </h3>
          <p style="color: #6b7280; margin-bottom: 0;">${excerpt}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${postUrl}" style="display: inline-block; padding: 14px 28px; background-color: hsl(21, 62%, 45%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Read More
          </a>
        </div>
        ${emailFooter(unsub)}`;

      const text = `New post: ${post.title}\n\n${excerpt}\n\nRead more: ${postUrl}\n\nUnsubscribe: ${unsub}`;

      await sendEmail(
        env,
        contact.email,
        `New post: ${post.title}`,
        html,
        text,
      );
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}
