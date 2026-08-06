---
title: "Redux in simple terms"
slug: "redux-in-simple-terms"
date: 2026-08-05
description: "State management framework"
category: "miscellaneous"
tags: []
status: published
---

# Introducing the Basics

The store of the redux holds an interesting value. A value is something that represents an abstract concept in the world. A number of fruits, is a number value just like a sentence “I live in Brisbane” is a text, which is a string value, an object is also a value. It has a name and a value within a container. 

In an application or user interface we have components that trigger an event, we click a submit button, type username or password, or click links or press key or move mouse. Such events change state of data within an application. State means value stored and passed between components in a react app to render the DOM.

We use objects to store the state, actions and a redux store is a single object as well. So creating a store and dispatch an action on the store are first two tasks to start understanding a redux workflow.


## How actions change the state

Creating the store as described above needs pass a special function called Reducer. I will talk about it little later, first let’s find out how an action change states within an app and finally change the view of UI we interact with. The two arguments of a Reducer function are state and actions. The switch off two different branches produces a copy of the state or altered state.

Mutable property means an object changes its shape or size or quality or quantity. The return value of reducer are required to be immutable, means original state passed cannot be changed but the branches of a reducer must return an altered value depending on type of action parameter passed to it.