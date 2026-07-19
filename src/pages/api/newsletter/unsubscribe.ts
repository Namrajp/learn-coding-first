import type { APIRoute } from "astro";
import { unsubscribeContact } from "../../../lib/newsletter";

export const GET: APIRoute = async ({ url, locals }) => {
  const env = locals.env;
  const email = url.searchParams.get("email")?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      `<!DOCTYPE html>
<html><head><title>Unsubscribe</title></head>
<body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 60px auto; text-align: center; padding: 20px;">
  <h1 style="color: #dc2626;">Invalid Link</h1>
  <p style="color: #6b7280;">This unsubscribe link is invalid.</p>
  <a href="https://learncodingfirst.com" style="color: hsl(21, 62%, 45%);">Go to Homepage</a>
</body></html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  const result = await unsubscribeContact(env, email);

  if (!result.success) {
    return new Response(
      `<!DOCTYPE html>
<html><head><title>Unsubscribe</title></head>
<body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 60px auto; text-align: center; padding: 20px;">
  <h1 style="color: #dc2626;">Error</h1>
  <p style="color: #6b7280;">Something went wrong. Please try again or contact us.</p>
  <a href="https://learncodingfirst.com" style="color: hsl(21, 62%, 45%);">Go to Homepage</a>
</body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  return new Response(
    `<!DOCTYPE html>
<html><head><title>Unsubscribed</title></head>
<body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 60px auto; text-align: center; padding: 20px;">
  <h1 style="color: #16a34a;">Unsubscribed</h1>
  <p style="color: #6b7280;">You've been removed from the newsletter. You won't receive any more emails.</p>
  <a href="https://learncodingfirst.com" style="color: hsl(21, 62%, 45%);">Go to Homepage</a>
</body></html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    },
  );
};
