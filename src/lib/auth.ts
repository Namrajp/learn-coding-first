import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { magicLink } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { sendMagicLinkEmail } from "./email";

export function createAuth(
  env: CloudflareBindings,
  cf?: IncomingRequestCfProperties,
) {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    ...withCloudflare(
      {
        d1: { db },
        cf: cf || {},
        autoDetectIpAddress: true,
        geolocationTracking: true,
      },
      {
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: [
          "https://learncodingfirst.com",
          "http://localhost:4321",
        ],
        emailAndPassword: { enabled: false },
        session: {
          expiresIn: 60 * 60 * 24 * 7,
          updateAge: 60 * 60 * 24,
        },
        plugins: [
          magicLink({
            sendMagicLink: async ({ email, url }) => {
              await sendMagicLinkEmail(env, email, url);
            },
            expiresIn: 300,
          }),
        ],
      },
    ),
  });
}
