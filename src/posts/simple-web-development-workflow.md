---
title: "A Simple Web Development Workflow"
date: 2026-05-29
description: "Organize your web development projects with a clean folder structure, VS Code setup, and Sass workflow."
tags: ["Web Development", "VS Code", "Sass"]
status: published
---

A clean workflow saves time and keeps projects manageable as they grow. This post covers the folder structure, editor setup, and build process I use for most web projects.

## Project Folder Structure

Every project starts with a clear separation between source files and compiled output:

```
project/
  images/
  app/
    style.scss
    script.js
  dist/
    style.css
  index.html
```

- **app/** holds your source files (SCSS, JavaScript).
- **dist/** holds compiled output (CSS). The browser loads from here.
- **images/** keeps all image assets in one place.

This separation means you never manually edit compiled files. Your source of truth is always in `app/`.

## VS Code Setup

A few settings make VS Code more comfortable for daily use:

- **Font size**: Set to `18px` or whatever feels comfortable. Find it in Settings or use `Ctrl+,` and search for `font size`.
- **Tab size**: Set to `2` instead of the default `4` for cleaner indentation in HTML, CSS, and JS.
- **Word wrap**: Enable it so long lines don't require horizontal scrolling.

### Useful Extensions

Install these from the Extensions Marketplace (`Ctrl+Shift+X`):

- **Live Server** — launches a local dev server with live reload when you save files.
- **Live Sass Compiler** — compiles `.scss` to `.css` on save and injects changes into the browser.
- **Prettier** — auto-formats your code on save for consistent style.
- **Material Icon Theme** — adds colorful file icons to the sidebar.
- **HTML CSS Support** — autocomplete for CSS classes already defined in your stylesheets.
- **Tailwind CSS IntelliSense** — autocomplete and linting if you use Tailwind.

### Keyboard Shortcuts

These shortcuts speed up everyday editing:

| Shortcut | Action |
|---|---|
| `Shift+Alt+Down` | Copy the current line down |
| `Ctrl+D` | Select the next occurrence of the current selection |
| `Ctrl+B` | Toggle the sidebar |
| `Ctrl+P` | Quick file search |
| `Ctrl+R` | Switch between recent folders |
| `Ctrl+Shift+P` | Open the Command Palette |
| `Alt+Click` | Add a second cursor |

## The Sass Build Process

I use a setup where the `app/` folder contains the main `style.scss` file along with partials:

```
app/
  style.scss
  _globals.scss
  _variables.scss
  _mixins.scss
  _typography.scss
```

The main file imports the partials:

```scss
@import "variables";
@import "mixins";
@import "globals";
@import "typography";
```

The **Live Sass Compiler** extension watches these files and outputs a single `style.css` into the `dist/` folder every time you save. Your HTML links to `dist/style.css`, and the browser updates automatically during development.

To debug, open Chrome DevTools (`F12`) and inspect the elements to confirm your compiled styles are applied correctly.

## Pulling It All Together

1. Create your folder structure.
2. Install the extensions you need.
3. Write SCSS in `app/`, let the compiler output to `dist/`.
4. Use Live Server to preview changes instantly.

This workflow keeps source and output separate, gives you instant feedback while editing, and scales well as projects grow in complexity.
