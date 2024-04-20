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

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: err });
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
    _id: Joi.string().alphanum().min(5).max(20).required(), //serial number null cap
    Type: Joi.string().max(20).required(),
    Model: Joi.string().max(20).required(),
    Specs: Joi.array(),
    BorrowStatus: Joi.object({
        currentStatus: Joi.string().valid('borrowed', 'available'),
        studentsborrowing: Joi.array()
    })
});
  
const BorrowRequestSchema = Joi.object({
    _id: Joi.string().alphanum().min(5).max(20).required(),
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
    const BorrowRequest = "BorrowRequests"

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
    const Borrow = database.collection(BorrowRequest)
    
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

        const tokenPayload = {
          userId: user._id,
          email: email
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2d' });

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

    app.post('/api/add-equipment', async (req, res) => {
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
      try {
        const equipmentCursor = Equipments.find();
        const equipments = await equipmentCursor.toArray();
        res.send(equipments);
      } catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).send(error);
      }
    })

    app.get('/api/get-borrow-requests', authenticateToken, async (req, res) => {
      try {
        const borrowCursor = Borrow.find();
        const borrowrequestlist = await borrowCursor.toArray();
        res.send(borrowrequestlist);
      } catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).send(error);
      }
    })

    app.post('/api/borrow-request', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const userId = req.userId;

        const existingRequest = await Borrow.findOne({ _id: equipmentId });
        if (existingRequest) {
          return res.status(400).json({ error: "Borrow request already exists for this equipment." });
        }
        const newRequest = { _id: equipmentId, studentsborrowing: [userId] };

        const validationResult = BorrowRequestSchema.validate(newRequest);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.details[0].message);
        }
        await Borrow.insertOne(newRequest);
        res.json("sucess");
      } catch (error) {
        console.error("Error creating borrow request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
    app.post('/api/borrow-deny', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        await Borrow.deleteOne({ _id: equipmentId });
        res.json({ success: true, message: "Borrow request denied successfully." });
      } catch (error) {
        console.error("Error denying borrow request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post('/api/borrow-accept', authenticateToken, async (req, res) => {
      try {
        const { equipmentId, studentId } = req.body;
        await Equipments.updateOne(
          { _id: equipmentId },
          { $set: { "BorrowStatus.currentStatus": "borrowed" }, $push: { "BorrowStatus.studentsborrowing": studentId } }
        );
        await Borrow.deleteOne({ _id: equipmentId });
        res.json({ success: true, message: "Borrow request accepted successfully." });
      } catch (error) {
        console.error("Error accepting borrow request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    //used to test token :)
    app.get('/api/protected-route', authenticateToken, (req, res) => {
      res.json({ message: 'Access granted!' });
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})