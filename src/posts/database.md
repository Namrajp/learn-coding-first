---
layout: "@layouts/Layout.astro"
title: "Mongodb and Postgresql database connection"
date: 2025-10-13
tags:
  - Mongodb and Postgresql
  - news
  - tutorial
---

Connection to mongodb from nodejs is straightforward, when our app folder myapp and we import mongoose from project root folder.
Connect to the 'myapp' database running locally on the default port.
It's recommended to use '127.0.0.1' instead of 'localhost' in Node.js 18+

### Mongoose connection using host machine

using loopback network ip address on local machine

```
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
```

### Mongoose connection using dotenv npm package

Using dotenv npm package, we need to require donenv and call config method. Then we can use port 27017 on local machine with loopback network ip address on local machine

```
require("dotenv").config();
DATABASE_URL="mongodb://localhost:27017"  // .env file

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

## Connection to Postgres from nodejs

```
C:\Users\activ>psql -U postgres
Password for user postgres: secret
```

In order to Change password, alter user is command.

```
ALTER USER postgres PASSWORD 'your_new_password';
```
