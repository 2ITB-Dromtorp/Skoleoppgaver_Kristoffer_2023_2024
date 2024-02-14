import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';
import { useParams } from "react-router-dom"

const Player = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)

    var { PlayerName, HostID } = useParams();

    const rollDice = () => {
        socket.emit("playerRoll", { Player: PlayerName, RoomCode: HostID });
    }

    useEffect(() => {

        function onJoin() {
            console.log("konnekted")
            socket.emit("PlayerJoin", { Player: PlayerName, RoomCode: HostID });
        }
        function onDisconnect() {
            console.log("kisonnected")
        }

        socket.on("connect", onJoin)
        socket.on("disconnect", onDisconnect)
        socket.on("message", (message) => setGameStateMessage(message))
        //socket.on("clientResponse", clientResponse)

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
            //socket.off("clientResponse", clientResponse)

        }

    }, [HostID, PlayerName])

    return (
        <div>
            <h1>{PlayerName}</h1>
            <button onClick={rollDice}>Roll Dice</button>
            <h2>{gameStateMessage}</h2>
        </div>
    );
};

export default Player;
