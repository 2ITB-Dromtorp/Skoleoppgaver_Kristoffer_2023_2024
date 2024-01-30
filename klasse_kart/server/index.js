const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

app.listen(port, () => {
    app.get("/get", (req, res) => {
        res.status(200).json({ "message": "👌" })
    })
    app.get("*", (req, res) => {
        res.sendFile("build")
    })
})