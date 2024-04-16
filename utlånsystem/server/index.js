require('dotenv').config()

import { UserSchema } from './schemas';

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var cors = require("cors");
const http = require("http");
app.use(express.json())
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const url = process.env.TEST
const server = http.createServer(app);

app.use(cors())

server.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)

  try {
    const mongodb = new MongoClient(url);
    await mongodb.connect();
    console.log("Connected to MongoDB");

    const databaseName = "Skoleoppgave";
    const collectionName = "Users";

    const databaseList = await mongodb.db().admin().listDatabases();
    const databaseExists = databaseList.databases.some(db => db.name === databaseName);
    if (!databaseExists) {
      console.error("Database does not exist:", databaseName);
      return;
    }

    const collectionList = await mongodb.db(databaseName).listCollections().toArray();
    const collectionExists = collectionList.some(col => col.name === collectionName);
    if (!collectionExists) {
      console.error("Collection does not exist:", collectionName);
      return;
    }

    const database = mongodb.db(databaseName);
    const Users = database.collection(collectionName);
    
    app.get('/api/get-user-data', async (req, res) => {
      try {
        const userId = await req.body.id;
        const user = await Users.findOne({ _id: ObjectId(userId) });
        res.send(user);
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send(error);
      }
    })

    app.post('/api/login', async (req, res) => {
      try {
        const userId = await req.body.id;
        const user = await Users.findOne({ _id: ObjectId(userId) });
        res.send(user);
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send(error);
      }
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})