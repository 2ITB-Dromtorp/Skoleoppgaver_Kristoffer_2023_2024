import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Host = () => {

    const [roomCode, setRoomCode] = useState("")
    const navigate = useNavigate();


    const createRoom = () => {
        navigate("/board/" + roomCode)
    }

    return (
        <div>
            <h1>Host</h1>
            <input type='text' onChange={e => setRoomCode(e.target.value)} ></input>
            <button onClick={createRoom}>Host Room</button>
        </div>
    )
}

export default Host;
