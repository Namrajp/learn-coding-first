---
title: "Create a controller-based web API with ASP.NET Core"
slug: "controller-based-api-asp-net"
date: 2026-07-24
description: "Build a controller-based web API with ASP.NET Core: project setup, NuGet packages, models, database context, and Entity Framework integration."
category: "web-development"
tags: ["asp.net", "csharp", "api", "entity framework"]
status: published
---

# Following is the high level overview of step involved:

- Steps:

## Create a Web API project

You need the .NET SDK installed. Check it with `dotnet --version`. Scaffold the project with the `webapi` template:

```bash
dotnet new webapi --use-controllers -o TodoApi
cd TodoApi
```

The `--use-controllers` switch matters. Recent SDKs scaffold a minimal API project by default, and without the switch you get a single `Program.cs` with no controllers folder at all.

The generated `Program.cs` uses top-level statements. Two lines do the controller wiring:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();
```

`AddControllers()` registers the services that discover and activate controller classes. `MapControllers()` registers their routes. Drop the second one and every endpoint returns 404 even though the project compiles and the app starts cleanly.

## Add a NuGet package

A NuGet package must be added to support the database used in this tutorial.

This tutorial uses an in-memory database so there is nothing to install or configure:

```bash
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

The in-memory provider is good for learning and for tests. It is not a real database: the data disappears when the process stops, and it does not enforce relational constraints. Swap the provider for SQLite or SQL Server later and most of the code above the provider stays the same.

## Add a model class

A model is a set of classes that represent the data that the app manages. The model for this app is the TodoItem class.

```csharp
namespace TodoApi.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }
}
```

Entity Framework treats a property named `Id` as the primary key by convention, so no attribute is needed. The properties are plain get/set, which is what both EF Core and the JSON serializer expect.

## Add a database context

The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the Microsoft.EntityFrameworkCore.DbContext class.

```csharp
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;
}
```

Each `DbSet<T>` maps to a table. Taking `DbContextOptions<TodoContext>` in the constructor means the provider and connection settings come from the container instead of being hardcoded in the class.

Register the context in `Program.cs`, before `builder.Build()`:

```csharp
builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseInMemoryDatabase("TodoList"));
```

`AddDbContext` registers the context with a scoped lifetime, so each HTTP request gets its own instance.

Then add the controller. It derives from `ControllerBase` and receives the context through its constructor:

```csharp
[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly TodoContext _context;

    public TodoItemsController(TodoContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems() =>
        await _context.TodoItems.ToListAsync();
}
```

`[ApiController]` turns on automatic model validation and infers where each parameter is bound from. `[Route("api/[controller]")]` substitutes the class name minus its `Controller` suffix, so this class serves `/api/todoitems`.

[Create a controller-based web API with ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0&source=recommendations&tabs=visual-studio)
