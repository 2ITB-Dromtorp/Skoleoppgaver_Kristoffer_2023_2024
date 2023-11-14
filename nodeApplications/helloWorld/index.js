const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "2itb"
});

con.connect(function (err) {

    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {


    var sql = "SELECT * FROM datamaskin"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result)
    });

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})