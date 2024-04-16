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
    const UserCollection = "Users";
    const EquipmentCollection = "Equipment"

    const databaseList = await mongodb.db().admin().listDatabases();
    const databaseExists = databaseList.databases.some(db => db.name === databaseName);
    if (!databaseExists) {
      console.error("Database does not exist:", databaseName);
      return;
    }

    const collectionList = await mongodb.db(databaseName).listCollections().toArray();
    const collectionExists = collectionList.some(col => col.name === UserCollection);
    if (!collectionExists) {
      console.error("Collection does not exist:", UserCollection);
      return;
    }

    const database = mongodb.db(databaseName);
    const Users = database.collection(UserCollection);
    const Equipments = database.collection(EquipmentCollection)
    
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

    app.get('/api/get-multiple-user-data', async (req, res) => {
      try {
        const user = await Users.find({});
        res.send(user);
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send(error);
      }
    })

    app.post('/api/login', async (req, res) => {

    })

    app.post('/api/create-user', async (req, res) => {

    })

    app.post('/api/add-equipments', async (req, res) => {

    }) 

    app.get('/api/get-equipments', async (req, res) => {

    })

    app.post('/api/borrow-request', async (req, res) => {

    })

    app.post('/api/borrow-deny', async (req, res) => {

    })

    app.post('/api/borrow-accept', async (req, res) => {

    })

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})