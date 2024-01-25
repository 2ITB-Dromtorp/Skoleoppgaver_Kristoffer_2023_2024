const express = require('express')
var cors = require("cors");
const bcrypt = require("bcrypt")
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database.db");
const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.use(cors());

app.use(express.static("dist"))

app.get('/getKurs', (req, res) => {

    db.all("SELECT * FROM Kurs", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });

})

app.get('/getBrukere', (req, res) => {

    db.all("SELECT * FROM Bruker", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });

})

app.post('/getBrukere', (req, res) => {

    let sql = ("UPDATE Bruker SET Kurs = " + "'" + req.query.kurs + "'" + " WHERE username =" + "'" + req.body.username + "'")
    db.run(sql)

    db.all("SELECT * FROM Bruker", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });

})


app.post("/register", async (req, res) => {
    const userCopy = req.body

    db.all("SELECT * FROM Bruker", [], async (err, row) => {

        if (err) {
            throw err;
        }
        const credentials = row

        for (let i in credentials) {
            if (!(userCopy.username === credentials[i].username)) continue
            res.status(403).json({ "status": "User already exists" })
        }

        if (credentials != undefined) {
            userCopy.password = await bcrypt.hash(req.body.password, 10)
            let sql = ("INSERT INTO Bruker (username, password, Kurs) VALUES ('" + userCopy.username + "','" + userCopy.password + "'," + "''" + ")")
            db.run(sql)
            res.send("success")

        } else {
            res.status(403).json({ "error": "error" })
        }



    })

})

app.post("/login", (req, res) => {

    db.all("SELECT * FROM Bruker", [], async (err, row) => {

        const credentials = row

        let userIndex;

        for (let i in credentials) {
            if (credentials[i].username.toLowerCase() == req.body.username.toLowerCase()) {
                userIndex = i;
            }
        }

        if (credentials != undefined) {
            bcrypt.compare(req.body.password, credentials[userIndex].password, (err, result) => {
                if (result) {
                    res.send("success")

                } else if (!result) {
                    res.status(401).json({ "result": result, "error": "Wrong password or username" })
                }
            })

        } else {
            res.status(400).json({ "result": "Username not found", "error": "Username not found" })
        }

    })

})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})