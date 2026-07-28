---
title: "npm on WSL mingw"
slug: "npm-on-wsl-mingw"
date: 2026-05-25
description: "Fix npm run commands in Git Bash (MinGW64) on Windows: understand the issue and use cmd.exe workaround."
category: "tools"
tags: ["npm", "wsl", "windows", "git bash"]
status: published
---

# Why `npm run` Commands Don't Work in MinGW64 (Git Bash)

If you're using Git Bash (MinGW64) on Windows and `npm run build` or `npm run dev` isn't working, here's why and how to fix it.

## The Problem

MinGW64 (Git Bash) doesn't always play nicely with npm scripts due to path and environment differences between Windows and the Unix-like MinGW environment.

## Why This Happens

Two things in the MinGW environment trip npm up.

The first is path translation. MinGW rewrites arguments that look like Unix paths into Windows paths before handing them to a native Windows program. A flag value starting with a slash can end up silently converted into something like `C:/Program Files/Git/...`, which is not what your script expected. This is why some npm scripts run fine and others fail with a confusing "cannot find" error — it depends on whether any of the arguments look like a path.

The second is the terminal. Git Bash runs on MinTTY, which native Windows console programs do not recognize as a real terminal. Anything that wants interactive input or draws a progress bar can hang, print nothing, or exit immediately. Dev servers that wait for a keypress are the usual casualties.

## Where npm Installs Things

- **nvm-windows** defaults to `C:\nvm4w\nodejs`
- **Global npm packages** are installed in:
  ```
  %APPDATA%\npm\node_modules
  ```
  Which translates to:
  ```
  C:\Users\<YourUserName>\AppData\Roaming\npm\node_modules
  ```

## The Fix

Run npm commands through `cmd.exe` instead:

```bash
cmd.exe /c npm run build
cmd.exe /c npm run dev
```

This forces the command to run in the Windows command prompt environment where npm works correctly.

## Alternative: winpty

If the symptom is a missing terminal rather than a mangled path — the command starts but produces no output, or refuses to accept input — `winpty` is the better workaround. It gives the Windows program a console it recognizes:

```bash
winpty npm run dev
```

`winpty` ships with Git for Windows, so it is already on your PATH.

## Or Just Use WSL

If you have WSL installed, running the same command from a WSL shell sidesteps the whole problem. WSL is a real Linux environment, so there is no path translation layer and no MinTTY mismatch.

One thing to watch out for: Node installed on Windows and Node installed inside WSL are two completely separate installations. Each has its own npm, its own global packages, and its own `node_modules`. If you install dependencies from Windows and then run the dev server from WSL, any package with a compiled native binary was built for the wrong platform, and you will get errors about invalid ELF headers or missing bindings. Pick one environment per project and stay in it. If you have already mixed them, delete `node_modules` and reinstall from the environment you intend to use.

## Running Webpack

To run webpack directly:

```bash
npx webpack
```

## Summary

| Shell              | Works? | Workaround                        |
| ------------------ | ------ | --------------------------------- |
| PowerShell         | Yes    | —                                 |
| CMD                | Yes    | —                                 |
| Git Bash (MinGW64) | No     | Use `cmd.exe /c npm run <script>` |
