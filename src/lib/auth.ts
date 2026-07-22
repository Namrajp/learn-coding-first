import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { magicLink } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { sendMagicLinkEmail } from "./email";
import { isAuthorizedEmail } from "./auth-config";

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
        user: {
          additionalFields: {
            role: {
              type: "string",
              required: true,
              defaultValue: "editor",
              input: false,
              returned: true,
            },
          },
        },
        session: {
          expiresIn: 60 * 60 * 24 * 7,
          updateAge: 60 * 60 * 24,
        },
        databaseHooks: {
          user: {
            create: {
              after: async (user) => {
                const authorized = await isAuthorizedEmail(user.email, env);
                if (authorized) {
                  await db
                    .update(schema.user)
                    .set({ role: authorized.role })
                    .where(schema.user.id.eq(user.id));
                }
              },
            },
          },
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
