import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './App';
import Sound from 'react-sound'
import Music from './Assets/Kahoot.mp3'
//import { useMemo } from 'react';

const Board = () => {

    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])
    const [gameStateMessage, setGameStateMessage] = useState()
    const [roomCode, setRoomCode] = useState("")
    const [HostRoomUi, setHostRoomUi] = useState(true)
    const [WaitForPlayers, setWaitForPlayers] = useState(false)
    const [GameRunning, setGameRunning] = useState(false)
    const [playSound, setPlaySound] = useState(false)
    const [gameSpeed, setGameSpeed] = useState(400)
    const [gameMode, setGameMode] = useState("normal"); // Declare a state variable...


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
        socket.emit("startGame", { RoomCode: roomCode, speed: gameSpeed, mode: gameMode })
    }

    const renderCell = (cellValue) => {

        let showPosition = false

        if (cellValue.position !== cellValue.tile) {
            showPosition = true
        }

        return (
            <div className={`tile ${cellValue.type}`}>
                <div className='cell-info'>
                    <div className='tile-number'>{cellValue.tile}</div>

                    {showPosition && (<div className='position-number'>{cellValue.position}</div>)}
                </div>

                <div className='tile-players-container'>
                    {cellValue.playerinTile.length > 0 && cellValue.playerinTile.map((player) => {
                        return <div className={`player-${player.PlayerNumber}`}>
                        </div>
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
                    <label for="RoomCode">Host Room</label>
                    <input type='text' id="RoomCode" onChange={e => setRoomCode(e.target.value)} ></input>

                    <label for="gameSpeed">Game Speed</label>
                    <input type='text' id="gameSpeed" defaultValue={gameSpeed} onChange={e => setGameSpeed(e.target.value)} ></input>

                    <label for="Mode">Game Mode</label>
                    <select id="Mode" value={gameMode} onChange={e => setGameMode(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="randomized">Randomized</option>
                        <option value="advanced">Advanced</option>
                        <option value="NFCmode">NFC Mode</option>
                    </select>

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
                <div className='game-running'>

                    <div className="game-board">
                        {gameBoard.length > 0 && renderGameBoard()}
                    </div>

                    <div className='game-MessageBoard'>
                        <h1>{gameStateMessage}</h1>


                        <div className='PlayerList'>
                            <h1>Players:</h1>
                            <div>

                                {players.length > 0 && players.map((ekte) => {
                                    return <div className='PlayerInList'>
                                        {ekte.Name}
                                    </div>
                                })}

                            </div>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Board;
