---
title: "Virtual Environments in Python"
slug: "virtual-environments-in-python"
date: 2026-07-27
description: "Set up Python virtual environments with venv and virtualenvwrapper: creation, activation, dependency management, and best practices."
category: "tools"
tags: ["python", "virtualenv", "pip"]
status: published
---

# Virtual environments setup

venv is a low level environment in python.

The point of an environment is isolation. Each one gets its own `site-packages` directory, so two projects on the same machine can depend on different versions of the same library without fighting each other, and nothing you install ends up in the system Python that your OS depends on.

```
$ pip install virtualenv  # low level virtual environment, less prefereable to use
$ pip3 install virtualenvwrapper  # high level environment with abstraction, more preferred
$ python<version> -m venv <virtual-environment-name>
```

To activate and deactivate environment:
`source env/bin/activate`
and
`~ deactivate`

# Creating and activating with venv

`venv` ships with Python, so there is nothing to install first. Create the environment inside the project folder and keep the name consistent across projects:

```bash
python3 -m venv .venv
```

Activation depends on the shell you are in:

```bash
source .venv/bin/activate     # Linux / macOS, bash or zsh
.venv\Scripts\Activate.ps1    # Windows PowerShell
.venv\Scripts\activate.bat    # Windows cmd.exe
```

Once it is active your prompt is prefixed with the environment name, and `which python` (`where python` on Windows) points inside `.venv`. That is the quickest way to confirm you are not installing into the system interpreter by mistake.

On Windows PowerShell the activation script often fails the first time with:

```text
.venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```

That is PowerShell's execution policy, not a Python problem. Allow local scripts for your own account and run the activation again:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

# Do not commit the environment

Add the environment directory to `.gitignore`:

```text
.venv/
```

The directory holds installed packages plus scripts with absolute paths baked into them, so it is not portable between machines — moving or renaming the folder is enough to break activation. What you commit is `requirements.txt`. Anyone cloning the repo rebuilds the environment from that, which is both smaller and reproducible. If an environment gets into a bad state, delete the folder and create a new one; nothing of value is lost.

Virtualenvwrapper is a set of extensions built on top of virtualenv. It provides a more convenient and
streamlined way to manage your virtual environments.

```bash
$ pip3 install virtualenvwrapper
export WORKON_HOME=~/.virtualenvs
export VIRTUALENVWRAPPER_PYTHON=/Library/Frameworks/Python.framework/Versions/3.6/bin/python3
source /usr/local/bin/virtualenvwrapper.sh

mkvirtualenv first-env
mkvirtualenv second-env
workon first-env
workon second-env
deactivate
```

# Find dependencies of a Project:

- `pip list`

- `pip freeze`

# How to find a current shell is bash or zsh

- `$ echo $0`
- `$ echo $SHELL`

`echo $0` is more accurate and if you type bash in zsh shell

To change prompt to include a new line
`PS1="$PS1\n"`

# Uninstall existing versions

`pip uninstall werkzeug Flask-Login`

# Reinstall all dependencies

`pip freeze > requirements.txt`

`pip install -r requirements.txt`

`pip freeze` prints every installed package with an exact version, which is why it is the one you redirect into `requirements.txt`. `pip list` is for reading — its table layout is not valid input for `pip install -r`.

Regenerate the file whenever you add a dependency, and do it with the environment activated. Freezing from a deactivated shell captures whatever the system interpreter happens to have installed, which is almost never what you want.

### Useful Links:

- [how-to-setup-virtual-environments](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)
