import type { APIRoute } from "astro";
import { createAuth } from "../../../lib/auth";
import { isAuthorizedEmail } from "../../../lib/auth-config";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds

export const ALL: APIRoute = async (ctx) => {
  const env = ctx.locals.env;
  if (!env) return new Response("No env", { status: 500 });

  const url = new URL(ctx.request.url);
  const isMagicLink =
    ctx.request.method === "POST" &&
    url.pathname.includes("/api/auth/sign-in/magic-link");

  if (isMagicLink) {
    let email = "";
    try {
      const body = await ctx.request.clone().json();
      email = body.email?.toLowerCase().trim() || "";
    } catch {
      // ignore
    }

    const authorized = await isAuthorizedEmail(email, env);
    if (!authorized) {
      return new Response(
        JSON.stringify({
          error: "This email is not authorized to access the admin panel.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    const ip =
      ctx.request.headers.get("cf-connecting-ip") ||
      ctx.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const rateKey = `ratelimit:magic-link:${ip}:${email}`;
    const current = await env.SESSION.get(rateKey);

    if (current) {
      const count = parseInt(current, 10);
      if (count >= RATE_LIMIT_MAX) {
        return new Response(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
      await env.SESSION.put(rateKey, String(count + 1), {
        expirationTtl: RATE_LIMIT_WINDOW,
      });
    } else {
      await env.SESSION.put(rateKey, "1", {
        expirationTtl: RATE_LIMIT_WINDOW,
      });
    }
  }

  const auth = createAuth(env, ctx.request.cf);
  return auth.handler(ctx.request);
};
