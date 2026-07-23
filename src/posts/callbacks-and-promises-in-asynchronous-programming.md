---
title: "Callbacks and Promises in Asynchronous Programming"
date: 2026-07-23
tags: ["Javascript"]
status: draft
---

**Asynchronous Programming means running programs without waiting for execution line by line**. We can move onto next line during execution. If one line accessing data from database or server is taking wait time and we donot want to halt entire program.

Browsers provide API's like setTimeout, promise, Async-await, fetch API, Storage API for Asynchronous programs.These are commonly called by the name [Web API](https://en.wikipedia.org/wiki/Web_API).

In backend there are other api's like [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) api, graphQl api.

## Callbacks and setTimeout function

Callbacks are very useful in application programs.For a simple example,We can use callbacks using `setTimeout` function. We can see most functions in javascript use callbacks like`forEach`,`fetch`,`promise`,`addEventListener`, `async` `await`,`map`, `filter`, `reduce`.
## setTimeout 
The example here has three `setTimeout` functions. Each function takes an argument. Each of the arguments are functions themselves. They are called callbacks.Each of them prints a string on console. First timer function executes after one second, second after five seconds and third after two seconds. So, that means javascript executes first then executes third `console.log` because it is set to run after two seconds. And then third one after five seconds.

Javascript has something called __event loop__, to handle asynchronous code.When you call an asynchronous function in JavaScript, that is queued into the event loop, and will only be executed when its turn comes.This prevents blocking execution of other programs. So, to make every process isolated from each other, every tabs of browser, each node.js programs, API calls, Web Workers have their own  event loop.  
```js
setTimeout(function () {
  console.log("Hello");
}, 1000);
setTimeout(function () {
  console.log("Dear come later.");
}, 5000);
setTimeout(function () {
  console.log("World");
}, 2000);
```
The execution of code does not care about the order `setTimeout` functions are written in code. It follows the timer which controls the order the outputs are executed.  Event loop executes third `setTimeout` function by loading it in call stack after it executes and removes first function from call stack.

(![Callbacks](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z05k2f8ogoglsd5zx85r.png)
**Callback**
Most programs that use callback has to perform operations in an order, for example, if we access data from database using API and then so some operation on data and then display the result.
This code above prints results without any sequence because the timer is asynchronous. To display output in sequence, we can do use same code by nesting setTimeout functions into one.

> Note: The main point is second setTimeout depends on result of first function and result of third function depends on result of second `setTimeout` function.



```js
setTimeout(function () {
  console.log("Hello");

  setTimeout(function () {
    console.log("It comes sooner.");
    setTimeout(function () {
      console.log("World");
    }, 2000);
  }, 5000);
}, 1000);
```

![Callback in sequence](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9y0iewh8kzoomp8ggzfh.png)

In the following example we use callback `cb` as parameter of handleName function. We use callback to call string functions `makeUpperCasename` and `reverseName` as argument along with a string name. The handle name function takes the argument name and replace the parameter with it, and it takes a callback which is invoked inside the function. The result is uppercase fullname and reverse fullname.

```js
function makeUpperCasename(value) {
  console.log(value.toUpperCase());
}
// makeUpperCasename("Johathon");

handleName("Jimmy", makeUpperCasename);
handleName("Jimmy", reverseName);

function reverseName(value) {
  console.log(value.split("").reverse().join(""));
}

function handleName(name, cb) {
  const fullName = `${name} Carter `;
  cb(fullName);
  cb(fullName);
  cb(fullName);
  //  two gotchas, we donot invoke `cb` in function parameter
  //  and we can pass any functions as `cb` when we invoke it
  // and any number of time.
}
```
(![Callbacks Example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x1yn5ry0ubujrz3b4s4f.png))
Callbacks are very useful in most cases.The example we use here is simple one, in real world, in application programs code using callback are less manageable when we have so many callbacks. It is called callback hell. The simplest solution to this is promises. 

```js
const btn = document.getElementById("btn");

btn.addEventListener("click", function () {
  console.log("Hello World!");
});
// console.log(btn);
```

## Promise

We define promise using new constructor which takes a callback as a parameter. We have an arrow function as callback. 
The callback has two parameters `resolve` and `reject` which are methods of Promise API.We call these methods inside the curly braces in our logic.If we have a error in our logic we call `reject` and if the code is doing well we use `resolve`.

```js
const promise = new Promise((resolve, reject) => {
  // resolve("I am a resolve of promise");
  reject("I am a reject of promise");
});
console.log(promise);
```

We need to call promise after defining. We do that using handlers `.then` and `.catch`.Both `catch` and `then` takes callback functions as arguments. 

We need to handle errors, inside `catch` method using a parameter that we can name whatever we like, here, I use error parameter, then we print error. We print result if there is no error inside the `then` method.

```js
promise
  .catch((error) => {
    console.error(error);
  })

  .then((data) => {
    console.log(data);
  });
```

## Async await
Async await provides similar functionality like promises with a nicer syntax.
Any function can become async function by using `async` keyword prefix. We call promise using `await` afterwards. We have assigned `data` as constants to store result returned.

```js
const getProducts = () => {
  return new Promise((resolve, reject) => {
   // get products data 
    resolve("fulfillling promises");
  });
};

const doSomething = async () => {
  const data = await getProducts();
  console.log(data);
};

doSomething();
```

## Fetch API

Fetch provides networking in Browser. We have access to response and request objects of HTTP using fetch. `HTTP` is the API that connects our browsers to the web server. 
Just a fetch on a `url` returns a promise.We need to handle the promise returned.
 We need use `async` function and `await` to make sense of data returned. Other option is to handle promise with then and catch methods.
`const result = fetch(url)`
`console.log(result)`
Calling just fetch returns promise, so we use await before fetch and try catch block and enclose everything inside async function.we are using `IIFE` in this example.`IIFE` is immediately invoked function expression that invokes itself.

 The `fetch` call makes a request to the server and returns a `response` object in body of the message. Next step is to convert that `response` into human readable `data`.Finally we are using `.json` method on the `response` object returned by the fetch network call. Then we print the `data` as our result in the console.

```js
(async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```