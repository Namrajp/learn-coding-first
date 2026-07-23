---
title: "Nitty Gritty in Javascript Explored"
date: 2026-07-22
description: "Some inner process and programs in javascript"
tags: ["Javascript"]
status: draft
---

## Javascript gist
Two Prominent values are Primitives and Objects. Values are the ones on right side of the equation when a declaration is done. On left side is Variables. Variables begin with key words like var, let, const. These are primitives.
Variables can also be objects, arrays, structures. The values in an object is accessed using a dot after the object name.
Then, types comes with a role what sort of value it is. Like Number, String, parseInt ,Bool and so on whose types can be tested with typeof function followed by variable in parentheses.
JavaScript is loosely type, Prototype inheritance based language.

Some questions arises naturally when programming in javascript. Like:
 1.	What is a difference between Object Prototype and Object Constructor?
 2.	What is a difference between Array Prototype and Array Constructor?
 3.	How are String primitives and String Object sharing the String methods?
We have methods to deal with a lot of problems and solves them like:
 1.String methods: [],indexOf, lastIndexOf, charAt, slice(1 or 2),toUpperCase,replace(/gi,b),trim
	string.split("  "),string.length.
 2.	Object methods: {},new,Object.create()/.keys()/.values()/.entries/.assign/.freeze/.seal
	.getPrototypeOf()/ __proto__; 
 **	Loops: for(),for(let i in Obj/Arr),forEach(callback),for(..of. ) *************	
 ##	Array methods:
 push,pop,unshift,shift,sort,reverse,join,
 ##	Function methods: 
bind,apply,call
 ##	Prototypes:
[[prototype]],__proto__,Object.prototype,Array.prototype,Date.proto,
	String.proto
 ##	Constructor: blueprint.newObj,function,call,new.prototype.method.
 10.	Classes: blueprint.newObj,function,Super,ES2015 or Arrow func.
 11.	this: in general/function-> window,in methods->object,in constructor-> new obj,
in function.bind(this,argument1,argument2) (),fn.call(this,arg1,arg2) or apply(this,[a1,b])

 ##	Array methods
 like pop(),push() which are called on the prototype of Array, Object 

methods are called directly on the Object constructor. String Objects have methods that can be inherited by the string objects,just like objects 		we create either using the obj literals {} or using Object constructor using new Object.
	So, string primitives are internally converted to String Object to access methods 		of String Object. After the methods do their tasks, String is converted to string 		primitives.