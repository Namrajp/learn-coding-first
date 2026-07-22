---
title: "Nitty Gritty in Javascript Explored"
date: 2026-07-22
description: "Some inner process and programs in javascript"
tags: ["Javascript"]
status: draft
---

Javascript gist
 
	Object is datatype.or primitives.const,var,let,
	Conversion: typeof,Number,String,parseInt,Bool,
	Javascript is loosely type,Prototype inheritance based language.

 1.	What is a difference between Object Prototype and Object Constructor?
 2.	What is a difference between Array Prototype and Array Constructor?
 3.	HOw are String primitives and String Object sharing the String methods?
 4.	String methods: [],indexOf,lastIndexOf,charAt,slice(1 or 2),toUpperCase,replace(/gi,b),trim
	string.split("  "),string.length.
 5.	Object methods: {},new,Object.create()/.keys()/.values()/.entries/.assign/.freeze/.seal
	.getPrototypeOf()/ __proto__; 
 **	Loops: for(),for(let i in Obj/Arr),forEach(callback),for(..of. ) *************	
 6.	Array methods: push,pop,unshift,shift,sort,reverse,join,
 7.	Function methods: bind,apply,call
 8.	Prototypes:[[prototype]],__proto__,Object.prototype,Array.prototype,Date.proto,
	String.proto
 9.	Constructor: blueprint.newObj,function,call,new.prototype.method.
 10.	Classes: blueprint.newObj,function,Super,ES2015 or Arrow func.
 11.	this: in general/function-> window,in methods->object,in constructor-> new obj,
	in function.bind(this,argument1,argument2) (),fn.call(this,arg1,arg2) or apply(this,[a1,b])

 ##	Unlike Array methods like pop(),push() which are called on the prototype of Array, Object 
	methods are called directly on the Object constructor.
 ##	String Objects have methods that can be inherited by the string objects,just like objects 		we create either using the obj literals {} or using Object constructor using new Object.
	So, string primitives are internally converted to String Object to access methods 		of String Object. After the methods do their tasks, String is converted to string 		primitives.