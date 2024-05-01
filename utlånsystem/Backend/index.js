require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const port = process.env.PORT || 8080
const http = require("http");
var cors = require("cors")
const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.URL
const server = http.createServer(app);
const limit = require('express-rate-limit')

const jwt = require('jsonwebtoken')

const Joi = require('joi');


app.use(express.json())

app.use(cors())

app.use(limit({
  windowMs: 5000,
  max: 10,
  message: {
    code: 429,
    message: "Too many requests"
  },
}))

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Ingen token funnet' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token er utløpt' });
      }
      return res.status(403).json({ error: 'Ugyldig token' });
    }
    req.user = user;
    next();
  });
}

const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  class_id: Joi.string().valid("2ITB", "2ITA", "IM").required(),
  role: Joi.string().valid("Student", "Teacher", "Admin").required(),
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
  })
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
    const TeacherRequest = "TeacherRequest"

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
    const TeacherRequestList = database.collection(TeacherRequest)

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: "Email og passord er påkrevd" });
        }

        const TeacherCheck = await TeacherRequestList.findOne({ email: email });
        if (TeacherCheck) {
          return res.status(401).json({ error: "En admin må verifisere din Lærer konto" });
        }

        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(401).json({ error: "Bruker finnes ikke" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ error: "Ugyldig passord" });
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
        const userData = req.body;
        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(userData.password, salt);
    
        const newUser = {
          email: userData.email,
          password: hash,
          role: userData.role,
          class_id: userData.class_id,
          contact_info: {
            firstname: userData.contact_info.firstname,
            lastname: userData.contact_info.lastname,
            phone: userData.contact_info.phone,
            adress: userData.contact_info.adress,
            city: userData.contact_info.city,
          }
        };
    
        const validationResult = UserSchema.validate(newUser);
        if (validationResult.error) {
          return res.status(400).json({ error: validationResult.error.details[0].message });
        }
    
        if (userData.role === 'Teacher') {
          await TeacherRequestList.insertOne(newUser);
          return res.status(200).json({ message: 'En admin må verifisere din lærer-konto' });
        }
    
        await Users.insertOne(newUser);
    
        const token = jwt.sign({ userdata: newUser }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.status(200).json({ message: 'Elevkonto opprettet', token });
      } catch (error) {
        console.error("Feil under registrering:", error);
        res.status(500).json({ error: 'Intern feil' });
      }
    });

    app.put('/verify-teacher', authenticateToken, async (req, res) => {
      try {
        const teacheruser = req.body;
        const user = req.user.userdata;

        const teacherdata = teacheruser.data
    
        if (user.role !== 'Admin') {
          return res.status(403).json({ error: 'Du må være admin' });
        }
    
        if (!teacherdata) {
          return res.status(400).json({ error: 'Lærer ikke funnet' });
        }

        let newUserData = {
          email: teacherdata.email,
          password: teacherdata.password,
          class_id: teacherdata.class_id,
          role: teacherdata.role,
          contact_info: {
            firstname: teacherdata.contact_info.firstname,
            lastname: teacherdata.contact_info.lastname,
            phone: teacherdata.contact_info.phone,
            adress: teacherdata.contact_info.adress,
            city: teacherdata.contact_info.city,
          }
        }
    
        await Users.insertOne(newUserData);
        await TeacherRequestList.deleteOne({ email: newUserData.email });
    
        res.json({ message: "Verifisert lærer" });
      } catch (error) {
        console.error("Error verifying teacher", error);
        res.status(500).send(error);
      }
    })

    app.put('/unverify-teacher', authenticateToken, async (req, res) => {
      try {
        const teacheruser = req.body;
        const user = req.user.userdata;

        const teacherdata = teacheruser.data
    
        if (user.role !== 'Admin') {
          return res.status(403).json({ error: 'bare admins kan verifiserers' });
        }
    
        if (!teacherdata) {
          return res.status(400).json({ error: 'jærer data finnes ikke' });
        }

        await TeacherRequestList.deleteOne({ email: teacherdata.email })

        res.json({message: "uverifisert lærer"})
      } catch (error) {
        console.error("Error unverifying teacher", error);
        res.status(500).send(error);
      }
    })

    app.put('/add-equipment', authenticateToken, async (req, res) => {
      try {
        const equipmentData = await req.body;
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'bare lærere kan legge til utstyr.' });
        }

        const validationResult = EquipmentSchema.validate(equipmentData);
        if (validationResult.error) {
          return res.status(400).json({error: validationResult.error.details[0].message});
        }

        const checkEquipment = await Equipments.findOne({ _id: equipmentData._id})

        if (checkEquipment) {
          return res.status(403).json({ error: 'utstyr allerede fins' });
        }

        await Equipments.insertOne(equipmentData);

        res.json({message: "Lagt til utstyr"})
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
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Lærer only' });
        }

        const borrowCursor = Borrow.find();
        const borrowrequestlist = await borrowCursor.toArray();
        res.send(borrowrequestlist);
      } catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).send(error);
      }
    })

    app.get('/get-teacher-requests', authenticateToken, async (req, res) => {
      try {
        const user = req.user.userdata;

        if (user.role !== 'Admin') {
          return res.status(403).json({ error: 'Lærer only' });
        }

        const teacherrequestCursor = TeacherRequestList.find();
        const teacherrequest = await teacherrequestCursor.toArray()

        console.log(teacherrequest)
        res.send(teacherrequest)
      } catch (error) {
        console.error("Error getting teacher requests", error);
        res.status(500).send({ error: "Internal Server Error."});
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
            return res.status(400).json({ error: "Du har allerede bedt om å få låne dette utstyret" });
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

        res.json({ message: 'Låneforespørsel ble opprettet' });
      } catch (error) {
        console.error("Error creating borrow request:", error);
        res.status(500).json({ error: error });
      }
    });

    app.put('/borrow-deny', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const user = req.user.userdata;

        if (user.role !== 'Teacher') {
          return res.status(403).json({ error: 'Bare lærere kan godta låneforespørsler' });
        }

        const existingRequest = await Borrow.findOne({ _id: equipmentId });

        if (!existingRequest) {
          return res.status(404).json({ error: 'Fant ingen låneforespørsel for det gitte utstyret' });
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

        res.json({ success: true, message: "Låneforespørsel ble avvist" });
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
          return res.status(403).json({ error: 'Bare lærere kan godta låneforespørsler' });
        }

        const existingRequest = await Borrow.findOne({ _id: equipmentId });

        if (!existingRequest) {
          return res.status(404).json({ error: 'Fant ingen låneforespørsel for det gitte utstyret' });
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

        res.json({ success: true, message: "Låneforespørsel ble godtatt" });
      } catch (error) {
        console.error("Error accepting borrow request:", error);
        res.status(500).json({ error: "Internal Server Error." });
      }
    });

    app.put('/remove-borrowed-equipment', authenticateToken, async (req, res) => {
      try {
        const { equipmentId } = req.body;
        const equipment = await Equipments.findOne({ _id: equipmentId });

        if (!equipment) {
          return res.status(404).json({ error: 'Finner ikke utstyr' });
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

        res.json({ success: true, message: 'Lånet utstyr ble fjernet.' });

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
          return res.status(403).json({ error: 'Bare lærere kan fjerne utstyr' });
        }

        await Equipments.deleteOne({_id: equipmentId})

        res.send("Slettet utstyr")

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