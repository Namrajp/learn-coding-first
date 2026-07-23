---
title: "Accessing a Mongo Database in a Node.js App"
date: 2026-07-23
description: "Learn how to connect to MongoDB from a Node.js application using both the native driver and Mongoose ODM."
tags: ["MongoDB", "Node.js"]
status: published
---

MongoDB is a NoSQL, non-relational database. Instead of storing data in tables with rows and columns, it stores data as JSON-like documents inside collections. This makes it a natural fit for JavaScript applications where data already looks like objects.

## Installing MongoDB on macOS

The quickest way to get MongoDB running locally is with Homebrew:

```bash
brew install mongodb-community
brew services start mongodb
```

After installation, the database files live in `/usr/local/var/mongodb` and the config file is in `/usr/local/etc/`. By default, MongoDB listens on `127.0.0.1:27017`.

## Core Database Commands

Open the Mongo shell by running `mongo` in your terminal. From there you can explore your data:

```js
db                          // shows the current database
use myDatabase              // switch to (or create) a database
show databases              // list all databases
show collections            // list collections in the current database
```

A collection is the MongoDB equivalent of a table in a relational database.

## CRUD Operations

### Creating Data

Insert a single document with `insertOne`, or multiple documents with `insertMany`:

```js
db.cars.insertOne({ make: "Toyota", model: "Camry", year: 2024 })

db.cars.insertMany([
  { make: "Honda", model: "Civic", year: 2023 },
  { make: "Ford", model: "Mustang", year: 2024 }
])
```

### Reading Data

Use `find` to retrieve documents and `findOne` to get a single match:

```js
db.cars.find()                          // all documents
db.cars.find({ make: "Toyota" })        // filtered
db.cars.findOne({ make: "Toyota" })     // single document
```

### Updating Data

`updateOne` modifies the first matching document. `updateMany` modifies all matches:

```js
db.cars.updateOne(
  { make: "Toyota" },
  { $set: { year: 2025 } }
)
```

### Deleting Data

```js
db.cars.deleteOne({ make: "Ford" })     // remove one
db.cars.deleteMany({})                   // remove all documents
```

## Connecting from Node.js with the Native Driver

Install the MongoDB driver:

```bash
npm init -y
npm install mongodb
```

Then connect and perform operations:

```js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db("kennel");
    const collection = db.collection("dogs");

    await collection.insertOne({ name: "Roger" });
    await collection.insertMany([{ name: "Togo" }, { name: "Syd" }]);

    const items = await collection.find().toArray();
    console.log(items);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
```

The pattern is always the same: connect to the client, select a database with `client.db()`, get a collection with `db.collection()`, then call a method on it.

## Using Mongoose for Schema-Based Access

Mongoose adds schemas and validation on top of the native driver. It is the most popular MongoDB library for Node.js.

```bash
npm install mongoose dotenv
```

Create a `.env` file with your connection string, and load it with `dotenv`:

```js
require("dotenv").config();
const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
});

const Person = mongoose.model("Person", personSchema);

// Save a single document
const person = new Person({ name: "Alice", age: 30 });
person.save((err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Or use the class method
Person.create({ name: "Bob", age: 25 }, (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

Common Mongoose methods include `find`, `findOne`, `findById`, `findOneAndUpdate`, and `findByIdAndRemove`. Each takes a filter object and a callback.

## A Simple REST API with Express

Combine MongoDB with Express to build a basic REST API:

```js
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  // return all items from the database
});

app.get("/:id", (req, res) => {
  // find one item by req.params.id
});

app.post("/", (req, res) => {
  // insert data into the database
});

app.listen(3000);
```

This gives you HTTP endpoints that read from and write to your MongoDB database. Use `req.params` for URL parameters and `req.body` for incoming JSON data.

## Wrapping Up

Whether you use the native MongoDB driver or Mongoose, the workflow is the same: connect, select a database and collection, then perform CRUD operations. The native driver gives you full control, while Mongoose adds structure and convenience methods that scale well as your application grows.
