---
layout: "@layouts/Layout.astro"
title: "WSL Development Tips: Paths, Node, and Fixing Vite"
date: 2026-07-21
description: "Practical tips for developing with Node.js inside WSL — fixing paths, setting up nvm, and solving the Vite file-watching problem."
tags:
  - tutorial
  - cli
  - tools
status: draft
---

Working with Node.js inside Windows Subsystem for Linux (WSL) comes with a few gotchas. Here are the solutions to the most common problems.

## Accessing Windows Files from WSL

Your Windows drives are mounted under `/mnt/`. To access your development folder:

```bash
cd /mnt/c/Users/activ/dev/
```

You can set up shortcuts in `~/.bashrc` for convenience:

```bash
alias home="cd /mnt/c/Users/activ/"
alias ~="cd /mnt/c/Users/activ/"
alias lab="cd /mnt/e/lab/"
```

After adding these, reload your shell:

```bash
source ~/.bashrc
```

## Setting Up Node.js with nvm for Windows

If you use nvm for Windows (nvm4w), the Node and npm binaries are at a different path than the default install. Add them to your PATH in `~/.bashrc`:

```bash
# Node path in MingW — nvm4w installs to c:\nvm4w, not the default c:\Program Files\nodejs
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

## Customizing the Prompt

To add a new line to your shell prompt:

```bash
PS1="$PS1\n"
```

## Summary

- Windows drives are at `/mnt/c/`, `/mnt/e/`, etc.
- Set up PATH for nvm4w Node binaries in `~/.bashrc`
- Use `CHOKIDAR_USEPOLLING=true` to fix Vite hot reload in WSL
- Reinstall `node_modules` from WSL if switching between Windows and Linux npm
- Use `echo $0` to check your current shell
