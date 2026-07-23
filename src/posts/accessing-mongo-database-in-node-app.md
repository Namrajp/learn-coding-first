---
title: "Accessing Mongo database in Node app"
date: 2026-07-23
tags: ["MongoDB"]
status: published
---

MongoDB is no-sql non-relational database. Means data is stored as documents similar to objects in javascript.

## Installation of MongoDB in Mac

- `$ brew install mongodb-community`
- `$ brew services start mongoDb`
- local install in /usr/local/var/mongodb, /usr/local/etc/ for config. ip=127.0.0.1

## Commands to see database and collections

- start shell $ mongo, db shows test database, use dbname,
- db, use, show databases, show collections.
- collections is same like tables.

## Operations on local database

- create data`db.createCollection('cars')` or other way `db.dogs.insert({ name: "Roger" })`
- `db.dogs.find()`
- filter and retrieve entry `$ db.dogs.find({name: 'Roger'}):`
- ` findOne()`,
- update data`db.dogs.remove({})` removes all entries.
- `db.dogs.update({key: 'old obj'}, {key: 'new obj'})`
- remove data`db.dogs.remove({name: 'sakira'})`

## Remote mongo database setup using Atlas

Atlas is remote database as a service.managed, hosted.

- Create account, create db user, use ip, 0.0.0.0/0 connect from everywhere , get db connected, authId.
- Create Model, first schema, is shape of document.
- .env for url, to use invironment var we need .env file with variable='string', we install dotenv, require ('dotenv').config()
- npm install mongodb, mongoose, dotenv, express. require them in .json.package.also, nodemon,
- `mongoose.connect(url, {topology})`
- `const personSchema = new mongoose.Schema({}`
- `Person = mongoose.model('Person',personSchema);`

### we created schema personSchema and we created model Person

- We can instantiate Model Person
  then call save() with callback err,data parameters inside handler function, we call callback done(null, data). we call done, it inside again. That's it.

- we use Model.create() for many, use instance,Model.save() for single person. awe, difference.

- Model.Method takes first parameter obj, second calback.So, two callbacks, one for handler fn, and other from Model.method()
  some methods save,create,find,findOne,findById,findOneAndUpdate,findByIdAndRemove, callbacks done,done(null, data),function(err, data) {} etc to list in MongoDB & Mongoose package.
  - Model.Method takes first parameter obj, second calback.So, two callbacks, one for handler fn, and other from Model.method()
    // some methods save,create,find,findOne,findById,findOneAndUpdate,findByIdAndRemove, callbacks done,done(null, data),function(err, data) {} etc to list in MongoDB & Mongoose package.

## Using MongoDB from Node.js

- To interface to a MongoDB database from a Node.js app
- init -y, npm install mongodb
- `const mongo = require('mongodb').MongoClient`

```js
try {
  const client = await mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  console.error(err);
}
```

- `Now you can select a database using the client.db() method:`
- select a database `const db = client.db('kennel')`
- can get a collection `const collection = db.collection('dogs')`
- one `const result = await collection.insertOne({name: 'Roger'})`
- many `const result = await collection.insertMany([{name: 'Togo'}, {name: 'Syd'}])`
- find `const items = await collection.find().toArray()`

We need a handle either as a function or const variable collection,
or db.collectionName. then we add dot method.

## Rest API uses routes HTTP GET / and HTTP POST /

- In Express we create server, web server
- `app.get('/', (req, res) )` to send to client ,get data from database or from script.
- single data as `app.get('/:id', (req, res) )` handled in script using `filter(cb)`
  from `req.params`. and send back using `res.status(code).json()`
- `app.post('/', (req, res) )` to insert data to db.
- we use mongodb or postgre sql database to store local or remote.