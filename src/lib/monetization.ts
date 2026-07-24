export const MONETIZATION = {
  ads: {
    enabled: false,
    carbon: {
      enabled: false,
      tag: "",
    },
    ethicalads: {
      enabled: false,
    },
  },
  affiliates: {
    enabled: false,
    programs: {
      cloudflare: {
        name: "Cloudflare",
        url: "https://www.cloudflare.com/?ref=learncodingfirst",
        disclosure: "Affiliate link — I earn a commission if you sign up.",
      },
      digitalocean: {
        name: "DigitalOcean",
        url: "https://www.digitalocean.com/?ref=learncodingfirst",
        disclosure: "Affiliate link — I earn a commission if you sign up.",
      },
      vercel: {
        name: "Vercel",
        url: "https://vercel.com/?ref=learncodingfirst",
        disclosure: "Affiliate link — I earn a commission if you sign up.",
      },
      supabase: {
        name: "Supabase",
        url: "https://supabase.com/?ref=learncodingfirst",
        disclosure: "Affiliate link — I earn a commission if you sign up.",
      },
      railway: {
        name: "Railway",
        url: "https://railway.app/?ref=learncodingfirst",
        disclosure: "Affiliate link — I earn a commission if you sign up.",
      },
    },
  },
} as const;

export type AffiliateProgram = keyof typeof MONETIZATION.affiliates.programs;

export function getAffiliateUrl(program: AffiliateProgram): string {
  return MONETIZATION.affiliates.programs[program].url;
}

export function getAffiliateDisclosure(program: AffiliateProgram): string {
  return MONETIZATION.affiliates.programs[program].disclosure;
}
