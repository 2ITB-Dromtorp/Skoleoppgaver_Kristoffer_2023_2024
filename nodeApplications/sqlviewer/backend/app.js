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

app.post("/updateSql", (req, res) => {

    sql.query(`UPDATE elev SET Fornavn = '${req.body.Fornavn}', Etternavn = '${req.body.Etternavn}', DatamaskinID = '${req.body.DatamaskinID}', Hobby = '${req.body.Hobby}', Klasse = '${req.body.Klasse}', Kjonn = '${req.body.Kjonn}' WHERE ElevID = ${req.body.ElevID}`, function (err, result) {
        if (err) throw err;
        res.send(result)
    });

})

app.get('/sql', (req, res) => {
    var sqlstring = "SELECT * FROM elev"
    sql.query(sqlstring, function (err, result) {
        if (err) throw err;
        res.send(result)
    });

})

app.post('/insertsql', (req, res) => {

    sql.query(`INSERT INTO elev (ElevID, Fornavn, Etternavn, Klasse, Hobby, Kjonn, DatamaskinID) VALUES (null,'${req.body.Fornavn}','${req.body.Etternavn}','${req.body.Klasse}','${req.body.Hobby}','${req.body.Kjonn}','${req.body.DatamaskinID}')`, function (err, result) {
        if (err) throw err;
        res.send()
    })
})

app.post('/deletesql', (req, res) => {

    sql.query(`DELETE FROM elev WHERE ElevID = ${req.body.ElevID}`, function (err, result) {
        if (err) throw err;
        res.send()
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})