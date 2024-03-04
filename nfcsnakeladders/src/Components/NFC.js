import { useEffect } from 'react';
import { socket } from '../App';

import { useParams } from 'react-router-dom';

const NFC = () => {

    let { PlayerName, HostID } = useParams();

    useEffect(() => {

        function onJoin() {
            socket.emit("playerRoll", { Player: PlayerName, RoomCode: HostID });
        }
        socket.on("connect", onJoin)
        return () => {
            socket.off("connect", onJoin)
        }

    }, [HostID, PlayerName])

    return (
        <div className='PlayerContainer'>

            <div className='JoinUI'>

                <h1>Check the screen</h1>

            </div>

        </div>
    );
};

export default NFC;
