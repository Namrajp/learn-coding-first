---
layout: "@layouts/Layout.astro"
title: "Django Tutorial: Building Your First Polls App"
date: 2026-07-21
description: "A step-by-step guide to creating your first Django application with views, URL routing, database models, and the admin interface."
tags:
  - tutorial
  - python
  - django
status: draft
---

Django is a powerful Python web framework that makes it easy to build robust web applications quickly. In this tutorial, we will walk through creating a simple Polls application from scratch.

## Prerequisites

Make sure you have Python installed and a virtual environment set up:

```bash
python3 -m django --version
mkvirtualenv first_django_app
workon first_django_app
```

## Creating a Django Project

First, create a new Django project:

```bash
mkdir djangotutorial
django-admin startproject mysite djangotutorial
```

This creates a `mysite` project inside the `djangotutorial` directory with the basic project structure.

## Starting the Development Server

Run the server to make sure everything is working:

```bash
python3 manage.py runserver
```

Visit `http://127.0.0.1:8000/` in your browser to see the default Django welcome page.

## Creating the Polls App

Django projects are made up of apps. Each app handles a specific feature. Let's create the Polls app:

```bash
python3 manage.py startapp polls
python3 manage.py runserver
```

## Writing Your First View

Open `polls/views.py` and add a simple view:

```python
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

Next, create a `polls/urls.py` file to map a URL to this view:

```python
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

Now wire it up in the project's root `mysite/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
]
```

Visit `http://127.0.0.1:8000/polls/` and you should see "Hello, world. You're at the polls index."

## Setting Up the Database

Django uses a powerful ORM to manage your database. Run the initial migration to set up the default database:

```bash
python3 manage.py migrate
```

Add your app to `INSTALLED_APPS` in `mysite/settings.py`:

```python
INSTALLED_APPS = [
    "polls.apps.PollsConfig",
    # ... other apps
]
```

Then create and apply migrations for the Polls app:

```bash
python3 manage.py makemigrations polls
python3 manage.py sqlmigrate polls 0001
python3 manage.py migrate
```

The `sqlmigrate` command shows you the SQL that Django will execute — a great way to understand what is happening under the hood.

## Using the Django Shell

Django provides an interactive shell for testing your models and queries:

```bash
python3 manage.py shell
```

This is useful for quick experiments without writing full views or tests.

## Introducing the Django Admin

Django comes with a built-in admin interface. Create an admin user:

```bash
python3 manage.py createsuperuser
```

Follow the prompts to set a username, email, and password. Then start the server and visit `http://127.0.0.1:8000/admin/` to log in.

## Summary

In this tutorial, you learned how to:

- Create a Django project and app
- Write a simple view and configure URL routing
- Set up database migrations
- Use the Django shell
- Create an admin user and access the admin interface

This is the foundation for building more complex Django applications. From here, you can add models, forms, templates, and more to your Polls app.
