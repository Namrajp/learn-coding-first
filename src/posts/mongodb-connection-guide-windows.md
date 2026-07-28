---
title: "MongoDB Connection Guide for Windows"
slug: "mongodb-connection-guide-windows"
date: 2026-07-18
description: "How to start MongoDB on Windows, connect with mongosh, and use Mongoose in Node.js applications."
category: "web-development"
tags: ["mongodb", "windows", "mongoose", "database"]
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

## Checking the MongoDB Service

If you installed MongoDB with the Windows installer and left the service option enabled, you do not need to start `mongod` by hand — it starts with Windows. To check, open `services.msc` and look for the MongoDB Server entry. Its status should read Running.

You can do the same from an Administrator Command Prompt:

```bash
net start MongoDB
```

If the service is already running you get a message saying so, which is harmless.

When nothing is listening on the port, every client fails the same way:

```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

That error means the server is down, not that your connection string is wrong. Start the service or run `mongod` manually before debugging anything else.

## Connecting with mongosh

Once the server is running, connect using the MongoDB shell:

```bash
mongosh mongodb://localhost:27017
```

This opens an interactive shell where you can run queries, create databases, and manage collections. `mongosh` is distributed separately from the server, so if Windows reports that the command is not recognised, install the MongoDB Shell package and confirm its folder is on your `PATH`.

A handful of commands cover most day-to-day use:

```bash
show dbs
use myapp
show collections
db.users.find()
db.users.find({ name: "Alice" })
```

`use myapp` switches to that database and creates it lazily — it will not show up in `show dbs` until you write the first document into it. `db.users.find()` returns the documents in the `users` collection.

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

## Local Instance or Atlas

Your application code does not change when you move to MongoDB Atlas — only the connection string does. A local instance uses `mongodb://127.0.0.1:27017/myapp`. Atlas gives you an SRV string shaped like `mongodb+srv://user:password@cluster.mongodb.net/myapp`, and you have to add your current IP address to the cluster's network access list before it will accept the connection. Keeping the URL in `.env` is what makes swapping between the two a one-line change.

---

_Next steps: once connected, explore **Mongoose schemas** to define your data models, and **MongoDB Atlas** for cloud-hosted databases._

_Tools mentioned: <a href="https://www.digitalocean.com/?ref=learncodingfirst" target="_blank" rel="noopener noreferrer">DigitalOcean</a> for cloud hosting and managed databases._
