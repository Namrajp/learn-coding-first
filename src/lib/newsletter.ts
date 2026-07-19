export interface Contact {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  unsubscribed: boolean;
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

export async function sendWelcomeEmail(
  env: CloudflareBindings,
  email: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Learn Coding First <newsletter@mail.learncodingfirst.com>",
      to: [email],
      subject: "Welcome to Learn Coding First!",
      html: `
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
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome to the newsletter!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Thanks for subscribing. You'll get notified when we publish new tutorials and articles about coding.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://learncodingfirst.com" style="display: inline-block; padding: 14px 28px; background-color: hsl(21, 62%, 45%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Visit the Blog
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                If you didn't subscribe, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Welcome to Learn Coding First! Thanks for subscribing. Visit https://learncodingfirst.com to read our latest posts.`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send welcome email: ${error}`);
  }
}
