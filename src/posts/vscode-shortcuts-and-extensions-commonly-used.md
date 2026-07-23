---
title: "VS Code Shortcuts and Extensions I Use Daily"
date: 2026-07-27
description: "A practical reference of essential VS Code keyboard shortcuts and must-have extensions for faster development."
tags: ["VS Code", "Productivity"]
status: published
---

VS Code is the editor most web developers spend their days in. Learning a handful of shortcuts and installing the right extensions can shave hours off your week. Here is what I use every day.

## Keyboard Shortcuts

### Navigation

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+P` | Open the Command Palette — access every command from one place |
| `Ctrl+P` | Quick file search — type a filename to jump to it |
| `Ctrl+R` | Switch between recent projects and folders |
| `Ctrl+B` | Toggle the sidebar on and off |
| `Ctrl+`` ` | Toggle the integrated terminal |
| `Ctrl+Shift+E` | Open the Explorer sidebar |

### Editing

| Shortcut | Action |
|---|---|
| `Alt+Up` / `Alt+Down` | Move the current line up or down |
| `Shift+Alt+Up` / `Shift+Alt+Down` | Copy the current line above or below |
| `Ctrl+D` | Select the next occurrence of the current selection |
| `Ctrl+Shift+K` | Delete the entire current line |
| `Ctrl+/` | Toggle line comment |
| `Ctrl+Shift+/` | Toggle block comment |
| `Alt+Click` | Add a second cursor at the click position |
| `Ctrl+Alt+Up` / `Down` | Add cursor above or below |

### Selection and Search

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+L` | Select all occurrences of the current selection |
| `Ctrl+F` | Find in the current file |
| `Ctrl+H` | Find and replace |
| `Ctrl+Shift+F` | Find across all files in the workspace |

### Tabs and Windows

| Shortcut | Action |
|---|---|
| `Ctrl+Tab` | Switch between open tabs |
| `Ctrl+W` | Close the current tab |
| `Ctrl+\` | Split the editor into two panes |

## Extensions

### Essential

- **Prettier** — auto-formats your code on save. Supports JavaScript, TypeScript, HTML, CSS, JSON, and Markdown. Once installed, enable "Format on Save" in settings.
- **Live Server** — launches a local development server with live reload. Right-click an HTML file and choose "Open with Live Server."
- **ESLint** — catches JavaScript and TypeScript errors as you type. Integrates with Prettier for a clean workflow.

### CSS and Styling

- **Tailwind CSS IntelliSense** — autocomplete, linting, and hover previews for Tailwind CSS classes. Essential if you use Tailwind.
- **HTML CSS Support** — autocomplete for CSS class names already defined in your stylesheets.
- **Color Highlight** — preview CSS color values inline in your code.

### Productivity

- **Material Icon Theme** — adds recognizable file and folder icons to the sidebar so you can find files visually.
- **GitLens** — shows inline blame annotations, commit history, and diffs without leaving the editor.
- **Auto Rename Tag** — when you rename an HTML opening tag, the closing tag updates automatically.

### Sass / SCSS

- **Live Sass Compiler** — compiles `.scss` files to `.css` on save and injects changes into the browser through Live Server.

## My Settings

These are a few settings I change on every new machine:

```json
{
  "editor.fontSize": 16,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "workbench.iconTheme": "material-icon-theme"
}
```

## Wrapping Up

You don't need to memorize every shortcut. Start with five or six that match your workflow — `Ctrl+P` for file search, `Ctrl+D` for multi-cursor editing, and `Ctrl+`` ` for the terminal. Add extensions as you feel specific needs. Over time, these small habits compound into significantly faster development.
