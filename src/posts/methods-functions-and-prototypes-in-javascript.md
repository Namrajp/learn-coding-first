---
title: "Methods, Functions and Prototypes in JavaScript"
date: 2026-07-25
description: "Understand how methods, constructors, and prototypes work together to create objects in JavaScript."
tags: ["Javascript", "Programming"]
status: published
---

JavaScript builds objects from functions. Methods, constructors, and prototypes are three ways to attach behavior to objects — and they build on each other.

## Methods

A method is a property that holds a function value. That is it — nothing more:

```javascript
let rabbit = {};
rabbit.speak = function (line) {
  console.log(`The rabbit says '${line}'`);
};

rabbit.speak("I'm alive.");
// → The rabbit says 'I'm alive.'
```

The function is stored on the object. You call it through the object. That makes it a method.

## `this` Binds Methods to Their Object

When you call a method, `this` refers to the object it was called on. This lets the same function behave differently depending on which object uses it:

```javascript
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
}

let whiteRabbit = { type: "white", speak };
let hungryRabbit = { type: "hungry", speak };

whiteRabbit.speak("Oh my ears and whiskers, how late it's getting!");
// → The white rabbit says 'Oh my ears and whiskers, how late it's getting!'

hungryRabbit.speak("I could use a carrot right now.");
// → The hungry rabbit says 'I could use a carrot right now.'
```

Same function. Different `this`. Different output.

## Constructor Functions

Writing out `Object.create()` and assigning properties by hand gets tedious. A **constructor function** automates this — you call it with `new`, and JavaScript creates the object, binds `this`, and returns it for you:

```javascript
function Rabbit(type) {
  this.type = type;
}

let weirdRabbit = new Rabbit("weird");
console.log(weirdRabbit.type); // → "weird"
```

The `new` keyword does four things:

- Creates a new empty object
- Sets its prototype to `Rabbit.prototype`
- Calls `Rabbit` with `this` pointing to the new object
- Returns the object (unless the function explicitly returns something else)

## Prototypes

Every function in JavaScript has a `prototype` property. When you create an object with `new`, that object inherits from the function's prototype. You can add methods to the prototype and every instance gets them:

```javascript
function Rabbit(type) {
  this.type = type;
}

Rabbit.prototype.speak = function (line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};

let bigRabbit = new Rabbit("big");
bigRabbit.speak("I am large.");
// → The big rabbit says 'I am large.'
```

`speak` lives on `Rabbit.prototype`, not on each instance. All rabbits share it — saving memory and keeping behavior in one place.

## How They Connect

| Concept         | What it does                                      |
| --------------- | ------------------------------------------------- |
| **Method**      | A function stored on an object                    |
| **Constructor** | A function called with `new` to create objects    |
| **Prototype**   | An object that other objects inherit methods from |

Methods give objects behavior. Constructors create objects with shared setup. Prototypes let those objects share methods without duplicating them.

> **Rule:** if you find yourself copying the same function onto multiple objects, put it on the prototype instead.

---

_Next steps: once you understand prototypes, explore **classes** — the modern syntax that wraps constructors and prototypes into cleaner code — and **arrow functions** — which handle `this` differently._
