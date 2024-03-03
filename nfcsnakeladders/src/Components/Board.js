
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../App';
import Sound from 'react-sound'
import Music from '../Assets/Kahoot.mp3'
//import { useMemo } from 'react';
import diceImg from '../Assets/dice.png';
import ConfettiExplosion from 'react-confetti-explosion';
import ladder from '../Assets/ladder.png'
import snake from '../Assets/snake.png'
import emptyDice from '../Assets/diceEmpty.png'
import dice1 from '../Assets/dice1.png'
import dice2 from '../Assets/dice2.png'
import dice3 from '../Assets/dice3.png'
import dice4 from '../Assets/dice4.png'
import dice5 from '../Assets/dice5.png'
import dice6 from '../Assets/dice6.png'


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
    const [diceDisplay, setDiceDisplay] = useState()

    const createRoom = () => {
        setHostRoomUi(false)
        setWaitForPlayers(true)
        setPlaySound(true)
        socket.emit("host", { RoomCode: roomCode, max: maxPlayers, mode: gameMode, speed: gameSpeed })

        if (gameMode === "NFCmode") {
            startGame()
        }
    }



    const startGame = () => {


        if ((players.length < maxPlayers || !canJoin) && !(gameMode === "NFCmode")) {
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
            <div id={`tile-${cellValue.tile}`} style={cellValue.tile % 2 === 0 ? { backgroundColor: "#cfd1cf" } : { backgroundColor: "white" }} className={`tile ${cellValue.type}`}>
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
        socket.on("playerWin", (winner) => handleWinner(winner))
        socket.on("updatePlayers", (player) => setPlayers(player))
        socket.on("renderBoard", (map) => {
            setGameBoard(map);
        })
        socket.on("message", (messagedata) => {
            setGameStateMessage(messagedata.message)

            changeDiceDisplay(messagedata.data.dice)
        })

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

    }, [players, gameBoard, diceDisplay, gameStateMessage, roomCode, GameRunning, width, hostMessage, gameMode, maxPlayers, gameSpeed])

    return (
        <div className='BoardContainer'>

            <Sound url={Music} autoLoad={true} playStatus={playSound ? "PLAYING" : "STOPPED"}
                playFromPosition={0}
                onLoad={() => setPlaySound(false)}
            />

            {HostRoomUi && (
                <div className='HostUI'>
                    <h2 for="RoomCode">Host Room</h2>

                    <label for="RoomCode">Room Code</label>
                    <input type='text' className="RoomCode" onChange={e => setRoomCode(e.target.value)} ></input>

                    <label for="gameSpeed">Game Speed</label>
                    <input type="range" className='gameSpeed' min="50" max="1000" step={50} value={gameSpeed} onChange={e => setGameSpeed(e.target.value)}></input>

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

                    <label for="maxplayer">Max Players</label>
                    <select id="maxplayer" value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)}>
                        <option value={1}>1</option>
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
                <div className='waitforplayers'>
                    <h1>Room Code: {roomCode}</h1>

                    <h2>Waiting for Players</h2>

                    <h2>{players.length + "/" + maxPlayers}</h2>

                    <div className='PlayersWaiting'>

                        {players.length > 0 && players.map((ekte) => {
                            return <p className={`name-${ekte.PlayerNumber}`}>{ekte.Name}</p>
                        })}
                    </div>

                    <div className='StartButtons'>

                        <button onClick={startGame}> Start Game </button>


                        <button onClick={() => window.location.reload()}> Go back </button>

                    </div>

                    <h2>{hostMessage}</h2>

                </div>
            )}

            {playerwin &&

                <div className='winscreen'>
                    {isExploding && <ConfettiExplosion particleCount={500} duration={5000} />}
                    <h1 className='player-win'>{playerwinName} is win</h1>
                </div>
            }

            {GameRunning && (
                <div className='game-running'>

                    <div className="game-board">
                        {gameBoard.length > 0 && renderGameBoard()}
                        {connections}
                    </div>

                    <div className='game-MessageBoard'>
                        <div className='eventBoard'>
                            <p>{gameStateMessage}</p>
                            <img alt='dice' style={{ width: "25%" }} src={diceDisplay}></img>
                        </div>

                        <div className='PlayerMainText'>{roomCode}</div>

                        <div className='PlayerList'>
                            <div className='PlayersGrid'>
                                {players.length > 0 && players.map((ekte) => {
                                    return <div className='PlayerInList'>
                                        <p className={`name-${ekte.PlayerNumber}`}>{ekte.Name}</p>
                                        {ekte.Turn && <img alt="skibidi" className='dice' src={diceImg}></img>}
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
