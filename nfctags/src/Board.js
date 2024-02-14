import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';
import { useParams } from "react-router-dom"
const Board = () => {

    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])
    const [gameStateMessage, setGameStateMessage] = useState(0)


    var { HostID } = useParams()

    console.log(HostID)

    const startGame = () => {
        socket.emit("startGame", HostID)
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
        return gameBoard.map((row, rowIndex) => (

            <div key={rowIndex} className={'board-row'}>
                {rowIndex % 2 === 0 ? row.map((cellValue) => renderCell(cellValue)) : [...row].reverse().map((cellValue) => renderCell(cellValue))}
            </div>
        ));
    };

    useEffect(() => {
        function onDisconnect() {
            console.log("kisonnected")
        }
        function onJoin() {
            socket.emit("host", HostID)
        }

        socket.on("disconnect", onDisconnect)
        socket.on("connect", onJoin)
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => setGameBoard(map))
        socket.on("message", (message) => setGameStateMessage(message))

        console.log(players)
        console.log(gameBoard)

        return () => {
            socket.off("disconnect", onDisconnect);
            socket.off("connect", onJoin)
        }

    }, [players, gameBoard, gameStateMessage, HostID])

    return (
        <div className='BoardContainer'>


            <h1>{"Room Code:" + HostID}</h1>

            <h1>Waiting for Players</h1>
            <button onClick={startGame}> Start Game </button>

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
