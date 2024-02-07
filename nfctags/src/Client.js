import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

const Client = () => {

    const [Player1Name, setPlayer1Name] = useState("")
    const [Player2Name, setPlayer2Name] = useState("")
    const [players, setPlayers] = useState([])

    function JoinGame() {
        socket.emit("PlayerJoin", [Player1Name, Player2Name]);
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
            <h1>Player 1 Name</h1>
            <input type='text' onChange={e => setPlayer1Name(e.target.value)}></input>
            <h1>Player 2 Name</h1>
            <input type='text' onChange={e => setPlayer2Name(e.target.value)}></input>
            <button onClick={JoinGame}>submit</button>
        </div>
    );
};

export default Client;
