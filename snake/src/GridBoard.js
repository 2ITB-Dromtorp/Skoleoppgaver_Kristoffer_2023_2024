import { useEffect, useState } from "react"
import { useRef } from 'react';

export function GridBoard() {

    let width = 10

    let height = 10

    let initboard = []
    for (let col = 0; col < height; col++) {
        initboard.push([])
        for (let row = 0; row < width; row++) {
            initboard[col].push("empty")
        }
    }

    const [rows, setRows] = useState(initboard)
    const [snake, setSnake] = useState([{ x: 0, y: 0 }])

    const randomPosition = () => { const position = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) }; return position; }
    const [food, setFood] = useState(randomPosition);

    const displaySnake = () => {
        const newRows = rows;
        snake.forEach(cell => {

            newRows[cell.x][cell.y] = 'snakeBlock';
        });

        newRows[food.x][food.y] = "food";
        setRows(newRows);
    }

    const changeDirectionWithKeys = (e) => {
        var { keyCode } = e;
        switch (keyCode) {
            case 37:
                setDirection("left")
                break;
            case 38:
                setDirection("top")
                break;
            case 39:
                setDirection("right")
                break;
            case 40:
                setDirection("bottom")
                break;
            default:
                break;
        }
    }

    document.addEventListener("keydown", changeDirectionWithKeys, false)

    const [direction, setDirection] = useState("right");
    const moveSnake = () => {
        const newSnake = [];

        if (snake[0].x === food.x && snake[0].y === food.y) {
            setFood(randomPosition)
        } else {
            newSnake.pop();
        }

        switch (direction) {
            case "right":
                newSnake.push({ x: snake[0].x, y: (snake[0].y + 1) % width })
                break;
            case "left":
                newSnake.push({ x: snake[0].x, y: (snake[0].y - 1) % width })
                break;
            case "top":
                newSnake.push({ x: (snake[0].x - 1) % height, y: snake[0].y })
                break;
            case "bottom":
                newSnake.push({ x: (snake[0].x + 1) % height, y: snake[0].y })
        }
        if (snake.length !== 1) {
            snake.forEach(cell => {
                newSnake.push(cell)

            })
        }

        setSnake(newSnake);
        displaySnake();
    }

    const displayRows = rows.map(row => <li>
        {row.map(e => {
            switch (e) {
                case "empty":
                    return <p>[  ]</p>
                case "snakeBlock":
                    return <p>[X]</p>
                case "food":
                    return <p>[O]</p>
            }
        })}
    </li>)

    function useInterval(callback, delay) { const savedCallback = useRef(); useEffect(() => { savedCallback.current = callback; }, [callback]); useEffect(() => { function tick() { savedCallback.current(); } if (delay !== null) { let id = setInterval(tick, delay); return () => clearInterval(id); } }, [delay]); }

    useInterval(moveSnake, 250);

    return (
        <div>
            {displayRows}
        </div>
    )


}

