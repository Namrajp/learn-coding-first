---
title: "GitHub Personal Access Tokens: Setup and Security"
date: 2026-07-28
tags: ["git", "tutorial"]
status: published
description: "Create and use GitHub Personal Access Tokens (PAT) for secure Git authentication: step-by-step setup and security best practices."
---

A Personal Access Token (PAT) replaces your password when Git authenticates with GitHub from the terminal. GitHub no longer accepts password authentication for Git operations — tokens are the standard.

## Creating a Token

1. Go to **GitHub Settings** → **Developer Settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token**
3. Set an expiry (e.g., 7 days for short-lived terminal use)
4. Select the scopes/permissions you need
5. Copy the generated token immediately — you will not see it again

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

The second approach stores the token in your Git config, so you do not need to paste it each time. Be aware this puts the token in plain text on disk.

## Security Tips

- **Never commit tokens** to source control
- Use short expiry dates (7 days recommended)
- Store tokens in a password manager
- Revoke tokens you no longer need from the same settings page

> **Rule:** treat tokens like passwords. If a token leaks, revoke it immediately from GitHub settings.

---

_Next steps: for automated CI/CD pipelines, use **GitHub Apps** or **deploy keys** instead of personal tokens — they provide scoped access without linking to your account._
