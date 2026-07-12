interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

function base64Encode(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

async function getFileSha(
  config: GitHubConfig,
  path: string,
  branch = "main",
): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const data = (await response.json()) as { sha: string };
  return data.sha;
}

export async function createOrUpdateFile(
  config: GitHubConfig,
  path: string,
  content: string,
  message: string,
  branch = "main",
): Promise<{ sha: string; url: string }> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;

  const body: Record<string, unknown> = {
    message,
    content: base64Encode(content),
    branch,
  };

  const sha = await getFileSha(config, path, branch);
  if (sha) body.sha = sha;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save file: ${response.status} ${error}`);
  }

  const result = (await response.json()) as {
    content: { sha: string; html_url: string };
  };

  return {
    sha: result.content.sha,
    url: result.content.html_url,
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
