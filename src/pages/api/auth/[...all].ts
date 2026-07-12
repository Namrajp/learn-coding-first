import type { APIRoute } from "astro";
import { createAuth } from "../../../lib/auth";

export const ALL: APIRoute = async (ctx) => {
  const env = ctx.locals.env;
  if (!env) return new Response("No env", { status: 500 });

  const auth = createAuth(env, ctx.request.cf);
  return auth.handler(ctx.request);
};
