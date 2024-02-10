import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Client = () => {

    const [PlayerName, setPlayerName] = useState("")

    function JoinGame() {
        socket.emit("PlayerJoin", PlayerName);
    }

    const rollDice = () => {
        socket.emit("playerRoll", PlayerName);
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
            <h1>Player Name</h1>
            <input type='text' onChange={e => setPlayerName(e.target.value)}></input>
            <button onClick={JoinGame}>submit</button>

            <button onClick={rollDice}>Roll Dice</button>
        </div>
    );
};

export default Client;
