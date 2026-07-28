---
title: "How  to use diff in git"
slug: "git-diff"
date: 2026-08-06
description: "Learn git diff commands: compare branches, commits, and files. Master formatting flags and understand diff output markers."
category: "tools"
tags: ["git", "cli", "version control"]
status: draft
---

The git diff command compares different states of your code to show exactly what lines have been added, modified, or deleted. It serves as a safety check before you stage or commit code.

# Core Commands

**View unstaged changes.** Compare your current working directory with your staging area.

```bash
git diff
```

**View staged changes.** Compare your staged changes, after running `git add`, with your last commit.

```bash
git diff --staged
```

`git diff --cached` does the exact same thing.

**View all local changes.** Compare everything in your working directory, staged or unstaged, against your last commit.

```bash
git diff HEAD
```

## Advanced Comparisons

**Compare specific files.** Restrict the output to a single file to reduce terminal noise.

```bash
git diff path/to/file.txt
```

**Compare two branches.** See what is different between the tips of two separate branches.

```bash
git diff branch_one branch_two
```

**Compare two specific commits.** Use commit hashes to see exactly what changed between two points in history.

```bash
git diff 1234abc 5678def
```

## Useful Formatting Flags

- `--stat` — Show a high-level summary of modified files and line counts instead of the full raw code change.
- `-w` — Ignore all whitespace changes, like extra spaces or tabs, to focus purely on code logic.
- `--name-only` — Display only the names of the files that changed.
- `--color-words` — Show inline word-level changes instead of comparing entire lines.

These combine with each other and with everything above, so you can cut a noisy diff down in one go:

```bash
git diff -w --stat main feature
```

## How to Read the Output

When you run `git diff`, the terminal uses specific markers to show modifications:

- Red text with a minus sign (`-`) is content that was removed or modified from the older version.
- Green text with a plus sign (`+`) is content that was added, or that represents the updated version.

A modified line shows up as both — a red line for the old text, then a green line directly beneath it for the new one. Git does not record edits as edits. It only stores removals and additions, and a change to an existing line is simply both at once.

## Two Dots vs Three Dots

`git diff branch_one branch_two` and `git diff branch_one..branch_two` mean the same thing: compare the two branch tips directly against each other.

Three dots behave differently. `git diff branch_one...branch_two` compares `branch_two` against the merge base — the commit where the two branches last shared history. It shows only what `branch_two` added, ignoring anything that landed on `branch_one` after they diverged.

```bash
git diff main...feature
```

This is usually what you want when reviewing a feature branch, because it matches what a pull request shows you.

## Separating Paths from Branch Names

If a file and a branch share a name, git cannot tell which one you meant and stops with `fatal: ambiguous argument`. Put `--` before the path to force everything after it to be read as a filename:

```bash
git diff -- path/to/file.txt
```

## Reading the Hunk Header

Every block of changes starts with a line like this:

```
@@ -12,7 +12,9 @@
```

The part after the minus sign describes the old version: starting at line 12, covering 7 lines. The part after the plus sign describes the new version: starting at line 12, covering 9 lines. So two lines were added. Git prints a few unchanged lines of context around each change, which is why those counts are larger than the number of lines you actually edited.

## Getting Out of the Pager

Long diffs open in a pager rather than scrolling past. Press space to page down and `q` to quit. To print output straight to the terminal instead, disable the pager:

```bash
git --no-pager diff
```
