import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';
import logo from '../Assets/gameLogo.png'
import emptyDice from '../Assets/diceEmpty.png'
import dice1 from '../Assets/dice1.png'
import dice2 from '../Assets/dice2.png'
import dice3 from '../Assets/dice3.png'
import dice4 from '../Assets/dice4.png'
import dice5 from '../Assets/dice5.png'
import dice6 from '../Assets/dice6.png'


const Player = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [roomCode, setRoomCode] = useState("")
    const [PlayerName, setPlayerName] = useState("")
    const [showJoinRoomUI, setShowJoinRoomUI] = useState(true);
    const [waitForHost, setWaitForHost] = useState(false)
    const [clientGameRunning, setclientGameRunning] = useState(false);
    const [error, setError] = useState(false)
    const [diceDisplay, setDiceDisplay] = useState()
    const [currentPlayer, setCurrentPlayer] = useState({})
    const handleJoinButtonClick = () => {

        setShowJoinRoomUI(false); // Hide the JoinRoomUI component
        setWaitForHost(true)
        setError(false)

        socket.emit("PlayerJoin", { Player: PlayerName, RoomCode: roomCode });
    };

    const handleLeave = () => {
        socket.emit("LeaveGame", { Player: PlayerName, RoomCode: roomCode })
        window.location.reload()
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

        function handleClientMessage(message) {

            if (message === "Room dosen't exist" || message === "Player already has that name") {
                setShowJoinRoomUI(true)
                setWaitForHost(false)
                setError(true)
                setGameStateMessage(message)

            } else {
                setGameStateMessage(message)
            }

        }

        function changeDiceDisplay(dice) {
            switch (dice) {
                case 0:
                    setDiceDisplay(emptyDice)
                    break;
                case 1:
                    setDiceDisplay(dice1)
                    break;
                case 2:
                    setDiceDisplay(dice2)
                    break;
                case 3:
                    setDiceDisplay(dice3)
                    break;
                case 4:
                    setDiceDisplay(dice4)
                    break;
                case 5:
                    setDiceDisplay(dice5)
                    break;
                case 6:
                    setDiceDisplay(dice6)
                    break;
                default:
                    setDiceDisplay(emptyDice)
            }
        }

        socket.on("connect", onJoin)
        socket.on("disconnect", onLeave)
        socket.on("message", (data) => {
            if (data.data.name === PlayerName) {
                setGameStateMessage("Your turn")
            } else {
                setGameStateMessage(data.message)
            }

            changeDiceDisplay(data.data.dice)
            setCurrentPlayer(data.data.player)
        })
        socket.on("clientStart", () => setclientGameRunning(true))
        socket.on("clientMessage", (clientmessage) => handleClientMessage(clientmessage))
        socket.on("hostisgone", () => window.location.reload())

        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onLeave)
            socket.off("message", (message) => setGameStateMessage(message))
            socket.off("clientStart", () => setclientGameRunning(true))

            socket.off("clientMessage", (clientmessage) => setGameStateMessage(clientmessage))

        }

    }, [roomCode, PlayerName, clientGameRunning])

    return (
        <div className='PlayerContainer'>

            {showJoinRoomUI && (
                <div className='JoinUI'>

                    <img alt='logo' style={{ width: "40%" }} src={logo}></img>

                    <div className='JoinUInner'>
                        <h1>Room Code</h1>
                        <input type='text' onChange={e => setRoomCode(e.target.value)} />

                        <h1>Player Name</h1>
                        <input type='text' pattern="[A-Za-z]{1,25}" maxLength="10" onChange={e => setPlayerName(e.target.value)} />

                        <button onClick={handleJoinButtonClick}>join</button>

                        {error && <h2>{gameStateMessage}</h2>}
                    </div>

                </div>
            )}

            {(waitForHost && !clientGameRunning) && (
                <div className='JoinUI'>

                    <h1>Waiting for Host to start</h1>

                </div>
            )}

            {clientGameRunning && (
                <div className='JoinUI'>
                    <h1>Name: {PlayerName}</h1>
                    <h2 className={`name-${currentPlayer.PlayerNumber}`}>{gameStateMessage}</h2>
                    <button onClick={rollDice}>Roll Dice</button>
                    <img alt="Dice" style={{ width: "200px", height: "200px" }} src={diceDisplay}></img>
                    <button onClick={handleLeave}>Leave</button>
                </div>
            )}


        </div>
    );
};

export default Player;
