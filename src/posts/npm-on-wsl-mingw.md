---
title: "npm on WSL mingw"
date: 2026-07-21
tags: []
status: published
description: "Fix npm run commands in Git Bash (MinGW64) on Windows: understand the issue and use cmd.exe workaround."
---

# Why `npm run` Commands Don't Work in MinGW64 (Git Bash)

If you're using Git Bash (MinGW64) on Windows and `npm run build` or `npm run dev` isn't working, here's why and how to fix it.

## The Problem

MinGW64 (Git Bash) doesn't always play nicely with npm scripts due to path and environment differences between Windows and the Unix-like MinGW environment.

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
