import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Client = () => {

    const [roomCode, setRoomCode] = useState("")
    const [PlayerName, setPlayerName] = useState("")

    function JoinGame() {
        socket.emit("PlayerJoin", {Player: PlayerName, RoomCode: roomCode});
    }

    const rollDice = () => {
        socket.emit("playerRoll", {Player: PlayerName, RoomCode: roomCode});
    }

    useEffect(() => {

        function onJoin() {
            console.log("konnekted")
        }
        function onDisconnect() {
            console.log("kisonnected")
        }

        socket.on("connect", onJoin)
        socket.on("disconnect", onDisconnect)

        //socket.on("clientResponse", clientResponse)

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
            //socket.off("clientResponse", clientResponse)

        }

    }, [])

    return (
        <div>
            <input type='text' onChange={e => setRoomCode(e.target.value)} ></input>

            <h1>Player Name</h1>
            <input type='text' onChange={e => setPlayerName(e.target.value)}></input>
            <button onClick={JoinGame}>join</button>

            <button onClick={rollDice}>Roll Dice</button>
        </div>
    );
};

export default Client;
