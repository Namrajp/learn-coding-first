---
title: "Create a minimal API with ASP.NET Core"
slug: "create-minimal-api-asp-net-core"
date: 2026-07-25
description: "Learn how to build minimal APIs with ASP.NET Core for microservices and lightweight applications. Step-by-step tutorial with code examples."
category: "web-development"
tags: ["asp.net", "csharp", "api"]
status: published
---

Minimal APIs are architected to create HTTP APIs with minimal dependencies. They're ideal for microservices and apps that want to include only the minimum files, features, and dependencies in ASP.NET Core.

This tutorial teaches the basics of building a minimal API with ASP.NET Core. Another approach to creating APIs in ASP.NET Core is to use controllers.

## Before you start

You need the .NET SDK installed. Check it with `dotnet --version`. Minimal APIs have been part of ASP.NET Core since .NET 6, so any reasonably recent SDK will work.

Create the project from the empty web template:

```bash
dotnet new web -o TodoApi
cd TodoApi
dotnet run
```

The `web` template is the smallest ASP.NET Core template there is. You get a single `Program.cs`, no controllers, no views, and no extra folders.

## The shape of Program.cs

Everything lives in one file using top-level statements. There is no `Main` method and no `Startup` class.

```csharp
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```

`CreateBuilder` sets up configuration, logging, and the service container. Anything you register on the builder has to be registered before `Build()` is called. Everything after that line is middleware and routing. `app.Run()` starts the server and blocks until the app shuts down.

## Mapping endpoints

Each HTTP verb has its own method: `MapGet`, `MapPost`, `MapPut`, `MapDelete`. The handler is just a lambda.

```csharp
var todos = new List<Todo>();

app.MapGet("/todos", () => todos);

app.MapGet("/todos/{id}", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    return todo is null ? Results.NotFound() : Results.Ok(todo);
});

app.MapPost("/todos", (Todo todo) =>
{
    todos.Add(todo);
    return Results.Created($"/todos/{todo.Id}", todo);
});

record Todo(int Id, string Title, bool IsComplete);
```

Parameters are bound by name. The `{id}` segment in the route template matches the `int id` parameter, and the framework parses the string for you. A parameter of a complex type, like `Todo`, is read from the JSON request body instead. Return a plain object and it is serialized to JSON with a 200. Return a `Results` value when you need to control the status code.

`Results.Ok`, `Results.NotFound`, `Results.Created`, and `Results.BadRequest` cover most of what you need. One thing to watch: the two branches of a conditional have to agree on a type, so returning `Results.NotFound()` from one branch and the bare `todo` from the other will not compile. Wrap the success case in `Results.Ok` as above.

Also note where the `record` sits. In a file with top-level statements, type declarations have to come after all the executable statements. Move it above `var builder` and you get `CS8803: Top-level statements must precede namespace and type declarations.`

## When to pick minimal APIs over controllers

Reach for minimal APIs when the service is small and the routing is the interesting part: a handful of endpoints, a health check, a webhook receiver, an internal microservice. Reach for controllers when you want handlers grouped into classes, shared filters and conventions, or validation attributes spread across many actions. Both sit on the same routing and middleware stack, so this is a code organization decision rather than a performance one.

Similar to this task is another related task, but a little more code is required that is, [Create a web API with ASP.NET Core and MongoDB](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-10.0&tabs=visual-studio)

Awesome!
