---
title: "Html crash course in 10 minutes"
date: 2026-07-23
tags: ["HTML"]
status: published
---

# Introduction 
I want to start with elements that are basic to understand html. By elements I mean each item of the document which are tags in html. The first element is With the introduction of html5, whole new tags have been introduced.
## Getting started
Coding with abbreviations of [Emmet](https://emmet.io/) makes it easy in my favourite editor visual studio code.If you open new file in vscode and type ! you see a markup called boilerplate.The top of which is `<!DOCTYPE html>` which conveys its a document of type html. The next line is `<html>` which says its the outermost tag of this code. The `html` tag encloses the `head` and `body`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	
</body>
</html>
```
So by now it may be clear tags are the main elements we were talking before. Two basic tags are block level tags and inline tags. 
### Elements of html document 
Headings in a document are h1, h2, h3, h4, h5, h6. The first level heading is h1 which is largest in font size and h6 is smallest. They are **block level elements**. Similarly, paragraph tag `p`, unordered list `ul`,list items `li`,`div` s, `table`, `form` these tags are block level elements.
```html
<body>
    <!-- Headings -->

    <h1>My Heading one</h1>
    <h2>My Heading three</h2>
    <h3>My Heading two</h3>

    <!-- Paragraphs with text formatting -->
    <p>
      Lorem ipsum dolor sit amet consectetur, <del>adipisicing</del> elit.
      Praesentium, veniam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur saepe molestias nostrum fuga possimus, natus quia repellat sit autem in voluptatum reprehenderit sint iste explicabo eos impedit quo dolores modi? 
    </p>
    <p>
      Lorem <em>ipsum dolor</em> sit amet <mark>consectetur</mark>,
      <del>adipisicing</del>
```


The block level elements take the whole line.**Inline elements** take up the space of their text only.Some common inline elements are `span, img, anchor` tags and text formatting tags like `strong`,`em`,`mark`,`del`,`sup`,`sub` etc.The browser interprets the tags from a tree like structure called [Document Object Model(DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction),Where the tags inside of `head` are used for information only. The content inside `title` tag is displayed on top of document in tabs. The content of meta tags are used for [Search Engine Optimization](https://moz.com/beginners-guide-to-seo) purpose for search engines to index the pages
   ```html
 <p>
      Lorem <em>ipsum dolor</em> sit amet <mark>consectetur</mark>,
      <del>adipisicing</del>
      elit. Praesentium, veniam!
    </p>
    <p>
      <strong> ipsum dolor</strong> sit amet consectetur, adipisicing elit.
      Praesentium, veniam!
    </p>
    <p>
      Lorem <small>ipsum</small>, <sup>dolor</sup> <sub>sit</sub> amet
      consectetur adipisicing elit.
      <!-- inline span image and anchor a tags -->
      <span style="color: blue">Necessitatibus</span>, eius.
    </p>
```

# Conclusion
HTML and CSS is easy to learn the basics but to master the CSS to an expert level need a lot of practice. I mean by practice is doing projects to learn the CSS and master the language.