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

app.get('/getBrukere', (req, res) => {

    db.all("SELECT * FROM Bruker", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });

})

app.post('/getBrukere', (req, res) => {

    db.run("UPDATE Bruker SET Kurs = \"" + req.query.kurs + "\" WHERE username = 'Kristoffer Bekkevold'")

    db.all("SELECT * FROM Bruker", [], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });

})

/*const bcrypt = require("bcrypt")

app.post("/register", async (req, res) => {
    const userCopy = req.body

    db.all("SELECT * FROM Bruker", [], (err, row) => {
        if (err) {
            throw err;
        }
        const credentials = JSON.parse(row)
    });



    for (let i in credentials) {
        if (!(userCopy.username === credentials[i].username)) continue
        res.status(403).json({ "status": "User already exists" })
    }

    userCopy.password = await bcrypt.hash(req.body.password, 10)

    userCopy.availableLists = [];

    credentials.push(userCopy)

    fs.writeFile("./credentials.json", JSON.stringify(credentials), function (err) {
        if (err) {
            console.error(err)
            res.status(500).json({ "status": "Internal server error" })
        } else {
            console.log("User added")
            res.status(200).json({ "status": "User added" })
        }
    })
})

app.post("/login", (req, res) => {
    const credentials = JSON.parse(fs.readFileSync("./credentials.json"))

    let userIndex;

    req.body.username

    for (let i in credentials) {
        if (credentials[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            userIndex = i;
        }
    }

    if (userIndex != undefined) {
        bcrypt.compare(req.body.password, credentials[userIndex].password, (err, result) => {
            if (result) {
                res.status(200).json({ "result": result, "error": "Login successful", "username": credentials[userIndex].username })
            } else if (!result) {
                res.status(401).json({ "result": result, "error": "Wrong password or username" })
            }
        })
    } else {
        res.status(400).json({ "result": "Username not found", "error": "Username not found" })
    }
})*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})