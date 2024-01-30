const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

app.listen(port, () => {
    app.get("/api/get", (req, res) => {
        res.status(200).json({ "message": "👌" })
    })
    app.get("*", (req, res) => {
        res.sendFile("build")
    })
})