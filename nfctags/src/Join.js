import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Join = () => {

    const [roomCode, setRoomCode] = useState("")
    const [PlayerName, setPlayerName] = useState("")
    const navigate = useNavigate();

    function JoinGame() {
        navigate("/player/" + PlayerName + "/" + roomCode)
    }

    return (
        <div>
            <h1>Room Code</h1>
            <input type='text' onChange={e => setRoomCode(e.target.value)} ></input>

            <h1>Player Name</h1>
            <input type='text' onChange={e => setPlayerName(e.target.value)}></input>
            <button onClick={JoinGame}>join</button>
        </div>
    );
};

export default Join;
