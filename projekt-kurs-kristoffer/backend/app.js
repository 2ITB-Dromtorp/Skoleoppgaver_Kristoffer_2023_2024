const express = require('express')
var cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database.db");
const app = express()
const port = 3000

app.use(cors());

app.get('/getKurs', (req, res) => {

    db.all("SELECT * FROM Kurs", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });



})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})