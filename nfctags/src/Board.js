import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';
import Sound from 'react-sound'
import Music from './Assets/Kahoot.mp3'

const Board = () => {

    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])
    const [gameStateMessage, setGameStateMessage] = useState(0)
    const [roomCode, setRoomCode] = useState("")
    const [HostRoomUi, setHostRoomUi] = useState(true)
    const [WaitForPlayers, setWaitForPlayers] = useState(false)
    const [GameRunning, setGameRunning] = useState(false)
    const [playSound, setPlaySound] = useState(false)

    const createRoom = () => {
        setHostRoomUi(false)
        setWaitForPlayers(true)
        setPlaySound(true)
        socket.emit("host", roomCode)
    }

    console.log(roomCode)

    const startGame = () => {
        setWaitForPlayers(false)
        setGameRunning(true)
        socket.emit("startGame", roomCode)
    }

    const renderCell = (cellValue) => {

        return (
            <div className={`tile ${cellValue.type}`}>
                <div className='tile-number'>{cellValue.tile}</div>
                <div className='tile-players-container'>
                    {cellValue.playerinTile.length > 0 && cellValue.playerinTile.map((player) => {
                        return <div className={`player-${player.PlayerNumber}`}></div>
                    })}
                </div>
            </div>
        );
    };

    const renderGameBoard = () => {
        return gameBoard.map((row, rowIndex) => (

            <div key={rowIndex} className={'board-row'}>
                {rowIndex % 2 === 0 ? row.map((cellValue) => renderCell(cellValue)) : [...row].reverse().map((cellValue) => renderCell(cellValue))}
            </div>
        ));
    };

    useEffect(() => {
        function onDisconnect() {
            console.log("kisonnected")
        }
        function onJoin() {
            console.log("connected")
        }

        socket.on("disconnect", onDisconnect)
        socket.on("connect", onJoin)
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => setGameBoard(map))
        socket.on("message", (message) => setGameStateMessage(message))

        console.log(players)
        console.log(gameBoard)

        return () => {
            socket.off("disconnect", onDisconnect);
            socket.off("connect", onJoin)
        }

    }, [players, gameBoard, gameStateMessage, roomCode])

    return (
        <div className='BoardContainer'>

            <Sound url={Music} autoLoad={true} playStatus={playSound ? "PLAYING" : "STOPPED"}
                playFromPosition={0}
                onLoad={() => setPlaySound(false)}
            />


            {HostRoomUi && (
                <div>
                    <h1>Host</h1>
                    <input type='text' onChange={e => setRoomCode(e.target.value)} ></input>
                    <button onClick={createRoom}>Host Room</button>
                </div>


            )}



            {WaitForPlayers && (
                <div>
                    <h1>{"Room Code:" + roomCode}</h1>

                    <h1>Waiting for Players</h1>

                    <div>
                        {players.length > 0 && players.map((ekte) => {
                            return <p>{ekte.Name}</p>
                        })}
                    </div>


                    <button onClick={startGame}> Start Game </button>
                </div>
            )}

            {GameRunning && (
                <div>

                    <div className="game-board">
                        {gameBoard.length > 0 && renderGameBoard()}
                    </div>

                </div>
            )}

        </div>
    );
};

export default Board;
