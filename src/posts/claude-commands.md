---
title: "Claude Code: Commands & Skills Guide"
slug: "claude-commands"
date: 2026-08-05
description: "A practical reference for Claude Code slash commands, keyboard shortcuts, IDE integration, and how skills work."
category: "ai"
tags: ["claude", "cli", "coding agents"]
status: draft
---

## Installation

```bash
npm config set os linux   # Windows Git Bash only
npm install -g @anthropic-ai/claude-code
claude
```

Requires a Pro subscription. Clone a project, `cd` into it, then start with: _"summarise this project"_.

## Working in a Project

Claude Code runs in your terminal and works against the directory you launch it from, so always `cd` into the project first. It reads files, runs commands and makes edits inside that tree — starting it from your home directory gives it either no useful context or far too much.

Run `/init` once per project. It writes a `CLAUDE.md` at the root: a plain markdown file describing the stack, the commands to build and test, and any conventions you want followed. Claude reads it at the start of every session, so anything you catch yourself repeating in prompts belongs in that file instead. Keep it short — it is context you pay for on every request.

## Slash Commands

| Command           | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `/init`           | Create a `CLAUDE.md` config file           |
| `/clear`          | Clear context and history                  |
| `/compact`        | Clear context, keep screen                 |
| `/status`         | Show cwd, memory, model, account           |
| `/cost`           | Usage and spend summary                    |
| `/ide`            | Manage IDE integrations (VS Code / Cursor) |
| `/terminal-setup` | Bind Shift+Enter for newlines              |
| `/review`         | Review a pull request                      |
| `/pr-comments`    | Fetch pull request comments                |

## Keyboard Shortcuts

| Key           | Action             |
| ------------- | ------------------ |
| `Shift + Tab` | Toggle plan mode   |
| `Ctrl + C`    | Exit               |
| `Alt + Enter` | New line in prompt |
| `Esc Esc`     | Rewind last action |

## Resuming Sessions

```bash
claude --continue   # resume last session
claude --resume     # pick a past session
```

## Managing Context

A long session fills the context window with files, diffs and output that stopped being relevant an hour ago, and answers get worse as it fills. The habit worth building is to finish a task and clear before starting an unrelated one — `/clear` for a genuinely fresh start, `/compact` when you want to keep going but shed the noise. Several short focused sessions beat one sprawling one.

## Custom Commands

Slash commands are typed straight at the prompt, and you can add your own. A custom command is just a markdown file in a `commands` directory: put it under `.claude/commands/` to share it with the repo, or in `~/.claude/commands/` to have it everywhere. The filename becomes the command name, and the file contents become the prompt that gets sent.

That makes them worth writing for anything you type more than twice — a release checklist, a bug report template, the exact way you want commit messages written.

## Skills

Skills are instruction files Claude reads before performing a task — code review checklists, doc templates, design guides. They are **reactive**, not automatic: Claude consults them when you give it a task, not on a schedule.

> Think of skills as a rulebook Claude only opens when you hand it a job.
