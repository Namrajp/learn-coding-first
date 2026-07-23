---
title: "WSL Development Tips: Paths, Node, and Fixing Vite"
date: 2026-07-23
description: "Practical tips for developing with Node.js inside WSL — fixing paths, setting up nvm, and solving the Vite file-watching problem."
tags:
  - tutorial
  - cli
  - tools
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

> **Rule:** keep your project files inside WSL (`~/`), not on a Windows drive (`/mnt/c/`). This avoids file-watching issues, path problems, and slow I/O.

---

_Next steps: for general dev environment fixes (PostgreSQL, FAT32, disk space), see **Dev Environment Quick Fixes**._
