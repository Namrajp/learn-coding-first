export async function sendMagicLinkEmail(
  env: CloudflareBindings,
  email: string,
  url: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Learn Coding First <noreply@mail.learncodingfirst.com>",
      to: [email],
      subject: "Sign in to Learn Coding First",
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
              <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Click the button below to sign in. This link expires in 5 minutes.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: hsl(21, 62%, 45%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Sign In
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Sign in to Learn Coding First: ${url}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}
