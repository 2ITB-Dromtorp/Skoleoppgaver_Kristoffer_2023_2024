import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Board = () => {

    //const [response, SetReponse] = useState("")
    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])

    const startGame = () => {

        socket.emit("startGame")
    }

    const renderCell = (cellValue) => {


        return (
            <div className={`tile`}>
                {cellValue.tile}
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
        function onJoin() {
            console.log("konnekted")
            socket.emit("host")
        }
        function onDisconnect() {
            console.log("kisonnected")
        }


        socket.on("connect", onJoin)
        socket.on("disconnect", onDisconnect)
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => setGameBoard(map))

        console.log(players)
        console.log(gameBoard)

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
        }

    }, [players, gameBoard])

    return (
        <div>
            <h1>Waiting for Players</h1>
            <button onClick={startGame}>Start Game</button>

            {players > 0 && players}

            <div className="game-board">
                {gameBoard.length > 0 && renderGameBoard()}
            </div>

        </div>
    );
};

export default Board;
