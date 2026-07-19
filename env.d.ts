/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface CloudflareBindings {
  DB: D1Database;
  SESSION: KVNamespace;
  GITHUB_TOKEN: string;
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

declare namespace App {
  interface Locals {
    env: CloudflareBindings;
    user: { id: string; email: string; name: string } | null;
    session: { id: string; expiresAt: Date } | null;
  }
}
