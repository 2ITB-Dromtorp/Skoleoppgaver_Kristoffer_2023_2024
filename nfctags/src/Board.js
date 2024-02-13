import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Board = () => {

    //const [response, SetReponse] = useState("")
    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])
    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [roomCode, setRoomCode] = useState("")

    const createRoom = () => {
        socket.emit("host", roomCode)
    }

    const startGame = () => {
        socket.emit("startGame", roomCode)
    }

    const renderCell = (cellValue) => {

        return (
            <div className={`tile ${cellValue.type}`}>
                <div className='tile-number'>{cellValue.tile}</div>
                <div className='tile-players-container'>
                    {cellValue.playerinTile.length > 0 && cellValue.playerinTile.map((player) => {
                        return <div className={`player-${player.PlayerNumber}`}></div>
                    })}
                </div>
            </div>
        );
    };

    const renderGameBoard = () => {

        return gameBoard.map((row) => (
            <div className='board-row'>
                {row.map((cellValue) => renderCell(cellValue))}
            </div>
        ));
    };

    useEffect(() => {
        function onDisconnect() {
            console.log("kisonnected")
            socket.emit("removeHost", roomCode)
        }

        socket.on("disconnect", onDisconnect)
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => setGameBoard(map))
        socket.on("message", (message) => setGameStateMessage(message))

        console.log(players)
        console.log(gameBoard)

        return () => {
            socket.off("disconnect", onDisconnect);
        }

    }, [players, gameBoard, gameStateMessage, roomCode])

    return (
        <div className='BoardContainer'>
            <h1>Host</h1>
            <input type='text' onChange={e => setRoomCode(e.target.value)} ></input>
            <button onClick={createRoom}>Host Room</button>

            <button onClick={startGame}> Start Game </button>

            <h1>{gameStateMessage}</h1>
            <div className="game-board">
                {gameBoard.length > 0 && renderGameBoard()}
            </div>

            <div>
                {players.length > 0 && players.map((ekte) => {
                    return <p>{ekte.Name}</p>
                })}
            </div>

        </div>
    );
};

export default Board;
