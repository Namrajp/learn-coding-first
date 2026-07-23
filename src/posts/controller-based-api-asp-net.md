---
layout: "@layouts/Layout.astro"
title: "Create a controller-based web API with ASP.NET Core"
date: 2026-07-24
status: draft
tags:
  - miscellaneous
  - essay
  - ASP.NET
description: "Build a controller-based web API with ASP.NET Core: project setup, NuGet packages, models, database context, and Entity Framework integration."
---

# Following is the high level overview of step involved:

- Steps:

## Create a Web API project

## Add a NuGet package

A NuGet package must be added to support the database used in this tutorial.

## Add a model class

A model is a set of classes that represent the data that the app manages. The model for this app is the TodoItem class.

## Add a database context

The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the Microsoft.EntityFrameworkCore.DbContext class.

[Create a controller-based web API with ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0&source=recommendations&tabs=visual-studio)
