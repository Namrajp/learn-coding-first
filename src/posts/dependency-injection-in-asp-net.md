---
title: "Dependency Injection in ASP.Net"
slug: "dependency-injection-in-asp-net"
date: 2026-05-01
description: "Understand dependency injection in ASP.NET Core: constructor, setter, and interface injection patterns explained with practical examples."
category: "web-development"
tags: ["asp.net", "csharp", "design patterns"]
status: published
---

# What is DI or Dependecy Injection?

Dependency injection is a software design pattern where an object is given its dependencies(other objects it needs) from an external source, rather than creating itself.

## There are three methods for injecting dependencies

- Constructor injection: Dependencies are provided through the class's constructor.
- Setter injection: Dependencies are passed onto the class through public setter methods.
- Interface injection: A less common method in which dependency is injected into the client through an interface that the client implements.

ASP.NET Core's built-in container supports constructor injection. Setter and interface injection are patterns you will meet in other frameworks or in hand-rolled code, but the framework will not populate a property or call an injection interface for you.

## What it looks like in code

Start with an interface and an implementation:

```csharp
public interface IGreetingService
{
    string Greet(string name);
}

public class GreetingService : IGreetingService
{
    public string Greet(string name) => $"Hello, {name}!";
}
```

The consumer asks for the interface in its constructor and stores it in a readonly field. It never calls `new GreetingService()`.

```csharp
public class HomeController : Controller
{
    private readonly IGreetingService _greetings;

    public HomeController(IGreetingService greetings)
    {
        _greetings = greetings;
    }

    public IActionResult Index() => Content(_greetings.Greet("world"));
}
```

Because the controller depends on the interface and not the concrete class, you can hand it a fake implementation in a unit test without touching the real one.

## Registering the service

The container has to be told which concrete type to supply. Register it in `Program.cs`, before `builder.Build()` is called:

```csharp
builder.Services.AddScoped<IGreetingService, GreetingService>();
```

Skip that line and the request fails when the class is constructed, with `Unable to resolve service for type 'IGreetingService' while attempting to activate 'HomeController'.` The message names both the missing service and the class that asked for it, which usually points straight at the registration you forgot.

## Service lifetimes

`AddScoped` is one of three registration methods, and the choice controls how long an instance lives.

- `AddSingleton`: one instance for the lifetime of the application. Every request shares it, so the implementation has to be thread safe.
- `AddScoped`: one instance per HTTP request. Everything resolved during that request gets the same object, and it is disposed when the request ends. This is the usual choice for anything holding per-request state, such as an Entity Framework `DbContext`.
- `AddTransient`: a new instance every time the service is resolved, even twice within the same request. Best for small, stateless services.

## The captive dependency gotcha

Lifetimes have to line up. A singleton is built once and holds on to whatever it was given, so injecting a scoped service into a singleton captures that instance and keeps it alive long after its request ended. In Development the host validates the container at startup and throws instead:

```
Cannot consume scoped service 'IGreetingService' from singleton 'IReportCache'.
```

The rule is that a service can only depend on services whose lifetime is at least as long as its own. A singleton can consume singletons. A scoped service can consume scoped and singleton services. A transient service can consume anything. When a singleton genuinely needs scoped work done, inject `IServiceScopeFactory`, create a scope for the duration of that work, and resolve the scoped service from it.
