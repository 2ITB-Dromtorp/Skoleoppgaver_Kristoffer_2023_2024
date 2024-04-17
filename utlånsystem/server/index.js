require('dotenv').config()

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

const jwt = require('jsonwebtoken')

const Joi = require('joi');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    class_id: Joi.string().required(),
    role: Joi.string().required(),
    contact_info: Joi.object({
      firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      phone: Joi.string(),
      adress: Joi.string(),
      city: Joi.string(),
  }),
});

const EquipmentSchema = Joi.object({
    _id: Joi.string().alphanum().min(5).max(20).required(), //serial number
    Type: Joi.string().max(20).required(),
    Model: Joi.string().max(20).required(),
    Specs: Joi.array(),
    BorrowStatus: Joi.object({
        currentStatus: Joi.string().valid('borrowed', 'available'),
        studentsborrowing: Joi.array()
    })
});
  
const BorrowRequestSchema = Joi.object({
    EquipmentID: Joi.string().alphanum().min(5).max(20).required(),
    studentsborrowing: Joi.array(),
})

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
    
    app.get('/api/get-user-data', authenticateToken, async (req, res) => {
      try {
        const userId = await req.body.id;
        const user = await Users.findOne({ email: userId });
        res.send(user);
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send(error);
      }
    })

    app.post('/api/login', async (req, res) => {
      try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(401).json({ error: "User dosen't exist" });
        }

        if (password !== user.password) {
          return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '5m' });

        res.json({auth: true, token: token });
        } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.post('/api/signup', async (req, res) => {
      try {
        const userData = await req.body;
        const validationResult = UserSchema.validate(userData);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.details[0].message);
        }
        await Users.insertOne(userData);
        res.send("sucess");
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send(error);
      }
    })

    app.post('/api/add-equipment', authenticateToken, async (req, res) => {
      try {
        const equipmentData = await req.body;
        const validationResult = EquipmentSchema.validate(equipmentData);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.details[0].message);
        }
        await Equipments.insertOne(equipmentData);
        res.send("sucess");
      } catch (error) {
        console.error("Error adding equipment:", error);
        res.status(500).send(error);
      }
    }) 

    app.get('/api/get-equipments', authenticateToken, async (req, res) => {

    })

    app.post('/api/borrow-request', authenticateToken,async (req, res) => {

    })

    app.post('/api/borrow-deny', authenticateToken,async (req, res) => {

    })

    app.post('/api/borrow-accept', authenticateToken,async (req, res) => {

    })

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})