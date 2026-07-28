---
title: "Dev Environment Quick Fixes: VSCode, PostgreSQL, FAT32, and Disk Space"
slug: "dev-environment-quick-fixes"
date: 2026-06-26
description: "A collection of quick fixes for common developer environment issues — from VSCode shortcuts to PostgreSQL config and filesystem limitations."
category: "tools"
tags: ["vs code", "postgresql", "cli", "troubleshooting"]
status: published
---

A collection of quick solutions to problems that come up during day-to-day development. Bookmark this one — you will probably need it.

## VSCode Multi-Cursor Shortcuts

Selecting multiple lines or placing cursors on multiple lines saves a lot of time:

- **Ctrl + Alt + Arrow Keys** — Select multiple lines vertically
- **Shift + Arrow Keys** — Extend selection line by line
- **Alt + Click** — Place multiple cursors at specific positions

These work in the default VSCode keybinding and are essential for editing repetitive code blocks.

## PostgreSQL: Reset Password and Allow Local Connections

If you need to reset the PostgreSQL default user password, edit the config files in your PostgreSQL data directory:

```
C:\Program Files\PostgreSQL\17\data\pg_hba.conf
C:\Program Files\PostgreSQL\17\data\postgresql.conf
```

To allow password-less local connections (for development only), add this line to `pg_hba.conf`:

```
host    all     all     127.0.0.1/32     trust
```

Then restart the PostgreSQL service.

To change the password from the command line:

```bash
psql -U postgres
ALTER USER postgres PASSWORD 'your_new_password';
```

## FAT32 and exFAT: Symlinks Do Not Work

If you are developing on an external drive formatted as FAT32 or exFAT, you will run into problems with tools that need hard links or symbolic links. For example, `bun add drizzle-orm pg` may fail silently or throw errors.

**The fix:** Move your project to an NTFS-formatted drive. On Windows, your internal `C:\` drive is almost always NTFS.

## Low Disk Space on Ubuntu (WSL)

If you see "Low disk space on FileSystem root" in WSL, the issue is usually that your WSL virtual disk (`ext4.vhdx`) is growing on a partition that is running out of space.

The proper fix involves:

1. Shut down WSL: `wsl --shutdown`
2. Move the WSL disk image to a partition with more space
3. Create a new partition, format it, and copy `/home` to it
4. Update `/etc/fstab` with the UUID of the new partition

This is an advanced operation — back up your data first.

## Updating Drizzle ORM

If you are using Drizzle ORM and need to run migrations or generate new schema files, make sure your packages are up to date:

```bash
npm update --save-dev drizzle-kit
npm update --save drizzle-orm
```

Also remember: database names should use underscores, not hyphens. `astro_tasks_app` works, `astro-tasks-app` does not.

## Port Already in Use

Starting a dev server and getting `EADDRINUSE: address already in use :::3000` almost always means a previous run never shut down. Find what is holding the port and stop it:

```bash
lsof -i :3000
kill -9 <pid>
```

On Windows, use `netstat -ano | findstr :3000` to get the PID, then `taskkill /PID <pid> /F`.

## Quick Shell Tip: Finding Your Shell

Not sure which shell you are in?

```bash
echo $0
echo $SHELL
```

`echo $0` is more accurate since it reflects the actual running shell.

> **Rule:** most dev environment problems come down to three things — permissions, file systems, and paths. Check those first.

---

_Next steps: for WSL-specific issues like Vite hot reload and Node path setup, see **WSL Development Tips**._
