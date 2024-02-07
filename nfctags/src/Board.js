
import { useEffect } from 'react';
import { socket } from './App';

const Board = () => {

    useEffect(() => {
        function onJoin() {
            console.log("konnekted")
        }
        function onDisconnect() {
            console.log("kisonnected")
        }

        socket.on("connect", onJoin)
        socket.on("disconnect", onDisconnect)

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
        }

    }, [])

    return (
        <></>
    );
};

export default Board;
