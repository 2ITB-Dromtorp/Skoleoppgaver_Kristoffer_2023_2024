import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';
import { useNavigate } from "react-router-dom";

const Player = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [roomCode, setRoomCode] = useState("")
    const [PlayerName, setPlayerName] = useState("Player Name")
    const [showJoinRoomUI, setShowJoinRoomUI] = useState(true);
    const [waitForHost, setWaitForHost] = useState(false)
    const [clientGameRunning, setclientGameRunning] = useState(false);
    const navigate = useNavigate();


    const handleJoinButtonClick = () => {

        if (document.getElementById("option").value === "NFC") {
            switchToNFC()
        }

        setShowJoinRoomUI(false); // Hide the JoinRoomUI component
        setWaitForHost(true)
        socket.emit("PlayerJoin", { Player: PlayerName, RoomCode: roomCode });
    };

    const rollDice = () => {
        socket.emit("playerRoll", { Player: PlayerName, RoomCode: roomCode });
    }

    const switchToNFC = () => {
        socket.emit("PlayerJoin", { Player: PlayerName, RoomCode: roomCode });
        navigate("/nfc/" + PlayerName + "/" + roomCode);
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
        socket.on("message", (message) => setGameStateMessage(message))
        //socket.on("clientResponse", clientResponse)
        socket.on("clientStart", () => setclientGameRunning(true))

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
            socket.off("message", (message) => setGameStateMessage(message))
            socket.off("clientStart", () => setclientGameRunning(true))

            //socket.off("clientResponse", clientResponse)

        }

    }, [roomCode, PlayerName, clientGameRunning])

    return (
        <div>

            {showJoinRoomUI && (
                <div>
                    <h1>Room Code</h1>
                    <input type='text' onChange={e => setRoomCode(e.target.value)} />

                    <h1>Player Name</h1>
                    <input type='text' onChange={e => setPlayerName(e.target.value)} />

                    <select id="option">
                        <option value="Normal">Normal</option>
                        <option value="NFC">NFC</option>
                    </select>

                    <button onClick={handleJoinButtonClick}>join</button>
                </div>
            )}

            {waitForHost && (
                <h1>Waiting for Host to start</h1>
            )}

            {clientGameRunning && (
                <div>
                    <h1>{PlayerName}</h1>
                    <button onClick={rollDice}>Roll Dice</button>
                    <h2>{gameStateMessage}</h2>
                </div>
            )}


        </div>
    );
};

export default Player;
