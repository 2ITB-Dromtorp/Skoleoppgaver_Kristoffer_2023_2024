require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const port = process.env.PORT || 8080
const http = require("http");
var cors = require("cors")
app.use(express.json())
const { MongoClient } = require('mongodb');
const url = process.env.URL
const server = http.createServer(app);

const jwt = require('jsonwebtoken')

const Joi = require('joi');

app.use(cors())

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
  password: Joi.string().min(8).required(),
  class_id: Joi.string().valid("2ITB", "2ITA", "IM").required(),
  role: Joi.string().valid("Student", "Teacher").required(),
  contact_info: Joi.object({
    firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
    lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
    phone: Joi.string().min(7).max(15),
    adress: Joi.string().max(50),
    city: Joi.string().max(30),
  }).required()
});

const EquipmentSchema = Joi.object({
  _id: Joi.string().alphanum().min(5).max(20).required(), 
  Type: Joi.string().max(20).required(),
  Model: Joi.string().max(20).required(),
  Specs: Joi.array().items(Joi.string().max(50)),
  BorrowStatus: Joi.object({
    currentStatus: Joi.string().valid("borrowed", "available", "pending").required(),
    studentsborrowing: Joi.array().items(
      Joi.object({
        email: Joi.string().email().required(),
        firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
        lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      })
    )
  }).required()
});

