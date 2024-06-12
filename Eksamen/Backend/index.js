require('dotenv').config()

const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 8080
var cors = require("cors");
const http = require("http");
const url = process.env.URL
const jwt = require('jsonwebtoken');
const server = http.createServer(app);

app.use(express.json())
app.use(cors())

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Ingen token funnet' });
  }

  jwt.verify(token.split(' ')[1], 'token', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token er utløpt' });
      }
      return res.status(403).json({ error: err });
    }
    req.user = user;
    next();
  });
}

server.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)

  try {
    const mongodb = new MongoClient(url);
    await mongodb.connect();
    console.log("Connected to MongoDB");

    const databaseName = "Eksamen";
    const TournamentsString = "Tournaments";
    const AdminsString = "Admins"
    const UsersString = "Users"

    const database = mongodb.db(databaseName);
    const Tournaments = database.collection(TournamentsString);
    const Admins = database.collection(AdminsString);
    const Users = database.collection(UsersString);

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: "Email og passord er påkrevd" });
        }

        const user = await Users.findOne({ Email: email });
        if (!user) {
          return res.status(401).json({ error: "Bruker finnes ikke" });
        }

        const tokenPayload = {
          userdata: user
        };

        const token = jwt.sign(tokenPayload, "token", { expiresIn: '2h' });

        res.json({ token: token });
      } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.get('/get-tournaments/:sport', authenticateToken, async (req, res) => {
      try {
        const userID = req.user.userdata._id;

        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const tournaments = Tournaments.find({ Sport: user.Sport });
        if (!tournaments) {
          return res.status(404).json({ error: 'tournaments not found' });
        }

      } catch (error) {
        console.error("Tournaments failed:", error);
        res.status(500).json({ error: error });
      }
    })


  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error });
  }

})
