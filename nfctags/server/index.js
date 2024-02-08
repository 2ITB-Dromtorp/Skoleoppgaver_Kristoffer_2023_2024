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
    99: 78
};

const ladders = {
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
};

class Player {
    constructor(Name, x, y) {
        this.Name = Name;
        this.x = x;
        this.y = y;
    }
}

// Class that holds a collection of players and properties and functions for the group
class Players {
    constructor() {
        this.players = []
    }
    // create a new player and save it in the collection
    newPlayer(name, x, y) {
        let p = new Player(name, x, y)
        this.players.push(p)
        return p
    }
    allPlayers() {
        return this.players
    }
    // this could include summary stats like average score, etc. For simplicity, just the count for now
    numberOfPlayers() {
        return this.players.length
    }

    reset() {
        this.players = []
    }

    movePlayer(name, steps) {

    }
}

let GamePlayers

let host

io.on('connection', async (socket) => {
    console.log('a user connected');

    socket.on("host", async () => {
        GamePlayers = new Players()
        host = socket
    })

    socket.on("startGame", async () => {
        if (GamePlayers.numberOfPlayers() < 1) {
            return
        }

        console.log("game started")

        const BOARD_SIZE = 10;

        const gameBoard = Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => 0)
        );

        let tilenumber = 0

        for (let i = 0; i < BOARD_SIZE; i++) {
            tilenumber++
            for (let j = 0; j < BOARD_SIZE; j++) {


                const cellNumber = i * BOARD_SIZE + j + 1;
                if (snakes[cellNumber]) {
                    gameBoard[i][j] = { tile: tilenumber, position: snakes[cellNumber] }; // Negative values indicate snakes
                } else if (ladders[cellNumber]) {
                    gameBoard[i][j] = { tile: tilenumber, position: ladders[cellNumber] }; // Positive values indicate ladders
                } else {
                    gameBoard[i][j] = { tile: tilenumber, position: cellNumber };
                }
                tilenumber++
            }
        }

        console.log(gameBoard)

        host.emit("startGame", gameBoard)
    })

    socket.on("PlayerJoin", async (playerName) => {
        GamePlayers.newPlayer(playerName, 0, 0)
        host.emit("updatePlayers", GamePlayers.allPlayers())
    })

    socket.on("PlayerLeave", async (playerName) => {
        host.emit("playerLeave", playerName)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});