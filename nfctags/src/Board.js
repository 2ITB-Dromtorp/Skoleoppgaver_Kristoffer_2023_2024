import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Board = () => {

    //const [response, SetReponse] = useState("")
    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])

    useEffect(() => {
        function onJoin() {
            console.log("konnekted")
            socket.emit("host")
        }
        function onDisconnect() {
            console.log("kisonnected")
        }
        function startGame(players) {
            setPlayers(players)
            socket.emit("startGame")
        }

        socket.on("connect", onJoin)
        socket.on("disconnect", onDisconnect)
        socket.on("updatePlayers", (player) => startGame(player))
        socket.on("startGame", (map) => setGameBoard(map))

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
        }

    }, [players])

    return (
        <div>
            <h1>Waiting for Players</h1>
            {players}
        </div>
    );
};

export default Board;
