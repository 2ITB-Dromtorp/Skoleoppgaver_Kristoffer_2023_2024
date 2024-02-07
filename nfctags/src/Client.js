
import { useEffect } from 'react';
import { socket } from './App';

const Client = () => {

    useEffect(() => {
        function onJoin() {
            console.log("konnekted")
        }
        function onDisconnect() {
            console.log("kisonnected")
        }

        const clientResponse = () => {
            socket.emit("clientResponse", 'Hello, World!');
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
            <p>ahllo</p>
            <button onClick={clientResponse}>ekte</button>
        </div>
    );
};

export default Client;
