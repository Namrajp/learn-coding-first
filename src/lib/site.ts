export const SITE_URL = "https://learncodingfirst.com";

export const AUTHOR = {
  name: "Namraj Pudasaini",
  bio: "Developer and educator writing about programming fundamentals, AI tools, and practical developer workflows.",
  jobTitle: "Developer & Educator",
  url: SITE_URL,
  image: `${SITE_URL}/apple-touch-icon.png`,
} as const;

export const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Namrajp",
    rel: "me noopener noreferrer",
  },
  {
    label: "X",
    href: "https://twitter.com/namrajpudasaini",
    rel: "me noopener noreferrer",
  },
] as const;

export function authorPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio,
    image: AUTHOR.image,
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };
}
