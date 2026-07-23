---
title: "Nitty Gritty in Javascript Explored"
date: 2026-07-22
description: "Understand how JavaScript values, prototypes, constructors, and methods connect — and why the distinctions matter in everyday code."
tags: ["JavaScript", "Programming"]
status: draft
---

You call `toUpperCase()` on a string and get a new string back. You call `push()` on an array and the original array changes. Same language, same dot syntax, completely different behavior. The confusion stops making sense once you understand that JavaScript treats primitives and objects as two separate systems, each with its own rules for storage, mutation, and method access.

## Primitives and Objects Are Two Separate Systems

JavaScript has two categories of values: **primitives** and **objects**. Primitives are numbers, strings, booleans, `null`, `undefined`, `BigInt`, and symbols. Objects are everything else — arrays, functions, plain objects, dates, and regular expressions.

The critical difference is mutability. Primitives are **immutable**. When you call `toUpperCase()` on a string, you get a new string back — the original never changes. Objects are **mutable**. When you push an item into an array, the same array gains that item.

```js
// Primitives — immutable
let name = "alice";
let upper = name.toUpperCase();
console.log(name);   // "alice" — unchanged
console.log(upper);  // "ALICE" — new value

// Objects — mutable
let colors = ["red", "green"];
colors.push("blue");
console.log(colors); // ["red", "green", "blue"] — same array modified
```

You declare variables with `var`, `let`, or `const`. These keywords control scope and reassignment — they do not determine whether a value is a primitive or an object.

## typeof Reveals What You Are Working With

JavaScript is loosely typed. You do not declare a variable's type upfront, so the `typeof` operator lets you check at runtime:

```js
typeof 42;          // "number"
typeof "hello";     // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object" — a known bug in JavaScript
typeof {};          // "object"
typeof [];          // "object" — arrays are objects too
typeof function(){} // "function"
```

Two surprises here. `typeof null` returns `"object"` because of a legacy bug in the language — not because null is actually an object. `typeof []` returns `"object"` because arrays are objects. Use `Array.isArray()` when you need to distinguish arrays from plain objects.

## String Methods Work Through Temporary Object Wrapping

A string primitive like `"hello"` has no methods of its own. When you call `.toUpperCase()` or `.slice(1)`, JavaScript wraps the primitive in a **String object**, runs the method, and discards the object afterward. This is why string methods always return new values — they operate on the temporary wrapper, not the original primitive.

```js
let msg = "  Hello, World!  ";

msg.indexOf("World");    // 9
msg.lastIndexOf("l");    // 10
msg.charAt(1);           // " "
msg.slice(1, 5);         // "Hell"
msg.toUpperCase();       // "  HELLO, WORLD!  "
msg.replace(/o/gi, "0"); // "  Hell0, W0rld!  "
msg.trim();              // "Hello, World!"
msg.split(", ");         // ["  Hello", "World!  "]
msg.length;              // 16
```

Every one of these returns a new string. The original `msg` never changes. This behavior is the same whether you use a string literal or create a String object with `new String("hello")`.

## Object Methods Work on Instances and Constructors

Object methods operate differently from string methods. You call them directly on an object instance or on the `Object` constructor:

```js
let person = { name: "Alice", age: 30 };

Object.keys(person);     // ["name", "age"]
Object.values(person);   // ["Alice", 30]
Object.entries(person);  // [["name", "Alice"], ["age", 30]]

let frozen = Object.freeze({ x: 1 });
frozen.x = 2;            // silently fails — object is frozen

let sealed = Object.seal({ y: 1 });
sealed.y = 2;            // works — modifying existing property
sealed.z = 3;            // silently fails — cannot add new properties
```

`Object.create()` builds an object with a specific prototype. `Object.getPrototypeOf()` retrieves it. Together, these two methods form the foundation of how inheritance works in JavaScript.

## Array Methods Inherit Through Array.prototype

Arrays are objects, and they inherit from `Array.prototype`. Methods like `push()`, `pop()`, `shift()`, `unshift()`, `sort()`, `reverse()`, and `join()` all live on that prototype:

