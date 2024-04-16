const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express()
const port = process.env.PORT || 8080
var cors = require("cors");
app.use(express.json())

const url = process.env.TEST

app.use(cors())

app.listen(port, () => {

  const mongodb = new MongoClient(url);

  const database = mongodb.db("Database");
  const Users = database.collection("Teacher");
  console.log(Users)
  console.log(`Example app listening on port ${port}`)
  
  app.get('/get', async (req, res) => {
    try {
      const users = await Users.find().toArray();
      res.send(users);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).send("Internal Server Error");
    }
  })
  
})

/*function Hash(input) {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash &= hash;
  }
  return hash;
}*/


