const express = require('express')
const app = express()
const port = 3500
var mysql = require('mysql');
var cors = require("cors");

app.use(express.json())

app.use(cors());

var sql = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "2itb"
});

sql.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

/*app.post("/sendSql", (req, res) => {

    var sqlstring = req.body.command

    sql.query(sqlstring, function (err, result) {
        if (err) {
            res.send("SQL command wrong")
        };
        res.send(result)
    });

})*/

app.post("/updateSql", async (req, res) => {
    try {
        const { Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn, ElevID } = await req.body

        sql.query(`UPDATE elev SET Fornavn = '${Fornavn}', Etternavn = '${Etternavn}', DatamaskinID = '${DatamaskinID}', Hobby = '${Hobby}', Klasse = '${Klasse}', Kjonn = '${Kjonn}' WHERE ElevID = ${ElevID}`, async function (err, result) {
            if (err) throw err;
            res.send(result)
        });

    } catch (error) {
        return console.log(error)
    }

})

app.get('/sql', async (req, res) => {
    var sqlstring = "SELECT * FROM elev"
    sql.query(sqlstring, async function (err, result) {
        if (err) throw err;
        res.send(result)
    });

})

app.post('/insertsql', async (req, res) => {
    try {
        const { Fornavn, Etternavn, DatamaskinID, Hobby, Klasse, Kjonn } = await req.body

        sql.query(`INSERT INTO elev (ElevID, Fornavn, Etternavn, Klasse, Hobby, Kjonn, DatamaskinID) VALUES (null,'${Fornavn}','${Etternavn}','${Klasse}','${Hobby}','${Kjonn}','${DatamaskinID}')`, async function (err, result) {
            if (err) throw err;
            res.send(result)
        })
    } catch (error) {
        console.log(error)
    }
})

app.post('/deletesql', async (req, res) => {
    try {
        const ElevID = await req.body.ElevID

        sql.query(`DELETE FROM elev WHERE ElevID = ${ElevID}`, async function (err, result) {
            if (err) throw err;
            res.send(result)
        })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})