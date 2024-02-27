
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';
import Sound from 'react-sound'
import Music from '../Assets/Kahoot.mp3'
//import { useMemo } from 'react';
import dice from '../Assets/dice.png';
import ConfettiExplosion from 'react-confetti-explosion';
import Confetti from 'react-confetti'


const Board = () => {

    const [players, setPlayers] = useState([])
    const [gameBoard, setGameBoard] = useState([])
    const [gameStateMessage, setGameStateMessage] = useState()
    const [roomCode, setRoomCode] = useState("")
    const [HostRoomUi, setHostRoomUi] = useState(true)
    const [WaitForPlayers, setWaitForPlayers] = useState(false)
    const [GameRunning, setGameRunning] = useState(false)
    const [playSound, setPlaySound] = useState(false)
    const [gameSpeed, setGameSpeed] = useState(300)
    const [gameMode, setGameMode] = useState("normal");
    const [isExploding, setIsExploding] = useState(false);
    const [playerwin, setPlayerWin] = useState(false)
    const [playerwinName, setPlayerWinName] = useState("")
    const [maxPlayers, setMaxPlayers] = useState(2)
    const [canJoin, setCanJoin] = useState(true)

    const createRoom = () => {
        setHostRoomUi(false)
        setWaitForPlayers(true)
        setPlaySound(true)
        socket.emit("host", {RoomCode: roomCode, max: maxPlayers, mode: gameMode, speed: gameSpeed})

        if (gameMode === "NFCmode") {
            startGame()
        }
    }

    console.log(roomCode)

    const startGame = () => {
        setWaitForPlayers(false)
        setGameRunning(true)
        setPlaySound(false)
        socket.emit("startGame", { RoomCode: roomCode, canjoin: canJoin})
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

    function handleWinner(player) {
        setGameStateMessage(player + " is the winner")
        setGameRunning(false)
        setIsExploding(true)
        setPlayerWin(true)
        setPlayerWinName(player)
    }

    useEffect(() => {
        function onJoin() {
            console.log("connected")
        }

        //socket.on("disconnect", onDisconnect)
        socket.on("connect", onJoin)
        socket.on("playerWin", (winner) => handleWinner(winner))
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => setGameBoard(map))
        socket.on("message", (message) => setGameStateMessage(message))

        console.log(players)
        console.log(gameBoard)

        return () => {
            //socket.off("disconnect", onDisconnect);
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
                    <input type="range" min="50" max="1000" value={gameSpeed} onChange={e => setGameSpeed(e.target.value)}></input>


                    <label for="Mode">Game Mode</label>
                    <select id="Mode" value={gameMode} onChange={e => setGameMode(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="randomized">Randomized</option>
                        <option value="NFCmode">NFC Mode</option>
                    </select>

                    <label for="CanJoin">Can Join During Game?</label>
                    <select id="CanJoin" value={canJoin} onChange={e => setCanJoin(e.target.value)}>
                        <option value={true}>yes</option>
                        <option value={false}>no</option>
                    </select>

                    <label for="maxplayer">Max Player</label>
                    <select id="maxplayer" value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)}>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
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

            {playerwin &&

                <div className='winscreen'>
                    {isExploding && <ConfettiExplosion particleCount={500} duration={5000} />}
                    <Confetti />
                    <h1>{playerwinName} is win</h1>
                </div>
            }

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
                                        <p>{ekte.Name}</p>
                                        {ekte.Turn && <img className='dice' src={dice}></img>}
                                    </div>
                                })}

                            </div>
                        </div>

                        <button>Leave Game</button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Board;
