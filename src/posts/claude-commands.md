---
title: "Claude Code: Commands & Skills Guide"
date: 2026-03-19
tags: ["claude", "ai", "cli", "tools"]
description: "A practical reference for Claude Code slash commands, keyboard shortcuts, IDE integration, and how skills work."
layout: "@layouts/Layout.astro"
---

## Installation

```bash
npm config set os linux   # Windows Git Bash only
npm install -g @anthropic-ai/claude-code
claude
```

Requires a Pro subscription. Clone a project, `cd` into it, then start with: *"summarise this project"*.

## Slash Commands

| Command | Purpose |
|---|---|
| `/init` | Create a `CLAUDE.md` config file |
| `/clear` | Clear context and history |
| `/compact` | Clear context, keep screen |
| `/status` | Show cwd, memory, model, account |
| `/cost` | Usage and spend summary |
| `/ide` | Manage IDE integrations (VS Code / Cursor) |
| `/terminal-setup` | Bind Shift+Enter for newlines |
| `/review` | Review a pull request |
| `/pr-comments` | Fetch pull request comments |

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Shift + Tab` | Toggle plan mode |
| `Ctrl + C` | Exit |
| `Alt + Enter` | New line in prompt |
| `Esc Esc` | Rewind last action |

## Resuming Sessions

```bash
claude --continue   # resume last session
claude --resume     # pick a past session
```

## Skills

Skills are instruction files Claude reads before performing a task — code review checklists, doc templates, design guides. They are **reactive**, not automatic: Claude consults them when you give it a task, not on a schedule.

> Think of skills as a rulebook Claude only opens when you hand it a job.
