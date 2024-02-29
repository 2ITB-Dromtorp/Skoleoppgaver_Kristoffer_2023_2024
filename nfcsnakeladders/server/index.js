const express = require("express")
const cors = require("cors")
const app = express()
const path = require("node:path")
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Specify the exact origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const port = process.env.PORT || 8080

/*app.get("*", (req, res) => {
    res.sendFile(path.resolve("./build/index.html"))
})*/

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
class Player {
    constructor(Name, position, playernumber) {
        this.Name = Name;
        this.Position = position;
        this.PlayerNumber = playernumber;
        this.Turn = false
    }
}
class Players {
    constructor() {
        this.players = []
    }

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

    numberOfPlayers() {
        return this.players.length
    }

    removePlayer(name) {
        for (let player of this.allPlayers()) {
            if (player.Name == name) {
                this.players.splice(player.PlayerNumber, 1);
            }
        }
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

function setupGameBoard(snakes, ladders) {

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

function changeTurn(roomCode) {
    const gameRoom = gameRooms[roomCode];

    if (gameRoom.turnChanged) return;

    gameRoom.turnChanged = true;

    const players = gameRoom.gamePlayers.allPlayers();
    const currentPlayer = players[gameRoom.playerTurn];
    const nextPlayerIndex = (gameRoom.playerTurn + 1) % players.length;

    console.log(nextPlayerIndex)

    currentPlayer.Turn = false;

    const nextPlayer = players[nextPlayerIndex];

    nextPlayer.Turn = true;

    gameRoom.playerTurn = nextPlayerIndex;

    gameRoom.turnChanged = false;

    io.to(roomCode).emit("updatePlayers", players);
}

io.on('connection', async (socket) => {

    console.log('a user connected');

    socket.on("host", async (data) => {

        const snakes = {
            14: 4,
            16: 6,
            28: 10,
            43: 20,
            51: 31,
            62: 39,
            77: 26,
            90: 70,
            99: 78
        };

        const ladders = {
            2: 19,
            8: 27,
            16: 37,
            24: 54,
            34: 48,
            41: 60,
            65: 84,
            73: 94,
        };

        gameRooms[data.RoomCode] = {
            gameboard: setupGameBoard(snakes, ladders),
            gamePlayers: new Players,
            gameMode: data.mode,
            playerTurn: 0,
            canJoin: true,
            gameStarted: false,
            turnChanged: false,
            playerisMoving: false,
            maxPlayers: data.max,
            Winner: "",
            gameSpeed: data.speed,
        }

        socket.join(data.RoomCode)

        console.log("room hosted at " + data.RoomCode)
    })

    socket.on("playerRoll", async (data) => {
        let diceRoll = Math.floor(Math.random() * 6) + 1

        let playerName = data.Player
        let roomCode = data.RoomCode

        if (gameRooms[roomCode].gameStarted == false) {
            console.log("not stared")
            socket.emit("clientMessage", "Not Started")
            return
        }
        else if (gameRooms[roomCode].playerisMoving == true) {
            console.log("already moving")

            socket.emit("clientMessage", (gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Name + "is already moving"))
            return
        }
        else if (gameRooms[roomCode].playerTurn !== gameRooms[roomCode].gamePlayers.getPlayer(playerName).PlayerNumber) {
            console.log("not turn")
            socket.emit("clientMessage", "Not your turn")
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

                console.log(isSnake)

                let player = gameRooms[roomCode].gamePlayers.getPlayer(playerName)
                let currentPosition = isSnake ? player.Position : (player.Position + i)
                console.log("position:" + currentPosition)

                for (let l = 0; l < BOARD_SIZE; l++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {

                        if (gameBoard[l][j].playerinTile.length > 0) {

                            gameBoard[l][j].playerinTile = gameBoard[l][j].playerinTile.filter(p => p.Name !== playerName);

                        }
                        if (gameBoard[l][j].tile === currentPosition) {
                            newPosition = gameBoard[l][j]


                            gameBoard[l][j].playerinTile.push(gameRooms[roomCode].gamePlayers.getPlayer(playerName));

                            console.log(newPosition)

                            io.to(data.RoomCode).emit("renderBoard", gameBoard)
                        } else if ((player.Position + diceRoll) > 100) {
                            io.to(data.RoomCode).emit("message", (diceRoll + " is higher than 100"))
                            gameRooms[roomCode].playerisMoving = false
                            break;
                        }
                    }
                }

                setTimeout(() => {

                    renderLoop(i + 1, false);

                }, delay);
            } else {
                if (isSnake) {
                    return;
                }

                if ((gameRooms[roomCode].gamePlayers.getPlayer(playerName).Position + diceRoll) > 100) {

                    changeTurn(roomCode)

                    io.to(data.RoomCode).emit("message", gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Name + "'s turn")
                    io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
                    return
                }

                gameRooms[roomCode].gamePlayers.getPlayer(playerName).Position = newPosition.position

                if ((gameRooms[roomCode].gamePlayers.getPlayer(playerName).Position) === 100) {
                    gameRooms[roomCode].gameStarted = false
                    gameRooms[roomCode].Winner = gameRooms[roomCode].gamePlayers.getPlayer(playerName).Name
                    io.to(data.RoomCode).emit("message", (gameRooms[roomCode].Winner + " Won the game🔥"))

                    io.to(data.RoomCode).emit("playerWin", gameRooms[roomCode].Winner)
                    return
                }

                if (newPosition.type == "ladder" || newPosition.type == "snake") {
                    renderLoop(diceRoll, true)
                } else {
                    changeTurn(roomCode)

                    io.to(data.RoomCode).emit("renderBoard", gameBoard)

                    gameRooms[roomCode].playerisMoving = false

                    io.to(data.RoomCode).emit("message", gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Name + "'s turn")
                    io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
                }


            }

        }

        renderLoop(1, false)
    })

    socket.on("startGame", async (data) => {

        console.log("game started")

        let roomCode = data.RoomCode

        if (gameRooms[roomCode].gameMode == "NFCmode") {

            gameRooms[roomCode].gamePlayers.newPlayer("NFCPlayer1", 1, 0);
            gameRooms[roomCode].gamePlayers.newPlayer("NFCPlayer2", 1, 1);
            gameRooms[roomCode].roomCode = "NFCode"

        }

        gameRooms[roomCode].canJoin = data.canjoin

        gameRooms[roomCode].gameboard[0][0].playerinTile = gameRooms[roomCode].gamePlayers.allPlayers()
        gameRooms[roomCode].gameStarted = true

        io.to(roomCode).emit("clientStart")
        io.to(roomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
        io.to(roomCode).emit("renderBoard", gameBoard)
        io.to(roomCode).emit("message", gameRooms[roomCode].gamePlayers.getPlayerByTurn(gameRooms[roomCode].playerTurn).Name + "'s turn")
    })

    socket.on("PlayerJoin", async (data) => {

        let roomCode = data.RoomCode

        console.log(data)

        if (!gameRooms[roomCode]) {
            console.log("room dosen't exist")
            socket.emit("clientMessage", "Room dosen't exist")
            return;
        }
        else if (gameRooms[roomCode].canJoin == false) {
            console.log("Can't join room")
            socket.emit("clientMessage", "You cannot join this room")
            return
        }
        else if (gameRooms[roomCode].maxPlayers < (gameRooms[roomCode].gamePlayers.numberOfPlayers() + 1)) {
            console.log("Too many Players")
            console.log(gameRooms[roomCode].maxPlayers)
            console.log(gameRooms[roomCode].gamePlayers.numberOfPlayers())
            socket.emit("clientMessage", "Too many Players")
            return
        }

        for (i = 0; i < gameRooms[roomCode].gamePlayers.allPlayers().length; i++) {
            if (gameRooms[roomCode].gamePlayers.allPlayers()[i].Name === data.Player) {
                socket.emit("clientMessage", "Player already has that name")
                return
            }
        }

        socket.join(data.RoomCode)

        if (gameRooms[roomCode].gameStarted) {
            socket.emit("clientStart")
        }

        let playernumber = gameRooms[roomCode].gamePlayers.numberOfPlayers()

        gameRooms[roomCode].gamePlayers.newPlayer(data.Player, 1, playernumber);

        if (gameRooms[roomCode].gameStarted == true) {
            gameRooms[roomCode].gameboard[0][0].playerinTile.push(gameRooms[roomCode].gamePlayers.getPlayer(data.Player))
            io.to(data.RoomCode).emit("renderBoard", gameRooms[roomCode].gameboard)
        }

        io.to(data.RoomCode).emit("updatePlayers", gameRooms[roomCode].gamePlayers.allPlayers())
    })

    socket.on("removeHost", async (roomCode) => {
        gameRooms[roomCode] = null
        io.to(roomCode).emit("hostisgone")
    })

    socket.on("LeaveGame", async (data) => {
        if (!gameRooms[data.RoomCode]) {
            return
        }

        let player = gameRooms[data.RoomCode].gamePlayers.getPlayer(data.Player)

        gameRooms[data.RoomCode].gamePlayers.removePlayer(data.Player)
        io.to(data.RoomCode).emit("updatePlayers", gameRooms[data.RoomCode].gamePlayers.allPlayers())

        changeTurn(data.RoomCode)

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = gameRooms[data.RoomCode].gameboard[i][j];
                if (cell.playerinTile.includes(player)) {
                    cell.playerinTile = cell.playerinTile.filter(p => p !== player);
                }
            }
        }

        io.to(data.RoomCode).emit("renderBoard", gameRooms[data.RoomCode].gameboard)


    })

    socket.on('disconnect', () => {
        console.log("user disconnect")
    });
});