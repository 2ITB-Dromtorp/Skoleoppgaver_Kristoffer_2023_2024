const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

app.get("/getInput/:input", (req, res) => {
    res.status(200).json({ "message": req.params.input })
})

app.get("*", (req, res) => {
    res.sendFile("build")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})