const express = require("express")
const cors = require("cors")
const app = express()
const path = require("node:path")
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Credentials"],
        credentials: true
    }
});

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

app.get("*", (req, res) => {
    res.sendFile(path.resolve("./build/index.html"))
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const snakes = {
    14: 4,
    16: 6,
    28: 10,
    43: 19,
    51: 31,
    62: 39,
    77: 26,
    90: 70,
    99: 78
};

const ladders = {
    2: 19,
    8: 23,
    16: 37,
    24: 69,
    36: 46,
    41: 62,
    65: 84,
    73: 94,
};

class Player {
    constructor(Name, position, playernumber) {
        this.Name = Name;
        this.Position = position;
        this.PlayerNumber = playernumber;
        this.Turn = false
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

        if (this.numberOfPlayers() === 0) {
            p.Turn = true
        }

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

    getPlayerByTurn(number) {
        for (let player of this.allPlayers()) {
            if (player.PlayerNumber == number) {
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

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {

            const cellNumber = i * BOARD_SIZE + j + 1;
            if (snakes[cellNumber]) {
                gameBoard[i][j] = { tile: cellNumber, position: snakes[cellNumber], type: "snake", playerinTile: [] };
            } else if (ladders[cellNumber]) {
                gameBoard[i][j] = { tile: cellNumber, position: ladders[cellNumber], type: "ladder", playerinTile: [] };
            } else {
                gameBoard[i][j] = { tile: cellNumber, position: cellNumber, type: "normal", playerinTile: [] };
            }
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
            gamePlayers: new Players,
            playerTurn: 0,
            gameStarted: false,
            playerisMoving: false,
            maxPlayers: 16,
            Winner: "",
            gameSpeed: 400,
        }

        socket.join(RoomCode)

        console.log("room hosted at " + RoomCode)
    })

    socket.on("playerRoll", async (data) => {
        let diceRoll = Math.floor(Math.random() * 6) + 1

        let playerName = data.Player
        let roomCode = data.RoomCode

        if (gameRooms[roomCode].gameStarted == false || gameRooms[roomCode].playerTurn !== gameRooms[roomCode].gamePlayers.getPlayer(playerName).PlayerNumber) {
            console.log("not players turn" + gameRooms[roomCode].playerTurn)
            return
        }
        if (gameRooms[roomCode].playerisMoving == true) {
            console.log("wait until animation")
            return
        }

        gameRooms[roomCode].playerisMoving = true

        let gameBoard = await gameRooms[roomCode].gameboard

        let newPosition
        let delay = gameRooms[roomCode].gameSpeed;
        console.log(diceRoll)

        io.to(data.RoomCode).emit("message", playerName + " Rolled " + diceRoll)

        function renderLoop(i, isSnake) {
            if (i <= diceRoll) {

                let player = gameRooms[roomCode].gamePlayers.getPlayer(playerName)
                let currentPosition = isSnake ? player.Position : (player.Position + i)
                console.log("position:" + currentPosition)

                for (let l = 0; l < BOARD_SIZE; l++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {

                        if (gameBoard[l][j].playerinTile.length > 0) {
                            gameBoard[l][j].playerinTile = gameBoard[l][j].playerinTile.filter(p => p !== player);
                            if (gameBoard[l][j].type == "snake") {
                                io.to(data.RoomCode).emit("renderBoard", gameBoard)
                            }
                        } else if (gameBoard[l][j].tile === currentPosition) {
                            if (!gameBoard[l][j].playerinTile.some(p => p.Name === playerName)) {
                                gameBoard[l][j].playerinTile.push(gameRooms[roomCode].gamePlayers.getPlayer(playerName));
                            }

                            newPosition = gameBoard[l][j]

                            if ((player.Position + diceRoll) === 100) {
                                gameRooms[roomCode].gameStarted = false
                                gameRooms[roomCode].Winner = gameRooms[roomCode].gamePlayers.getPlayer(playerName)
                                io.to(data.RoomCode).emit("playerWin", gameRooms[roomCode].Winner)
                                io.to(data.RoomCode).emit("renderBoard", gameBoard)
                                return
                            }

                            io.to(data.RoomCode).emit("renderBoard", gameBoard)
                        } else if ((player.Position + diceRoll) > 100) {
                            io.to(data.RoomCode).emit("message", (diceRoll + " is higher than 100"))
                            gameRooms[roomCode].playerisMoving = false
                        }
                    }
                }

                setTimeout(() => {
                    renderLoop(i + 1, false);
                }, delay);
            } else {
                gameRooms[roomCode].gamePlayers.getPlayer(playerName).Position = newPosition.position
                if (newPosition.type == "ladder") {
                    renderLoop(diceRoll, false)
                } else if (newPosition.type == "snake") {
                    renderLoop(diceRoll, true)
                }

                if (gameRooms[roomCode].playerTurn === (gameRooms[roomCode].gamePlayers.numberOfPlayers() - 1)) {
                    gameRooms[roomCode].playerTurn = 0
                } else {
                    gameRooms[roomCode].playerTurn += 1
                }

                gameRooms[roomCode].playerisMoving = false
                gameRooms[roomCode].gamePlayers.getPlayer(playerName).Turn = false

                io.to(data.RoomCode).emit("message", gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Name + "'s turn")
                gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Turn = true
                io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
            }

        }

        renderLoop(1, false)
    })

    socket.on("startGame", async (data) => {

        console.log("game started")

        let roomCode = data.RoomCode

        gameRooms[roomCode].gameboard[0][0].playerinTile = gameRooms[roomCode].gamePlayers.allPlayers()
        gameRooms[roomCode].gameStarted = true
        gameRooms[roomCode].gameSpeed = data.speed

        io.to(roomCode).emit("clientStart")
        io.to(roomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
        io.to(roomCode).emit("renderBoard", gameBoard)
    })

    socket.on("PlayerJoin", async (data) => {

        let roomCode = data.RoomCode

        console.log(data)

        if (!gameRooms[roomCode]) {
            console.log("room dosent exist")
            return;
        }

        socket.join(data.RoomCode)

        let playernumber = gameRooms[roomCode].gamePlayers.numberOfPlayers()

        gameRooms[roomCode].gamePlayers.newPlayer(data.Player, 1, playernumber);



        if (gameRooms[roomCode].gameStarted == true) {
            gameRooms[roomCode].gameboard[0][0].playerinTile.push(gameRooms[roomCode].gamePlayers.getPlayer(data.Player))
            io.to(data.RoomCode).emit("renderBoard", gameRooms[roomCode].gameboard)
        }

        io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
    })

    socket.on("PlayerLeave", async (playerName) => {
        host.emit("playerLeave", playerName)
    })

    socket.on("removeHost", async (roomCode) => {
        delete gameRooms[roomCode]
        console.log(gameRooms)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});