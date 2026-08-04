---
title: "GitHub Personal Access Tokens and SSH host Authenticity: Setup and Security"
slug: "personal-access-tokens-in-github"
date: 2026-07-21
description: "Create and use GitHub Personal Access Tokens (PAT) for secure Git authentication: step-by-step setup and security best practices and SSH public key and private keys"
category: "tools"
tags: ["git", "github", "authentication", "security"]
status: published
---

A Personal Access Token (PAT) replaces your password when Git authenticates with GitHub from the terminal. GitHub no longer accepts password authentication for Git operations — tokens are the standard.

## The Error That Sends You Here

Most people meet tokens through this message:

```
remote: Support for password authentication was removed on August 13, 2021.
fatal: Authentication failed for 'https://github.com/your-username/your-repo.git/'
```

Your account password is not wrong. GitHub simply will not accept it over HTTPS anymore, and a token is the replacement.

## Fine-Grained or Classic?

GitHub offers two kinds of token. Classic tokens use broad scopes that apply to every repository your account can reach. Fine-grained tokens are limited to repositories you pick, with individual read/write permissions, so a token that only needs to read code cannot also delete a repo.

Prefer fine-grained tokens for anything long-lived. Classic tokens are simpler for one-off terminal use, and a few older integrations still only accept them.

Either way, grant the minimum you need. To push and pull private repositories with a classic token, the `repo` scope is enough — `git push` does not need `admin:org` or `delete_repo`.

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

The second approach stores the token in your Git config, so you do not need to paste it each time. Be aware this puts the token in plain text on disk, and it leaks into any command or log that prints the remote URL.

## Storing It Properly

A credential helper is the better option. Git asks for the token once, then remembers it:

```bash
git config --global credential.helper store
```

On Linux and WSL that writes to `~/.git-credentials` — still plain text, but at least outside the repository. On macOS use `osxkeychain` instead. On Windows, the Git for Windows installer configures `manager`, which keeps the token in Windows Credential Manager.

## Expiry and Rotation

Tokens expiring is the point, not an inconvenience. When one lapses, git starts failing with an authentication error again — generate a replacement and update wherever you stored it. GitHub emails you before a token expires, so this should not catch you out mid-push.

## Security Tips

- **Never commit tokens** to source control
- Use short expiry dates (7 days recommended)
- Store tokens in a password manager
- Revoke tokens you no longer need from the same settings page

> **Rule:** treat tokens like passwords. If a token leaks, revoke it immediately from GitHub settings.

---
## SSH public key and host Authenticity. 
When you try to clone a github repo using git clone `https://git@github.com:octocat/Hello-World.git'

### Error messsage in terminal with git installed.    
`git clone git@github.com:username/toy-app-flask-crud.git
Cloning into 'toy-app-flask-crud'...
Error: The authenticity of host 'github.com (`xx.xx.xx.xx`)' can't be established.`

Three steps are:

- You need to generate an SSH key pair in Terminal, open a terminal and use the `ssh-keygen` command.  For modern security, it is recommended to use the `Ed25519` algorithm: Private key stays in your local device. Public key needs to be shared.

- copy the public key to github. Navigate to profile photo -> Settings -> SSH and GPG keys -> New SSH key -> Title-Authentication key, Paste the copied key -> Add SSH key.
- Clone the repo or push the loal repo. `git clone git@github.com:username/toy-app-flask-crud.git`

`ssh-keygen -t ed25519 -C "your_email@example.com" `  

During the process, you will be prompted to specify the file location (default is `~/.ssh/id_ed25519 or ~/.ssh/id_rsa`) and optionally set a passphrase to encrypt the private key.  The public key will be saved in the same directory with a .pub extension (e.g.,` ~/.ssh/id_ed25519.pub`). 

To retrieve the public key content for sharing or adding to remote servers, use:

`cat ~/.ssh/id_ed25519.pub | xclip -sel clip   ` - On Linux
`cat ~/.ssh/id_ed25519.pub | clip   ` - On Windows

Or copy it directly to a remote host using `ssh-copy-id`:

`ssh-copy-id user@remote_host`

_Next steps: for automated CI/CD pipelines, use **GitHub Apps** or **deploy keys** instead of personal tokens — they provide scoped access without linking to your account._

_Tools mentioned: <a href="https://www.cloudflare.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">Cloudflare Workers</a> for CI/CD deployment, <a href="https://www.digitalocean.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">DigitalOcean</a> for cloud servers._