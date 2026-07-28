---
title: "WSL Development Tips: Paths, Node, and Fixing Vite"
slug: "wsl-development-tips"
date: 2026-07-23
description: "Practical tips for developing with Node.js inside WSL — fixing paths, setting up nvm, and solving the Vite file-watching problem."
category: "tools"
tags: ["wsl", "node.js", "vite", "linux"]
status: published
---

Working with Node.js inside Windows Subsystem for Linux (WSL) comes with a few pitfalls. Here are the solutions to the most common problems.

## Accessing Windows Files from WSL

Your Windows drives are mounted under `/mnt/`. To access your development folder:

```bash
cd /mnt/c/Users/activ/dev/
```

You can set up shortcuts in `~/.bashrc` for convenience:

```bash
alias home="cd /mnt/c/Users/activ/"
alias lab="cd /mnt/e/lab/"
```

After adding these, reload your shell:

```bash
source ~/.bashrc
```

## Setting Up Node.js with nvm for Windows

If you use nvm for Windows (nvm4w), the Node and npm binaries are at a different path than the default install. Add them to your PATH in `~/.bashrc`:

```bash
# nvm4w installs to c:\nvm4w, not the default c:\Program Files\nodejs
PATH=$PATH:"/c/nvm4w/nodejs"
```

Verify your setup:

```bash
node --version
npm --version
```

## The Vite File-Watching Problem in WSL

This is the most common issue developers hit. Vite uses file-system events to trigger hot reloads, but WSL does not always forward these events correctly — especially when your project files live on a Windows drive (`/mnt/c/` or `/mnt/e/`).

The symptom is that changes to files do not trigger a reload in the browser.

**The fix:** Use polling mode by setting an environment variable:

```bash
CHOKIDAR_USEPOLLING=true npm run dev
```

Alternatively, if `node_modules` was installed by Windows npm but you are running from WSL, you may see strange errors. The cleanest fix is to reinstall dependencies from inside WSL:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Finding Your Current Shell

If you are not sure which shell you are using:

```bash
echo $0
echo $SHELL
```

`echo $0` is more accurate — it reflects the current running shell, even if you temporarily switched with `bash` or `zsh`.

## Where to Keep Your Project Files

Reading `/mnt/c` from WSL crosses a bridge between the Linux and Windows filesystems, and every file operation pays that cost. Tools that touch thousands of small files — `npm install`, `git status`, a bundler's initial scan — feel noticeably slower there than they do on Windows or on native Linux. This is the same root cause as the file-watching problem above.

Keep projects on the Linux side instead:

```bash
mkdir -p ~/projects
cd ~/projects
```

You do not lose access from Windows. WSL exposes the Linux filesystem under `\\wsl$\`, and you can open the current directory in Windows Explorer straight from your shell:

```bash
explorer.exe .
```

VS Code handles this well too — with the WSL extension installed, `code .` from inside WSL opens the folder with the editor's backend running on the Linux side.

## Restarting WSL

When WSL gets into a bad state — DNS not resolving, a stuck process, or config changes that need to take effect — shut the whole VM down from PowerShell:

```powershell
wsl --shutdown
```

The next command you run in a WSL terminal boots it again. It is much faster than rebooting Windows and fixes more than you would expect.

> **Rule:** keep your project files inside WSL (`~/`), not on a Windows drive (`/mnt/c/`). This avoids file-watching issues, path problems, and slow I/O.

---

_Next steps: for general dev environment fixes (PostgreSQL, FAT32, disk space), see **Dev Environment Quick Fixes**._

_Tools mentioned: <a href="https://www.cloudflare.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">Cloudflare Workers</a> for edge deployment, <a href="https://www.digitalocean.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">DigitalOcean</a> for cloud servers._