```js
let stack = [1, 2, 3];
stack.push(4);       // [1, 2, 3, 4]
stack.pop();         // removes 4, returns it

let queue = [1, 2, 3];
queue.unshift(0);    // [0, 1, 2, 3]
queue.shift();       // removes 0, returns it

let sorted = [3, 1, 2];
sorted.sort();       // [1, 2, 3] — sorts in place
sorted.reverse();    // [3, 2, 1] — reverses in place
sorted.join(", ");   // "3, 2, 1"
```

Some array methods mutate the original (`push`, `pop`, `sort`, `reverse`), while others return new arrays (`map`, `filter`, `slice`). Knowing which is which prevents accidental side effects.

## bind, call, and apply Control What this Refers To

Every function inherits from `Function.prototype`, which gives it `bind()`, `call()`, and `apply()`. These methods let you explicitly set what `this` refers to inside a function:

```js
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

let user = { name: "Alice" };

// call — invokes immediately, passes arguments individually
greet.call(user, "Hello");       // "Hello, Alice"

// apply — invokes immediately, passes arguments as an array
greet.apply(user, ["Hi"]);       // "Hi, Alice"

// bind — returns a new function with `this` permanently set
let bound = greet.bind(user, "Hey");
bound();                         // "Hey, Alice"
```

The difference between `call` and `apply` is only how arguments are passed. `call` takes individual arguments, `apply` takes an array. The difference between both and `bind` is that `bind` does not invoke the function — it returns a new one you can call later.

## Prototypes Form the Inheritance Chain

Every JavaScript object has an internal link to another object called its **prototype**. When you access a property that does not exist on an object, JavaScript walks up the prototype chain until it finds the property — or returns `undefined`.

```js
let animal = { speak() { return "..."; } };
let dog = Object.create(animal);

console.log(dog.speak());  // "..." — found on the prototype
console.log(dog.hasOwnProperty("speak")); // false — not on dog itself
```

`Object.prototype` sits at the top of the chain for most objects. `Array.prototype` does the same for arrays. You can inspect the chain with `Object.getPrototypeOf()`:

```js
let arr = [];
Object.getPrototypeOf(arr) === Array.prototype; // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
```

The chain goes: your array → `Array.prototype` → `Object.prototype` → `null`. This is how methods defined on `Array.prototype` become available on every array you create.

## Constructors Are Blueprints That Use Prototypes

A **constructor function** creates multiple objects with the same structure and behavior. The `new` keyword handles three things: it creates a new object, links its prototype to the constructor's prototype, and binds `this` to the new object:

```js
function Car(make, model) {
  this.make = make;
  this.model = model;
}

Car.prototype.drive = function() {
  return `${this.make} ${this.model} is moving`;
};

let tesla = new Car("Tesla", "Model 3");
console.log(tesla.drive()); // "Tesla Model 3 is moving"
```

ES2015 classes are syntactic sugar over the same prototype system:

```js
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  drive() {
    return `${this.make} ${this.model} is moving`;
  }
}
```

Both approaches produce identical prototypes. Classes make the syntax cleaner, but the underlying mechanism has not changed. Understanding prototypes means understanding both styles.

## this Changes Meaning Depending on How a Function Is Called

The `this` keyword refers to different objects depending on context:

- **Global scope**: `this` points to `window` in browsers or `global` in Node.js
- **Object method**: `this` points to the object that owns the method
- **Constructor**: `this` points to the newly created instance
- **Arrow function**: `this` inherits from the enclosing scope — it never changes

```js
// Global
console.log(this); // window (browser)

// Method
let user = {
  name: "Alice",
  greet() { console.log(`Hi, ${this.name}`); }
};
user.greet(); // "Hi, Alice"

// Constructor
function Person(name) { this.name = name; }
let bob = new Person("Bob");

// Arrow — inherits `this`
let delayed = { name: "Alice", greet: () => console.log(this.name) };
delayed.greet(); // undefined — arrow does not bind its own `this`
```

Arrow functions do not have their own `this`. Use them for callbacks where you want to preserve the outer scope. Avoid them for object methods that need to reference the object itself.

## Experiment in the Console to Lock In the Mental Model

Open your browser console and call `typeof` on every value you encounter for a day. Call `Object.getPrototypeOf()` on objects, arrays, and functions. Try `bind()`, `call()`, and `apply()` with different values of `this`. The distinction between primitives and objects explains most of JavaScript's surprising behavior — but only if you internalize it through practice, not just reading.
