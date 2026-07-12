import { env } from "cloudflare:workers";
import { createAuth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/admin", "/api/posts"];

export const onRequest = defineMiddleware(async (context, next) => {
  // Make env available to all routes via context.locals.env
  context.locals.env = env as CloudflareBindings;

  const isProtected = protectedRoutes.some((route) =>
    context.url.pathname.startsWith(route),
  );

  if (isProtected) {
    try {
      const cf = context.request.cf;

      const auth = createAuth(env as CloudflareBindings, cf);
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });

      if (!session) {
        return context.redirect("/login");
      }

      context.locals.user = session.user;
      context.locals.session = session.session;
    } catch {
      return context.redirect("/login");
    }
  }

  return next();
});
