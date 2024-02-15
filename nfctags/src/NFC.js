import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

import { useParams } from 'react-router-dom';


const NFC = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [waitForHost, setWaitForHost] = useState(true)
    const [clientGameRunning, setclientGameRunning] = useState(false);

    let { PlayerName, HostID } = useParams();

    useEffect(() => {

        function onJoin() {
            socket.emit("playerRoll", { Player: PlayerName, RoomCode: HostID });
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

    }, [clientGameRunning, HostID, PlayerName])

    return (
        <div>
            {waitForHost && (
                <h1>Waiting for Host to start</h1>
            )}

            {clientGameRunning && (
                <div>
                    <h1>{PlayerName}</h1>
                    <h2>{gameStateMessage}</h2>
                </div>
            )}

        </div>
    );
};

export default NFC;
