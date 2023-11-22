const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("database.db");
const app = express()
const port = 3000

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})