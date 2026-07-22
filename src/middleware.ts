import { env } from "cloudflare:workers";
import { createAuth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { user } from "./db/auth.schema";
import { eq } from "drizzle-orm";

const protectedRoutes = ["/admin", "/api/posts", "/api/admin"];

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.env = env as CloudflareBindings;

  const pathname = context.url.pathname;

  if (pathname.startsWith("/api/auth/")) {
    return next();
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    try {
      const envBindings = context.locals.env;
      const auth = createAuth(envBindings, context.request.cf);
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });

      if (!session) {
        return context.redirect("/login");
      }

      let role = "editor";
      try {
        const db = drizzle(envBindings.DB);
        const userRecord = await db
          .select({ role: user.role })
          .from(user)
          .where(eq(user.id, session.user.id))
          .limit(1);
        if (userRecord.length > 0 && userRecord[0].role) {
          role = userRecord[0].role;
        }
      } catch {
        // Default to editor if DB query fails
      }

      context.locals.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
      };
      context.locals.session = session.session;
    } catch {
      return context.redirect("/login");
    }
  }

  return next();
});
