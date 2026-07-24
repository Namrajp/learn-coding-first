---
title: "MongoDB Connection Guide for Windows"
date: 2026-07-18
description: "How to start MongoDB on Windows, connect with mongosh, and use Mongoose in Node.js applications."
tags:
  - tutorial
  - tools
  - mongodb and postgresql
status: published
---

A quick reference for getting MongoDB running on Windows and connecting to it from your applications.

## Starting MongoDB on Windows

To start the MongoDB server on Windows, open Command Prompt and run:

```bash
mongod.exe --dbpath "C:\data\db"
```

Make sure the `C:\data\db` directory exists before running this command. MongoDB stores its data there.

If you are using Git Bash or WSL, start with `cmd.exe` first:

```bash
cmd.exe
mongod.exe --dbpath "C:\data\db"
```

## Connecting with mongosh

Once the server is running, connect using the MongoDB shell:

```bash
mongosh mongodb://localhost:27017
```

This opens an interactive shell where you can run queries, create databases, and manage collections.

## Connecting from Node.js with Mongoose

Mongoose is the most popular MongoDB ODM for Node.js. Here is a basic connection:

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));
```

Use `127.0.0.1` instead of `localhost` — this avoids DNS resolution issues in Node.js 18+.

## Using Environment Variables

For production apps, store your database URL in a `.env` file:

```
DATABASE_URL="mongodb://localhost:27017"
```

Then load it in your code:

```javascript
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
```

> **Rule:** never hardcode connection strings in source code. Use `.env` files and add `.env` to `.gitignore`.

---

_Next steps: once connected, explore **Mongoose schemas** to define your data models, and **MongoDB Atlas** for cloud-hosted databases._
