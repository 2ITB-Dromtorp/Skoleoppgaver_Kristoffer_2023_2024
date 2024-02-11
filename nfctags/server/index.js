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
    constructor(Name, position) {
        this.Name = Name;
        this.Position = position
    }
}

// Class that holds a collection of players and properties and functions for the group
class Players {
    constructor() {
        this.players = []
    }
    // create a new player and save it in the collection
    newPlayer(name, position) {
        let p = new Player(name, position)
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
    
    getPlayer(name) {
        for (let player of this.allPlayers()) {
            if (player.Name == name) {
                return player
            }
        }
    }

}

const BOARD_SIZE = 10;

let gameBoard

let GamePlayers

let host

function setupGameBoard() {

    gameBoard = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => 0)
    );

    let tilenumber = 1

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {

            const cellNumber = i * BOARD_SIZE + j + 1;
            if (snakes[cellNumber]) {
                gameBoard[i][j] = { tile: tilenumber, position: snakes[cellNumber], type: "snake", playerinTile: [] };
            } else if (ladders[cellNumber]) {
                gameBoard[i][j] = { tile: tilenumber, position: ladders[cellNumber], type: "ladder", playerinTile: [] };
            } else {
                gameBoard[i][j] = { tile: tilenumber, position: cellNumber, type: "normal", playerinTile: [] };
            }
            tilenumber++
        }
    }

    return gameBoard
}

io.on('connection', async (socket) => {

    console.log('a user connected');

    socket.on("host", async () => {
        GamePlayers = new Players()
        host = socket
    })

    socket.on("playerRoll", async (playerName) => {

        var diceRoll = Math.floor(Math.random() * 6) + 1

        console.log(diceRoll)

        console.log(GamePlayers)

        GamePlayers.getPlayer(playerName).Position += diceRoll

        let player = GamePlayers.getPlayer(playerName)

            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {

                    if (gameBoard[i][j].playerinTile.length >  0) {
                        gameBoard[i][j].playerinTile = gameBoard[i][j].playerinTile.filter(p => p !== player);
                    }
                    if (gameBoard[i][j].tile === player.Position) {
                        console.log(GamePlayers)
                        GamePlayers.getPlayer(playerName).Position = gameBoard[i][j].position
                        gameBoard[i][j].playerinTile.push(GamePlayers.getPlayer(playerName));
                    }

                }
            }


        
        host.emit("renderBoard", gameBoard)

    })

    socket.on("startGame", async () => {
        if (GamePlayers.numberOfPlayers() < 1) {
            return
        }

        console.log("game started")

        gameBoard = setupGameBoard()

        gameBoard[0][0].playerinTile = GamePlayers.allPlayers()

        host.emit("renderBoard", gameBoard)
    })

    socket.on("PlayerJoin", async (playerName) => {
        GamePlayers.newPlayer(playerName, 1)
        host.emit("updatePlayers", GamePlayers.allPlayers())
    })

    socket.on("PlayerLeave", async (playerName) => {
        host.emit("playerLeave", playerName)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});