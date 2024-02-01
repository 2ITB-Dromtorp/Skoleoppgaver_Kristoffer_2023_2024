const express = require("express")
const cors = require("cors")
const app = express()
const Quiz = require('./spørsmåler.json');


app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

app.get("/getQuiz/:Tema/:Page", async (req, res) => {
    const jsonQuizes = JSON.stringify(Quiz);
    const Tema = req.params.Tema
    const Page = req.params.Page

    res.send(jsonQuizes[Tema][Page])
})

app.post("/checkAnswer", async (req, res) => {
    const jsonQuizes = JSON.stringify(Quiz);
    const quiz = await req.body.Quiz
    const quizPage = await req.body.Page
    const svar = await req.body.Svar

    if (jsonQuizes[quiz][quizPage].riktigSvar === svar) {
        res.send({ "Response": "Riktig" })
    } else {
        res.status(401).json({ "Response": "Feil" })
    }
})

app.get("*", (req, res) => {
    res.sendFile("build")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})