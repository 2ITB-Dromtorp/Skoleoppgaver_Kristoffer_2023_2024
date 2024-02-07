const express = require("express")
const cors = require("cors")
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Credentials"],
        credentials: true
    }
});

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080



/*app.get("*", (req, res) => {
    res.sendFile("build")
})*/

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("host", () => {

    })

    socket.on("clientResponse", () => {

    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});