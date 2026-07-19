import type { APIRoute } from "astro";
import { deleteContact } from "../../../lib/newsletter";
import { createAuth } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.env;

  try {
    const auth = createAuth(env, request.cf);
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Unauthorized." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
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
  if (!email) {
    return new Response(
      JSON.stringify({ error: "Email is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = await deleteContact(env, email);
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error || "Failed to delete contact." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ message: "Contact deleted." }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
