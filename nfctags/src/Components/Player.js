import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';
import { useNavigate } from 'react-router-dom';

const Player = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [roomCode, setRoomCode] = useState("")
    const [PlayerName, setPlayerName] = useState("Player Name")
    const [showJoinRoomUI, setShowJoinRoomUI] = useState(true);
    const [waitForHost, setWaitForHost] = useState(false)
    const [clientGameRunning, setclientGameRunning] = useState(false);

    const navigate = useNavigate()

    const handleJoinButtonClick = () => {

        setShowJoinRoomUI(false); // Hide the JoinRoomUI component
        setWaitForHost(true)

        socket.emit("PlayerJoin", { Player: PlayerName, RoomCode: roomCode });
    };

    const handleLeave = () => {
        socket.emit("LeaveGame", { Player: PlayerName, RoomCode: roomCode })
        navigate("/join")
    }

    const rollDice = () => {
        socket.emit("playerRoll", { Player: PlayerName, RoomCode: roomCode });
    }


    useEffect(() => {

        function onJoin() {
            console.log("konnekted")
        }

        function onLeave() {
            socket.emit("LeaveGame", { Player: PlayerName, RoomCode: roomCode })
            window.location.reload()
        }


        socket.on("connect", onJoin)
        socket.on("disconnect", onLeave)
        socket.on("message", (message) => setGameStateMessage(message))
        socket.on("clientStart", () => setclientGameRunning(true))
        socket.on("clientMessage", (clientmessage) => setGameStateMessage(clientmessage))

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onLeave)
            socket.off("message", (message) => setGameStateMessage(message))
            socket.off("clientStart", () => setclientGameRunning(true))

            socket.off("clientMessage", (clientmessage) => setGameStateMessage(clientmessage))

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

                    <button onClick={handleJoinButtonClick}>join</button>
                </div>
            )}

            {(waitForHost && !clientGameRunning) && (
                <div>
                    <h1>Waiting for Host to start</h1>
                    <h2>Join the room "{roomCode}" as {PlayerName}</h2>
                    <h2>{gameStateMessage}</h2>

                </div>
            )}

            {clientGameRunning && (
                <div>
                    <h1>{PlayerName}</h1>
                    <button onClick={rollDice}>Roll Dice</button>
                    <h2>{gameStateMessage}</h2>

                    <button onClick={handleLeave}>Leave</button>
                </div>
            )}


        </div>
    );
};

export default Player;
