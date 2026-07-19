import type { APIRoute } from "astro";
import { checkRateLimit } from "../../../lib/rate-limit";
import { addSubscriber, sendWelcomeEmail } from "../../../lib/newsletter";

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.env;
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  const rateLimit = await checkRateLimit(env, {
    key: `ratelimit:newsletter:${ip}`,
    max: 5,
    window: 900,
  });

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const subResult = await addSubscriber(env, email);
  if (!subResult.success) {
    return new Response(
      JSON.stringify({ error: "Failed to subscribe. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    await sendWelcomeEmail(env, email);
  } catch {
    // Welcome email is non-critical — subscriber is already added
  }

  return new Response(
    JSON.stringify({ message: "Subscribed successfully!" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
