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
    constructor(Name, position, playernumber) {
        this.Name = Name;
        this.Position = position;
        this.PlayerNumber = playernumber;
    }
}

// Class that holds a collection of players and properties and functions for the group
class Players {
    constructor() {
        this.players = []
    }
    // create a new player and save it in the collection
    newPlayer(name, position, number) {
        let p = new Player(name, position, number)
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

let gameRooms = {};

io.on('connection', async (socket) => {

    console.log('a user connected');

    socket.on("host", async (RoomCode) => {

        gameRooms[RoomCode] = {
            gameboard: setupGameBoard(),
            gameplayers: new Players,
            playerturn: 0,
            gameStarted: false
        }

        socket.join(RoomCode)

        console.log("room hosted at " + RoomCode)
    })

    socket.on("playerRoll", async (data) => {



        let playerName = data.Player
        let roomCode = data.RoomCode

        if (gameRooms[roomCode].gameStarted == false || gameRooms[roomCode].playerturn !== gameRooms[roomCode].gameplayers.getPlayer(playerName).PlayerNumber) {
            console.log("not players turn" + gameRooms[roomCode].playerturn)
            return
        }

        let gameBoard = gameRooms[roomCode].gameboard

        let diceRoll = Math.floor(Math.random() * 6) + 1

        gameRooms[roomCode].gameplayers.getPlayer(playerName).Position += diceRoll

        let player = gameRooms[roomCode].gameplayers.getPlayer(playerName)

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {

                if (gameBoard[i][j].playerinTile.length > 0) {
                    gameBoard[i][j].playerinTile = gameBoard[i][j].playerinTile.filter(p => p !== player);
                }
                if (gameBoard[i][j].tile === player.Position) {
                    gameRooms[roomCode].gameplayers.getPlayer(playerName).Position = gameBoard[i][j].position

                    gameBoard[i][j].playerinTile.push(gameRooms[roomCode].gameplayers.getPlayer(playerName));
                }

            }
        }

        console.log(gameRooms[roomCode].gameplayers.getPlayer(playerName))

        if (gameRooms[roomCode].playerturn === (gameRooms[roomCode].gameplayers.numberOfPlayers() - 1)) {
            gameRooms[roomCode].playerturn = 0
        } else {
            gameRooms[roomCode].playerturn += 1
        }

        io.to(data.RoomCode).emit("renderBoard", gameBoard)

    })

    socket.on("startGame", async (roomCode) => {

        console.log("game started")

        gameRooms[roomCode].gameboard[0][0].playerinTile = gameRooms[roomCode].gameplayers.allPlayers()
        gameRooms[roomCode].gameStarted = true

        io.to(roomCode).emit("renderBoard", gameBoard)
    })

    socket.on("PlayerJoin", async (data) => {

        console.log(data)

        let roomCode = data.RoomCode

        if (!gameRooms[roomCode]) {
            console.log("room dosent exist")
            return;
        }

        socket.join(data.RoomCode)

        let playernumber = gameRooms[roomCode].gameplayers.numberOfPlayers()

        console.log(playernumber)

        gameRooms[roomCode].gameplayers.newPlayer(data.Player, 1, playernumber);

        io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gameplayers.allPlayers())
    })

    socket.on("PlayerLeave", async (playerName) => {
        host.emit("playerLeave", playerName)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});