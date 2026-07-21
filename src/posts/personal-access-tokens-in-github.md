---
title: "Personal access tokens in GitHub"
date: 2026-07-21
tags: ["git", "coding", "tutorial", "essay"]
status: draft
---

# How to Create a GitHub Personal Access Token (Classic)

A Personal Access Token (PAT) is used as a password replacement when authenticating with GitHub from the terminal.

## Steps

1. Go to **GitHub Settings** → **Developer Settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token**
3. Set an expiry (e.g., 7 days for short-lived terminal use)
4. Select the scopes/permissions you need
5. Copy the generated token immediately — you won't see it again

## Using the Token

When Git prompts for your password, paste the token instead:

```bash
git clone https://github.com/your-username/your-repo.git
# When prompted for password, paste your token
```

Or set it in your remote URL:

```bash
git remote set-url origin https://<YOUR_TOKEN>@github.com/your-username/your-repo.git
```

## Security Tips

- **Never commit tokens** to source control
- Use short expiry dates (7 days recommended)
- Store tokens in a password manager
- Revoke tokens you no longer need from the same settings page