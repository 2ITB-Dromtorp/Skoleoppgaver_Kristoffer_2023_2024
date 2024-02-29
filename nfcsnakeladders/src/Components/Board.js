
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';
import Sound from 'react-sound'
import Music from '../Assets/Kahoot.mp3'
//import { useMemo } from 'react';
import dice from '../Assets/dice.png';
import ConfettiExplosion from 'react-confetti-explosion';
import Confetti from 'react-confetti'
import ladder from '../Assets/ladder.png'
import snake from '../Assets/snake.png'
import Player from './Player';

const Board = () => {

    const [connections, setConnections] = useState([]);

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
    const [width, setWidth] = useState(window.innerWidth);
    const [hostMessage, setHostMessage] = useState("")


    const createRoom = () => {
        setHostRoomUi(false)
        setWaitForPlayers(true)
        setPlaySound(true)
        socket.emit("host", { RoomCode: roomCode, max: maxPlayers, mode: gameMode, speed: gameSpeed })

        if (gameMode === "NFCmode") {
            startGame()
        }
    }

    console.log(roomCode)

    const startGame = () => {


        if (players.length < 2) {
            setHostMessage("Not Enough Players")
            return
        }

        setWaitForPlayers(false)
        setGameRunning(true)
        
        setPlaySound(false)



        socket.emit("startGame", { RoomCode: roomCode, canjoin: canJoin })

    }




    const renderCell = (cellValue, index) => {

        /*let showPosition = false

        if (cellValue.position !== cellValue.tile) {
            showPosition = true
        }*/


        return (
            <div id={`tile-${cellValue.tile}`} style={cellValue.tile % 2 === 0 ? {backgroundColor: "#cfd1cf"} : {backgroundColor: "white"}} className={`tile ${cellValue.type}`}>
                <div className='cell-info'>
                    <div className='tile-number'>{cellValue.tile}</div>

                    {/*{showPosition && (<div className='position-number'>{cellValue.position}</div>)}*/}
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
                {rowIndex % 2 === 0 ? row.map((cellValue, index) => renderCell(cellValue, index)) : [...row].reverse().map((cellValue, index) => renderCell(cellValue, index))}
            </div>
        ));
    };

    const stopGame = () => {
        socket.emit("removeHost", roomCode)
        window.location.reload()
    }

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

        const getOffset = (el) => {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left,
                top: rect.top,
                width: rect.width || el.offsetWidth,
                height: rect.height || el.offsetHeight
            };
        }


        const connect = (div1, div2, type, thickness) => {
            const off1 = getOffset(div1);
            const off2 = getOffset(div2);

            const cx1 = off1.left + off1.width / 2;
            const cy1 = off1.top + off1.height / 2;
            const cx2 = off2.left + off2.width / 2;
            const cy2 = off2.top + off2.height / 2;

            const length = Math.sqrt(((cx2 - cx1) * (cx2 - cx1)) + ((cy2 - cy1) * (cy2 - cy1)));
            const angle = Math.atan2(cy2 - cy1, cx2 - cx1) * (180 / Math.PI);

            const lineCenterX = (cx1 + cx2) / 2;
            const lineCenterY = (cy1 + cy2) / 2;

            let image 

            if (type === "snake") {
                image = snake
            } else if (type === "ladder") {
                image = ladder

            }


            return (
                <div id="line" style={{
                    padding: "0px",
                    margin: "0px",
                    height: thickness + "px",
                    lineHeight: "1px",
                    position: "absolute",
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    left: lineCenterX - length / 2 + "px",
                    top: lineCenterY - thickness / 2 + "px",
                    width: length + "px",
                    transform: "rotate(" + angle + "deg)",

                }} />
            );
        }

        const connectSnakesAndLadders = () => {
            console.log("test")
            const newconnections = [];

            gameBoard.forEach(row => {
                row.forEach(cell => {
                    if (cell.type === "snake" || cell.type === "ladder") {
                        const endTile = document.getElementById(`tile-${cell.position}`);
                        const startTile = document.getElementById(`tile-${cell.tile}`);
                        if (endTile && startTile) {
                            newconnections.push(connect(startTile, endTile, cell.type, 40));
                        }
                    }
                });
            });

            setConnections(newconnections);
        }

        socket.on("connect", onJoin)
        socket.on("playerWin", (winner) => handleWinner(winner))
        socket.on("updatePlayers", (player) => {
            setPlayers(player)
            setHostMessage(player.Name + " joined the room")
        })
        socket.on("renderBoard", (map) => {
            setGameBoard(map);
            // Call connectSnakesAndLadders here if the game has started
        })
        socket.on("message", (message) => setGameStateMessage(message))

        console.log(players)
        console.log(gameBoard)

        const handleResize = () => {
            setWidth(window.innerWidth);
            connectSnakesAndLadders();
        };

        window.addEventListener('resize', handleResize);


        connectSnakesAndLadders();



        return () => {
            //socket.off("disconnect", onDisconnect);
            socket.off("connect", onJoin)
            window.removeEventListener('resize', handleResize);

        }

    }, [players, gameBoard, gameStateMessage, roomCode, GameRunning, width, hostMessage, gameMode, maxPlayers, gameSpeed])

    return (
        <div className='BoardContainer'>

            <Sound url={Music} autoLoad={true} playStatus={playSound ? "PLAYING" : "STOPPED"}
                playFromPosition={0}
                onLoad={() => setPlaySound(false)}
            />

            {HostRoomUi && (
                <div className='HostUI'>
                    <label for="RoomCode">Host Room</label>
                    <input type='text' className="RoomCode" onChange={e => setRoomCode(e.target.value)} ></input>

                    <label for="gameSpeed">Game Speed</label>
                    <input type="range" className='gameSpeed'  min="50" max="1000" step={50} value={gameSpeed} onChange={e => setGameSpeed(e.target.value)}></input>

                    <label for="Mode">Game Mode</label>
                    <select id="Mode" value={gameMode} onChange={e => setGameMode(e.target.value)}>
                        <option value="normal">Normal</option>
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

                    <h2>{players.length + "/" + maxPlayers}</h2>

                    <div>

                        {players.length > 0 && players.map((ekte) => {
                            return <p>{ekte.Name}</p>
                        })}
                    </div>

                    <button onClick={startGame}> Start Game </button>

                    <h2>{hostMessage}</h2>
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
                        {connections}
                    </div>

                    <div className='game-MessageBoard'>
                        <div className='eventBoard'>{gameStateMessage}</div>

                        <div className='PlayerList'>
                            <h1>Players:</h1>
                            <div>

                                {players.length > 0 && players.map((ekte) => {
                                    return <div className='PlayerInList'>
                                        <p className={`name-${ekte.PlayerNumber}`}>{ekte.Name}</p>
                                        {ekte.Turn && <img alt="skibidi" className='dice' src={dice}></img>}
                                    </div>
                                })}

                            </div>
                        </div>

                        <button onClick={stopGame}>Leave Game</button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Board;
