import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';

import { useParams } from 'react-router-dom';


const NFC = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)

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
        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
            socket.off("message", (message) => setGameStateMessage(message))
            //socket.off("clientResponse", clientResponse)

        }

    }, [HostID, PlayerName, gameStateMessage])

    return (
        <div>


            <div>
                <h1>{PlayerName}</h1>
                <h2>{gameStateMessage}</h2>
            </div>


        </div>
    );
};

export default NFC;
