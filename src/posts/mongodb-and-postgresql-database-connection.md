---
title: "Mongodb and Postgresql database connection"
slug: "mongodb-and-postgresql-database-connection"
date: 2026-07-28
description: "Connect MongoDB and PostgreSQL from Node.js: mongoose setup, dotenv configuration, and PostgreSQL password management."
category: "web-development"
tags: ["mongodb", "postgresql", "node.js", "database"]
status: published
---

Connection to mongodb from nodejs is straightforward, when our app folder myapp and we import mongoose from project root folder.
Connect to the 'myapp' database running locally on the default port.
It's recommended to use '127.0.0.1' instead of 'localhost' in Node.js 18+

Both databases have to be installed and running before Node.js can reach them. MongoDB listens on port 27017 by default, PostgreSQL on 5432. You also need the driver packages in your project:

```bash
npm install mongoose pg dotenv
```

### Mongoose connection using host machine

using loopback network ip address on local machine

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
```

### Mongoose connection with async/await

The `.then()` / `.catch()` form works, but most apps wrap the connection in an async function so startup can be sequenced and failures handled in one place:

```js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myapp");
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Could not connect to MongoDB:", err);
    process.exit(1);
  }
}

connectDB();
```

Exiting on failure is deliberate. An app that cannot reach its database is better off stopping loudly than starting up and serving broken requests.

### Mongoose connection using dotenv npm package

Using dotenv npm package, we need to require donenv and call config method. Then we can use port 27017 on local machine with loopback network ip address on local machine

```js
require("dotenv").config();
DATABASE_URL="mongodb://localhost:27017"  // .env file

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

Keep the `.env` file out of version control. Add it to `.gitignore` before your first commit — a connection string carrying a username and password should never end up in a repository. Commit a `.env.example` with the keys and empty values instead, so the next person knows what to fill in.

## Connection to Postgres from nodejs

```
C:\Users\activ>psql -U postgres
Password for user postgres: secret
```

In order to Change password, alter user is command.

```sql
ALTER USER postgres PASSWORD 'your_new_password';
```

### Querying Postgres with the pg package

`psql` is the command line client. From Node.js you use the `pg` package. A `Pool` keeps a set of reusable connections instead of opening a fresh one for every query:

```js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function getUsers() {
  const result = await pool.query("SELECT id, email FROM users");
  return result.rows;
}
```

The connection string follows the pattern `postgresql://user:password@127.0.0.1:5432/mydb`. Results come back on `result.rows` as an array of plain objects.

Pass values as parameters instead of building the SQL string yourself:

```js
const result = await pool.query("SELECT * FROM users WHERE email = $1", [
  email,
]);
```

The driver escapes whatever `$1` receives, which is what protects you from SQL injection.

## Errors you will probably hit

`connect ECONNREFUSED 127.0.0.1:27017` means nothing is listening on the MongoDB port. The server is not running, or it is running somewhere else. Start `mongod` and try again.

`password authentication failed for user "postgres"` means Postgres is reachable but rejected your credentials. Check the password in your connection string, or reset it with the `ALTER USER` command above.

Both errors surface at connection time, not at query time, which is why it is worth logging them explicitly rather than letting a promise rejection disappear.