const BorrowRequestSchema = Joi.object({
  _id: Joi.string().alphanum().min(5).max(20).required(),
  studentsborrowing: Joi.array().items(
    Joi.object({
      email: Joi.string().email().required(),
      firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
      lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
    })
  ).required()
});

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

    const database = mongodb.db(databaseName);
    const Users = database.collection(UserCollection);
    const Equipments = database.collection(EquipmentCollection)
    const Borrow = database.collection(BorrowRequest)

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(401).json({ error: "User dosen't exist" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ error: "Invalid email or password." });
        }

        const tokenPayload = {
          userdata: user
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ auth: true, token: token });
      } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.post('/signup', async (req, res) => {
      try {
        const userData = await req.body;

        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(userData.password, salt);

        let newUserData = {
          email: userData.email,
          password: hash,
          class_id: userData.class_id,
          role: userData.role,
          contact_info: {
            firstname: userData.contact_info.firstname,
            lastname: userData.contact_info.lastname,
            phone: userData.contact_info.phone,
            adress: userData.contact_info.adress,
            city: userData.contact_info.city,
          }
        }

        const validationResult = UserSchema.validate(newUserData);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.details[0].message);
        }
        await Users.insertOne(newUserData);

        const user = await Users.findOne({ email: userData.email });
        if (!user) {
          return res.status(401).json({ error: "User dosen't exist" });
        }

        const tokenPayload = {
          userdata: user
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ auth: true, token: token });
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send(error);
      }
    })

    app.post('/add-equipment', async (req, res) => {
      try {
        const equipmentData = await req.body;
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Only teachers can add equipments.' });
        }

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

    app.get('/get-equipments', authenticateToken, async (req, res) => {
      try {
        const equipmentCursor = Equipments.find();
        const equipments = await equipmentCursor.toArray();
        res.send(equipments);
      } catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).send(error);
      }
    })

    app.get('/get-user-equipments', authenticateToken, async (req, res) => {
      try {
        const userEmail = req.user.userdata.email;

        const borrowedEquipments = await Equipments.find({
          "BorrowStatus.currentStatus": "borrowed",
          "BorrowStatus.studentsborrowing.email": userEmail,
        }).toArray();

        const pendingBorrowRequests = await Borrow.find({
          "studentsborrowing.email": userEmail,
        }).toArray();

        const pendingEquipments = await Promise.all(
          pendingBorrowRequests.map(async (request) => {
            const equipment = await Equipments.findOne({ _id: request._id });

            if (equipment) {
              const existingBorrowing = equipment.BorrowStatus.studentsborrowing || [];

              const updatedBorrowing = [
                ...existingBorrowing,
                ...request.studentsborrowing.filter(
                  (student) =>
                    !existingBorrowing.some(
                      (existing) => existing.email === student.email
                    )
                ),
              ];

              return {
                ...equipment,
                BorrowStatus: {
                  ...equipment.BorrowStatus,
                  studentsborrowing: updatedBorrowing,
                },
              };
            }

          })
        );

        res.json({
          borrowed: borrowedEquipments,
          pending: pendingEquipments.filter((item) => item !== null),
        });
      } catch (error) {
        console.error("Error getting user equipment:", error);
        res.status(500).send(error);
      }
    })

    app.get('/get-borrow-requests', authenticateToken, async (req, res) => {
      try {
        const borrowCursor = Borrow.find();
        const borrowrequestlist = await borrowCursor.toArray();
        res.send(borrowrequestlist);
      } catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).send(error);
      }
    })

    app.post('/borrow-request', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const user = req.user.userdata;

        const existingRequest = await Borrow.findOne({ _id: equipmentId });

        if (existingRequest) {
          const alreadyRequested = existingRequest.studentsborrowing.some(
            (student) => student.email === user.email
          );

          if (alreadyRequested) {
            return res.status(400).json({ error: "You have already requested to borrow this equipment." });
          }

          await Borrow.updateOne(
            { _id: equipmentId },
            { $push: { studentsborrowing: { email: user.email, firstname: user.contact_info.firstname, lastname: user.contact_info.lastname } } }
          );
        } else {

          const newRequest = {
            _id: equipmentId,
            studentsborrowing: [
              {
                email: user.email,
                firstname: user.contact_info.firstname,
                lastname: user.contact_info.lastname,
              },
            ],
          };

          const validationResult = BorrowRequestSchema.validate(newRequest);
          if (validationResult.error) {
            return res.status(400).send(validationResult.error.details[0].message);
          }

          await Borrow.insertOne(newRequest);
        }

        await Equipments.updateOne(
          { _id: equipmentId },
          {
            $set: { "BorrowStatus.currentStatus": "pending" },
          }
        );

        res.json({ success: true, message: 'Borrow request successfully created or updated.' });
      } catch (error) {
        console.error("Error creating borrow request:", error);
        res.status(500).json({ error: "Internal Server Error." });
      }
    });

    app.put('/borrow-deny', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Only teachers can accept borrow requests.' });
        }

        const existingRequest = await Borrow.findOne({ _id: equipmentId });

        if (!existingRequest) {
          return res.status(404).json({ error: 'No borrow request found for the given equipment.' });
        }

        await Borrow.deleteOne({ _id: equipmentId });
        await Equipments.updateOne(
          { _id: equipmentId },
          {
            $set: {
              "BorrowStatus.currentStatus": "available",
              "BorrowStatus.studentsborrowing": [],
            },
          }
        );

        res.json({ success: true, message: "Borrow request denied successfully." });
      } catch (error) {
        console.error("Error denying borrow request:", error);
        res.status(500).json({ error: "Internal Server Error." });
      }
    });

    app.put('/borrow-accept', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Only teachers can accept borrow requests.' });
        }

        const existingRequest = await Borrow.findOne({ _id: equipmentId });

        if (!existingRequest) {
          return res.status(404).json({ error: 'No borrow request found for the given equipment.' });
        }

        await Equipments.updateOne(
          { _id: equipmentId },
          {
            $set: { "BorrowStatus.currentStatus": "borrowed" },
            $push: {
              "BorrowStatus.studentsborrowing": {
                $each: existingRequest.studentsborrowing,
              },
            },
          }
        );

        await Borrow.deleteOne({ _id: equipmentId });

        res.json({ success: true, message: "Borrow request accepted successfully." });
      } catch (error) {
        console.error("Error accepting borrow request:", error);
        res.status(500).json({ error: "Internal Server Error." });
      }
    });

    app.put('/remove-borrowed-equipment', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const equipment = await Equipments.findOne({ _id: equipmentId });

        let currentStatus = equipment.BorrowStatus.currentStatus;

        console.log(currentStatus)

        if (!equipment) {
          return res.status(404).json({ error: 'Equipment not found.' });
        }

        await Equipments.updateOne(
          { _id: equipmentId },
          {
            $set: {
              "BorrowStatus.studentsborrowing": [],
              "BorrowStatus.currentStatus": "available",
            },
          }
        );

        await Borrow.deleteOne(
          { _id: equipmentId }
        )

        res.json({ success: true, message: 'Borrow removed successfully.' });

      } catch (error) {
        console.error("Error removing borrowed equipment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.put('/remove-equipment', authenticateToken,async (req, res) => {
      try {
        const { equipmentId } = req.body;

        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Only teachers can accept borrow requests.' });
        }

        await Equipments.deleteOne({_id: equipmentId})

        res.send("deleted")

      } catch (error) {
        console.error("Error removing equipment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    //used to test token :)
    app.get('/protected-route', authenticateToken, (req, res) => {
      res.json({ message: 'Access granted!' });
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})