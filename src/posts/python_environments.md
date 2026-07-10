---
layout: "@layouts/Layout.astro"
title: "Virtual Environments in Python"
date: 2025-10-12
tags:
  - news
  - tutorial
  - python environments
---

# Virtual environments setup

venv is a low level environment in python.

```
$ pip install virtualenv  # low level virtual environment, less prefereable to use
$ pip3 install virtualenvwrapper  # high level environment with abstraction, more preferred
$ python<version> -m venv <virtual-environment-name>
```

To activate and deactivate environment:
`source env/bin/activate`
and
`~ deactivate
`

Virtualenvwrapper is a set of extensions built on top of virtualenv. It provides a more convenient and
streamlined way to manage your virtual environments.

`````$ pip3 install virtualenvwrapper
export WORKON_HOME=~/.virtualenvs
export VIRTUALENVWRAPPER_PYTHON=/Library/Frameworks/Python.framework/Versions/3.6/bin/python3
source /usr/local/bin/virtualenvwrapper.sh````

mkvirtualenv first-env
mkvirtualenv second-env
workon first-env
workon second-env
deactivate
`````

# Find dependencies of a Project:

-`pip list`

-`pip freeze`

# How to find a current shell is bash or zsh

-`$ echo $0` -`$ echo $SHELL`  
`echo $0` is more accurate and if you type bash in zsh shell

To change prompt to include a new line
`PS1="$PS1\n"
`

# Uninstall existing versions

`pip uninstall werkzeug Flask-Login
`

# Reinstall all dependencies

`pip freeze > requirements.txt`

`pip install -r requirements.txt
`

### Useful Links:

- [how-to-setup-virtual-environments](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)
