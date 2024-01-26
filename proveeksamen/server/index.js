const express = require('express')
var cors = require("cors");
//const bcrypt = require("bcrypt")
//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database("./database.db");
const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.use(cors());

app.use(express.static("build"))

app.get('/ingenbruk', (req, res) => {

    res.send("b")

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})