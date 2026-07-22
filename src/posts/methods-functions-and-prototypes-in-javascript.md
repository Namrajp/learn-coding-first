---
title: "Methods, Functions and Prototypes in JavaScript"
date: 2026-07-22
description: "Construction functions are way to encapsulate data"
tags: ["JavaScript"]
status: draft
---

Encapsulation in JavaScript 

## Methods
Methods are nothing more than properties that hold function values. This is a simple method:
edit & run code by clicking it.

Example:
‘’’
let rabbit = {};
rabbit.speak = function(line) {
  console.log(`The rabbit says '${line}'`);
};

rabbit.speak("I'm alive.");
// → The rabbit says 'I'm alive.'
‘’’
Binding called this associate method to its object

‘’’
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
}

let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my ears and whiskers, " +
                  "how late it's getting!");
‘’’
// → The white rabbit says 'Oh my ears and whiskers, how
//   late it's getting!'
hungryRabbit.speak("I could use a carrot right now.");
// → The hungry rabbit says 'I could use a carrot right now.'

## Construction 
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}

JavaScript provides a way to make defining this type of function easier. If you put the keyword new in front of a function call, the function is treated as a constructor. This means that an object with the right prototype is automatically created, bound to this in the function, and returned at the end of the function.

## Prototypes 
function Rabbit(type) {
  this.type = type;
}
Rabbit.prototype.speak = function(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};

let weirdRabbit = new Rabbit("weird");

## Typescript 
Reason is to add static typing to JavaScript. . Static typing means that the type of a variable cannot be changed at any point in a program. 
Superset of JS. 
JavaScript is dynamically typed.means variables can change type.

// JavaScript
let foo = "hello";
foo = 55; // foo has changed type from a string to a number - no problem

// TypeScript
let foo = "hello";
foo = 55; // ERROR - foo cannot change from string to number