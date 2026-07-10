---
layout: "@layouts/Layout.astro"
title: "How  to use diff in git"
date: 2026-05-27
tags:
  - essay
  - tutorial
  - git
---

The git diff command compares different states of your code to show exactly what lines have been added, modified, or deleted. It serves as a safety check before you stage or commit code.

# Core Commands
- View unstaged changes: Compare your current working directory with your staging area.
`bash git diff`
Use code with caution.
- View staged changes: Compare your staged changes (after running git add) with your last commit.
`bash git diff --staged`
Use code with caution.
(Note: git diff --cached does the exact same thing.)
* View all local changes:
Compare everything in your working directory (staged or unstaged) against your last commit.
`bash git diff HEAD`
Use code with caution.
* Advanced ComparisonsCompare specific files: 
Restrict the output to a single file to reduce terminal noise.
`bash git diff path/to/file.txt`
Use code with caution.
- Compare two branches: 
See what is different between the tips of two separate branches.
`bash git diff branch_one branch_two`
Use code with caution.
+ Compare two specific commits:
Use commit hashes to see exactly what changed between two points in history.`bash git diff 1234abc 5678def`  
Use code with caution.
+ Useful Formatting Flags--stat: 
Show a high-level summary of modified files and line counts instead of the full raw code change.-w: 
+ Ignore all whitespace changes (like extra spaces or tabs) to focus purely on code logic.--name-only: Display only the names of the files that changed.--color-words: Show inline word-level changes instead of comparing entire lines.
+ How to Read the OutputWhen you run git diff, the terminal uses specific markers to show modifications:Red text with a minus sign (-): 

Content that was removed or modified from the older version.Green text with a plus sign (+): Content that was added or represents the updated version.