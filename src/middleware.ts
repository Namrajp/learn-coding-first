import { env } from "cloudflare:workers";
import { createAuth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/admin", "/api/posts"];

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.env = env as CloudflareBindings;

  const pathname = context.url.pathname;

  if (pathname.startsWith("/api/auth/")) {
    return next();
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  try {
    const auth = createAuth(env as CloudflareBindings, context.request.cf);
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (session) {
      context.locals.user = session.user;
      context.locals.session = session.session;
    }

    if (isProtected && !session) {
      return context.redirect("/login");
    }
  } catch {
    if (isProtected) {
      return context.redirect("/login");
    }
  }

  return next();
});
