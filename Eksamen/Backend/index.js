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

        const tournaments = await Tournaments.find({ Sport: user.Sport }).toArray();
        if (!tournaments) {
          return res.status(404).json({ error: 'tournaments not found' });
        }

        res.send(tournaments);
      } catch (error) {
        console.error("Tournaments failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.post('/register-tournament', authenticateToken, async (req, res) => {
      try {
        const { tournamentID } = req.body;
        const userID = req.user.userdata._id;

        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (user.Registered_Tournaments.includes(new ObjectId(tournamentID))) {
          return res.status(400).json({ error: 'Already registered for this tournament' });
        }

        const tournament = await Tournaments.findOne({ _id: new ObjectId(tournamentID) });
        if (!tournament) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
    
        const result = await Tournaments.updateOne({ _id: new ObjectId(tournamentID) }, { $push: {Registered_Users: new ObjectId(userID)} });
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
    
        const userUpdateResult = await Users.updateOne(
          { _id: new ObjectId(userID) },
          { $push: { Registered_Tournaments: new ObjectId(tournamentID) } }
        );
    
        if (!userUpdateResult.modifiedCount) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.status(200).json({ message: 'Successfully registered for the tournament' });
      } catch (error) {
        console.error("registered failed tournaments:", error);
        res.status(500).json({ error: error });
      }
    })

    app.get('/get-registered-tournaments', authenticateToken, async (req, res) => {
      try {
        const userID = req.user.userdata._id;

        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        let user_tournaments = []

        for (const tournamentIDs of user.Registered_Tournaments) {
          const tournament = await Tournaments.findOne({ _id: new ObjectId(tournamentIDs) });
          if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
          }

          user_tournaments.push(tournament);
        }
        res.send(user_tournaments);
      } catch (error) {
        console.error("registered failed tournaments:", error);
        res.status(500).json({ error: error });
      }
    })

    app.post('/unregister-tournament', authenticateToken, async (req, res) => {
      try {
        const { tournamentID } = req.body;
        const userID = req.user.userdata._id;
    
        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const tournament = await Tournaments.findOne({ _id: new ObjectId(tournamentID) });
        if (!tournament) {
          return res.status(404).json({ error: 'Tournament does not exist' });
        }
    
        const result = await Tournaments.updateOne(
          { _id: new ObjectId(tournamentID) }, 
          { $pull: { Registered_Users: new ObjectId(userID)} }
      );

        if (!result.modifiedCount) {
          return res.status(404).json({ error: 'could not remove userID in tournament data' });
        }
    
        const userUpdateResult = await Users.updateOne(
          { _id: new ObjectId(userID) },
          { $pull: { Registered_Tournaments: new ObjectId(tournamentID) } }
        );

    
        if (!userUpdateResult.modifiedCount) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
    
        res.status(200).json({ message: 'Successfully unregistered from the tournament' });
      } catch(error) {
        console.error(error);
      }

    })

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error });
  }

})
