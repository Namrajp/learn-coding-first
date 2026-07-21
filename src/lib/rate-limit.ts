export interface RateLimitConfig {
  key: string;
  max: number;
  window: number; // seconds
}

export async function checkRateLimit(
  env: CloudflareBindings,
  config: RateLimitConfig,
): Promise<{ allowed: boolean; remaining: number }> {
  const current = await env.SESSION.get(config.key);

  if (current) {
    const count = parseInt(current, 10);
    if (count >= config.max) {
      return { allowed: false, remaining: 0 };
    }
    await env.SESSION.put(config.key, String(count + 1), {
      expirationTtl: config.window,
    });
    return { allowed: true, remaining: config.max - count - 1 };
  }

  await env.SESSION.put(config.key, "1", {
    expirationTtl: config.window,
  });
  return { allowed: true, remaining: config.max - 1 };
}
