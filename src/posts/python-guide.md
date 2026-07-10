---
layout: "@layouts/Layout.astro"
title: "The Python Guide: Virtual Environments, pip, and Everyday Workflows"
date: 2026-02-21
tags:
  - tutorial
  - python
  - python environments
---

Python is one of the most widely used languages in the world, but a clean development workflow matters just as much as the code itself. This guide covers the essentials — virtual environments, dependency management, and handy tricks that save time day to day.

## 1. Setting Up a Virtual Environment with venv

Virtual environments keep each project's dependencies isolated from one another and from your system Python. Every project should have its own — it prevents version conflicts and makes your setup reproducible on any machine.

```bash
mkdir projectA && cd projectA

python3.8 -m venv env

source env/bin/activate       # Linux / macOS
env\Scripts\activate.bat      # Windows CMD
env\Scripts\Activate.ps1      # Windows PowerShell

# To exit the environment:
deactivate
```

Running `python3.8 -m venv env` creates an `env/` folder containing an isolated Python binary, pip, and a `lib/` directory for installed packages. Always add `env/` to your `.gitignore` — it should never be committed to version control.

## 2. Managing Dependencies with pip

pip is Python's package installer. The key workflow is to install what you need, then freeze those dependencies into a `requirements.txt` file so anyone else can reproduce your exact environment with a single command.

```bash
pip install Flask                   # install a package
pip list                            # see installed packages
pip freeze > requirements.txt       # save exact versions
pip install -r requirements.txt     # restore from file
```

To uninstall and cleanly reinstall all dependencies — useful when something breaks — run `pip uninstall package-name` followed by `pip install -r requirements.txt`. This is often the fastest way to resolve mysterious dependency conflicts.

## 3. virtualenvwrapper for Convenience

If you manage many projects, `virtualenvwrapper` is a layer on top of venv that gives you short commands to create, switch, list, and delete environments from anywhere on your system — no need to navigate into the project folder first.

```bash
pip3 install virtualenvwrapper

mkvirtualenv my-project    # create
workon my-project          # activate
lsvirtualenv               # list all environments
rmvirtualenv my-project    # delete
```

You can confirm which environment is currently active at any time by running `echo $VIRTUAL_ENV` — it prints the full path to the active environment, or nothing if none is active.

## 4. Spin Up a Quick HTTP Server

Python ships with a built-in HTTP server that's useful for serving static files locally — great for previewing HTML or sharing a folder over a local network without installing anything extra.

```bash
python -m http.server 8000
# Serves the current directory at http://localhost:8000
```

## 5. Clearing the Python Interpreter

When working interactively in the Python REPL, the screen can fill up quickly. There's no built-in `clear` command, but you can use `os.system()` to call the terminal's clear command. A cross-platform one-liner works on both Windows and Unix.

```python
import os

clear = lambda: os.system('cls' if os.name == 'nt' else 'clear')
clear()  # call it any time
```

`os.name == 'nt'` evaluates to `True` on Windows and `False` on Linux or macOS, so the same function works everywhere without any changes.

## 6. Python in WSL / Ubuntu on Windows

When running Python projects inside WSL (Windows Subsystem for Linux), your Windows files are accessible under `/mnt/c/`. Navigate there from the Ubuntu terminal to work on projects stored in your Windows filesystem.

```bash
cd /mnt/c/Users/yourname/dev/my-project
python3 -m venv env
source env/bin/activate
```

If you run into issues with Node-based tools (like Vite) inside WSL, a common fix is to delete `node_modules` and reinstall from within the Linux environment, or set `CHOKIDAR_USEPOLLING=true` to work around file-watcher mismatches between Windows and Linux.

---

A solid Python workflow comes down to three habits: always use a virtual environment, keep your `requirements.txt` up to date, and know your tools. The commands above cover the majority of what you'll need for day-to-day Python development.
