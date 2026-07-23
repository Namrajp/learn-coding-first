interface TagPost {
  data: {
    title: string;
    description?: string;
  };
}

const TAG_DESCRIPTIONS: Record<string, string> = {
  ai: "Guides on AI assistants, prompting techniques, and using AI in your development workflow.",
  tutorial:
    "Step-by-step programming tutorials covering languages, tools, and everyday developer workflows.",
  docker:
    "Docker tutorials for containerizing applications, writing Dockerfiles, and deploying containers.",
  javascript:
    "JavaScript fundamentals, async patterns, and practical tips for modern web development.",
  python:
    "Python guides covering environments, libraries, and workflows for beginners and beyond.",
  productivity:
    "Tips and tools to code smarter, automate tasks, and get more done as a developer.",
  news: "Updates, opinions, and commentary on programming trends and the developer landscape.",
  essay:
    "Long-form articles on learning to code, career growth, and the future of software development.",
  web: "HTML, CSS, and front-end development tutorials for building modern websites.",
  git: "Git workflows, commands, and version control practices for solo and team projects.",
  mongodb: "MongoDB setup, connection guides, and database integration for Node.js apps.",
  vue: "Vue.js concepts including lifecycle hooks, template refs, and component patterns.",
};

export function getTagDescription(tag: string, posts: TagPost[]): string {
  const key = tag.toLowerCase();
  if (TAG_DESCRIPTIONS[key]) {
    return TAG_DESCRIPTIONS[key];
  }

  const count = posts.length;
  const samples = posts
    .slice(0, 2)
    .map((post) => post.data.title)
    .join(" and ");

  if (samples) {
    return `Browse ${count} ${tag} articles on Learn Coding First, including ${samples}.`;
  }

  return `Browse ${count} articles tagged "${tag}" on Learn Coding First.`;
}

export function formatTagTitle(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
