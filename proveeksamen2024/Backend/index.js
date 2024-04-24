require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const port = process.env.PORT || 8080
var cors = require("cors");
const http = require("http");
const url = process.env.TEST
const server = http.createServer(app);

app.use(express.json())
app.use(cors())

server.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)

    app.post('/api/login', async (req, res) => {
        try {
          const { email, password } = req.body;
      
          if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
          }
    
          res.json({auth: true, token: token });
          } catch (error) {
          console.error("Login failed:", error);
          res.status(500).json({ error: error });
        }
      })
})
