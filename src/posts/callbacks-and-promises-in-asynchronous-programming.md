---
title: "Callbacks and Promises in Asynchronous Programming"
date: 2026-07-23
description: "Learn how callbacks, promises, and async/await enable non-blocking code in JavaScript."
tags: ["JavaScript"]
status: published
---

Asynchronous programming lets your code continue running while waiting for something slow — a database query, a network request, or a timer. Instead of blocking execution on each line, JavaScript moves on and handles the result when it arrives.

Browsers provide APIs for this: `setTimeout`, `fetch`, `Promise`, and more. In the backend, you will encounter REST and GraphQL APIs that work the same way.

## Callbacks and `setTimeout`

A callback is a function you pass to another function to be called later. JavaScript uses callbacks everywhere — `forEach`, `map`, `filter`, `fetch`, `addEventListener`, and `setTimeout`.

### `setTimeout` in Action

```js
setTimeout(() => console.log("Hello"), 1000);
setTimeout(() => console.log("World"), 2000);
setTimeout(() => console.log("Done"), 5000);
```

The order of execution does not match the order in the code. "Hello" prints after 1 second, "World" after 2 seconds, and "Done" after 5 seconds. JavaScript does not wait — it sets up the timers and continues.

This happens because of the **event loop**. Asynchronous functions are queued and only executed when their turn comes. Each browser tab, Node.js process, and Web Worker has its own event loop, so they run independently without blocking each other.

### Nesting Callbacks for Sequential Operations

When one asynchronous operation depends on the result of another, you nest callbacks:

```js
setTimeout(() => {
  console.log("First");

  setTimeout(() => {
    console.log("Second");

    setTimeout(() => {
      console.log("Third");
    }, 2000);
  }, 1000);
}, 500);
```

This works, but deeply nested callbacks become hard to read and maintain — a problem known as **callback hell**. Promises solve this.

### Passing Callbacks as Parameters

You can write your own functions that accept callbacks:

```js
function handleName(name, cb) {
  const fullName = `${name} Carter`;
  cb(fullName);
}

function makeUpperCasename(value) {
  console.log(value.toUpperCase());
}

function reverseName(value) {
  console.log(value.split("").reverse().join(""));
}

handleName("Jimmy", makeUpperCasename);
handleName("Jimmy", reverseName);
```

The `cb` parameter is invoked inside `handleName`. You pass any function as the second argument — it gets called with the result.

## Promises

A Promise represents a value that may not be available yet. You create one with the `new` constructor, which takes a function with `resolve` and `reject` callbacks:

```js
const promise = new Promise((resolve, reject) => {
  // do something async
  resolve("It worked!");
  // or: reject("Something went wrong");
});
```

Handle the result with `.then()` and `.catch()`:

```js
promise
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

Promises chain naturally, which eliminates callback hell:

```js
fetchUser()
  .then((user) => fetchPosts(user.id))
  .then((posts) => console.log(posts))
  .catch((error) => console.error(error));
```

Each `.then()` receives the result of the previous one. Errors bubble to the nearest `.catch()`.

## Async / Await

`async/await` is syntactic sugar over Promises that makes asynchronous code read like synchronous code:

```js
async function getProducts() {
  const response = await fetch("/api/products");
  const data = await response.json();
  console.log(data);
}

getProducts();
```

- Mark a function with `async` to use `await` inside it.
- `await` pauses execution until the Promise resolves.
- Wrap `await` calls in `try/catch` for error handling.

```js
async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## The Fetch API

`fetch` makes HTTP requests from the browser. It returns a Promise that resolves to a `Response` object:

```js
(async () => {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

The `Response` object has a body you need to parse — `.json()` for JSON, `.text()` for plain text, `.blob()` for binary data. Each of these also returns a Promise, so you `await` them too.

## Choosing Between Callbacks, Promises, and Async/Await

- **Callbacks** — use them for simple event handlers and `setTimeout`. Avoid deep nesting.
- **Promises** — use them when you need to chain multiple asynchronous operations.
- **Async/await** — use it for the clearest, most readable code. It is the modern standard.

All three approaches handle the same fundamental problem: running code without blocking. The difference is readability and maintainability as your code grows.
