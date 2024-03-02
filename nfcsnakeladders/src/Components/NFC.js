import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';

import { useParams } from 'react-router-dom';
import emptyDice from '../Assets/diceEmpty.png'
import dice1 from '../Assets/dice1.png'
import dice2 from '../Assets/dice2.png'
import dice3 from '../Assets/dice3.png'
import dice4 from '../Assets/dice4.png'
import dice5 from '../Assets/dice5.png'
import dice6 from '../Assets/dice6.png'

const NFC = () => {

    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [diceDisplay, setDiceDisplay] = useState()
    let { PlayerName, HostID } = useParams();

    useEffect(() => {

        function onJoin() {
            socket.emit("playerRoll", { Player: PlayerName, RoomCode: HostID });
        }
        function onDisconnect() {
            console.log("kisonnected")
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
        socket.on("disconnect", onDisconnect)
        socket.on("message", (data) => {
            if (data.data.name === PlayerName) {
                setGameStateMessage("Your turn")
            } else {
                setGameStateMessage(data.message)
            }

            changeDiceDisplay(data.data.dice)
        })
        //socket.on("clientResponse", clientResponse)
        return () => {
            socket.off("connect", onJoin)
            socket.off("disconnect", onDisconnect)
            socket.on("message", (data) => {
                if (data.data.name === PlayerName) {
                    setGameStateMessage("Your turn")
                } else {
                    setGameStateMessage(data.message)
                }
    
                changeDiceDisplay(data.data.dice)
            })

        }

    }, [HostID, PlayerName, gameStateMessage])

    return (
        <div className='PlayerContainer'>

                <h2>{gameStateMessage}</h2>
                <img alt='dice' style={{ width: "200px", height: "200px" }} src={diceDisplay}></img>

        </div>
    );
};

export default NFC;
