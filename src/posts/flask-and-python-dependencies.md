---
title: "Flask and Virtual Environments in Python"
slug: "flask-and-python-dependencies"
date: 2026-04-27
description: "Master Flask development with virtual environments: setup, dependency management, debug mode, and production best practices."
category: "web-development"
tags: ["flask", "python", "virtualenv"]
status: published
---

To run flask in this project:

- flask run

# flask run is enough because real command is : FLASK_APP=app.py flask run

- I have provided application login in app.py in Path environment using export FLASK_APP=app.py

## The app.py it is pointing at

`FLASK_APP=app.py` only means something if there is an `app.py` with a Flask instance in it. The smallest version:

```python
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello, world!"


if __name__ == "__main__":
    app.run(debug=True)
```

`Flask(__name__)` tells Flask where the application lives so it can resolve templates and static files relative to that module. `@app.route("/")` binds a URL path to the function below it, and whatever that function returns becomes the response body.

Newer Flask versions let you skip the environment variable and name the module on the command line instead:

```bash
flask --app app run --debug
```

`--app app` points at `app.py` and `--debug` does the same job as `FLASK_DEBUG=1`. The `app.run(debug=True)` block is a third way in — it runs when you execute `python app.py` directly, and it is skipped when you start the app through the `flask` command, because the module is imported rather than run as `__main__`.

## we need to enable debug mode when we’re working on our project and server is watching for changes.

- FLASK_APP=app.py FLASK_DEBUG=1 flask run

## To work with python environment:

```bash
lsvirtualenv
mkvirtualenv first-flask-app
workon first-flask-app
pip install flask
deactivate
```

Keep the environment per project, not per machine. `pip install flask` inside an activated environment installs into that environment only, so two Flask projects can sit on different versions without interfering. That is the whole reason the `workon` step comes before the `pip install` step above.

## install dependencies

Find dependencies of a Project:

- `pip list`
- `pip freeze`

How to find a current shell is bash or zsh

```bash
$ echo $0
$ echo $SHELL
```

`echo $0` is more accurate and if you type bash in zsh shell

To change prompt to include a new line

```bash
PS1="$PS1\n"
```

Uninstall existing versions

```bash
pip uninstall werkzeug Flask-Login
```

Reinstall all dependencies

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

## Pin what you install

`pip freeze` writes exact versions, which is what you want committed. An unpinned `flask` line installs whatever happens to be current the next time someone sets the project up, and that is how a project that worked last month stops working. Regenerate the file with the environment active, and rebuild from it with `pip install -r requirements.txt`.

## Turn debug mode off in production

Debug mode belongs on your machine only. When an unhandled exception occurs it serves the Werkzeug traceback page, which includes an interactive console that can execute Python on the server. It is PIN-protected, but it is still a remote code execution path that should never be reachable from the internet. Debug mode also reloads the process on every file change, which you do not want in a running service.

The development server itself is not meant for production either. Deploy behind a WSGI server such as Gunicorn or uWSGI — or Waitress on Windows — and leave debug off.
