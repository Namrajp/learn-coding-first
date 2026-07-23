---
title: "HTML Crash Course in 10 Minutes"
date: 2026-06-14
description: "A quick introduction to HTML fundamentals including elements, tags, block vs inline elements, and boilerplate."
tags: ["HTML"]
status: published
---

HTML is the foundation of every web page. It defines the structure and meaning of content using elements — the building blocks that browsers interpret and render. This crash course covers the essentials you need to start building pages.

## The Boilerplate

Every HTML page starts with the same skeleton. In VS Code, type `!` and press Tab (using [Emmet](https://emmet.io/)) to generate it instantly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <!-- Your content goes here -->
</body>
</html>
```

- **`<!DOCTYPE html>`** tells the browser this is an HTML5 document.
- **`<html lang="en">`** is the root element. The `lang` attribute helps screen readers and search engines.
- **`<head>`** contains metadata — character set, viewport settings, title, and links to stylesheets or scripts.
- **`<body>`** contains everything the user sees and interacts with.

## Block vs Inline Elements

Understanding the difference between block and inline elements is key to layout:

### Block-Level Elements

Block elements take up the full width available. They stack vertically. Common block elements:

- Headings: `<h1>` through `<h6>` (h1 is largest, h6 is smallest)
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Containers: `<div>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Tables: `<table>`, `<form>`

```html
<h1>Main Heading</h1>
<p>This paragraph takes up the full width.</p>
<div>This div is also full width by default.</div>
```

### Inline Elements

Inline elements only take up the space of their content. They flow within the surrounding text. Common inline elements:

- **`<span>`** — a generic inline container
- **`<a>`** — a link
- **`<img>`** — an image (technically replaced, but behaves inline)
- Text formatting: **`<strong>`**, *`<em>`*, ~~`<del>`~~, `<mark>`, `<sup>`, `<sub>`, `<small>`

```html
<p>
  This is a <strong>bold</strong> word and an <em>italic</em> word
  in the same paragraph.
</p>
```

## Text Formatting Examples

```html
<p>
  Normal text with <strong>strong emphasis</strong> and
  <em>italic emphasis</em>.
</p>
<p>
  H<sub>2</sub>O — subscript for chemical formulas.
</p>
<p>
  E = mc<sup>2</sup> — superscript for exponents.
</p>
<p>
  <del>Deleted text</del> and <mark>highlighted text</mark>.
</p>
<p>
  <small>Fine print goes here.</small>
</p>
```

## Links and Images

```html
<a href="https://example.com">Visit Example</a>
<img src="photo.jpg" alt="A description of the image" />
```

Always include the `alt` attribute on images. It improves accessibility and is required by the HTML specification.

## How the Browser Interprets HTML

The browser parses your HTML into a tree structure called the [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction). Elements in the `<head>` are not displayed — they provide information to the browser and search engines. The `<title>` content appears in the browser tab. Meta tags influence how search engines index your page.

## Conclusion

HTML and CSS are easy to learn at a basic level, but mastering them takes practice. Build projects — landing pages, portfolios, dashboards — to reinforce what you learn. The structure you define with HTML today is the foundation for every interactive experience on the web.
