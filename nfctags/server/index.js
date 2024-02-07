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

const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78
};

const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

let players = []

let host

io.on('connection', async (socket) => {
    console.log('a user connected');

    socket.on("host", async () => {
        host = socket
    })

    socket.on("startGame", async () => {
        if (players.length != 2) {
            return
        }

        const BOARD_SIZE = 10; // Standard game board is  10x10

        // Initialize an empty game board
        const gameBoard = Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => 0)
        );

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cellNumber = i * BOARD_SIZE + j + 1;
                if (snakes[cellNumber]) {
                    gameBoard[i][j] = -snakes[cellNumber]; // Negative values indicate snakes
                } else if (ladders[cellNumber]) {
                    gameBoard[i][j] = ladders[cellNumber]; // Positive values indicate ladders
                } else {
                    gameBoard[i][j] = cellNumber;
                }
            }
        }

        host.emit("startGame", gameBoard)

    })

    socket.on("PlayerJoin", async (playerName) => {
        players = playerName
        host.emit("updatePlayers", playerName)
    })

    socket.on("PlayerLeave", async (playerName) => {
        host.emit("playerLeave", playerName)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});