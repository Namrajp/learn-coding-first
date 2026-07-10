---
layout: "@layouts/Layout.astro"
title: "Dependency Injection in ASP.Net"
date: 2025-02-10
tags:
  - news
  - tutorial
  - ASP.NET
---

# What is DI or Dependecy Injection?

Dependency injection is a software design pattern where an object is given its dependencies(other objects it needs) from an external source, rather than creating itself.

## There are three methods for injecting dependencies

- Constructor injection: Dependencies are provided through the class's constructor.

- Setter injection: Dependencies are passed onto the class through public setter methods.
- Interface injection: A less common method in which depency is injected into the client through an interface that the client implements.
