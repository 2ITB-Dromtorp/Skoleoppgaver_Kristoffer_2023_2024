import { useState } from "react"

export function GridBoard() {

    let initboard = []
    for (let col = 0; col < 10; col++) {
        initboard.push([])
        for (let row = 0; row < 10; row++) {
            initboard[col].push("empty")
        }
    }

    const [rows, setRows] = useState(initboard)
    const [snake, setSnake] = useState({ x: 1, y: 1 })

    const displaySnake = () => {
        const newRows = rows;
        snake.forEach(cell => { newRows[cell.x][cell.y] = 'snakeBlock'; })
        setRows(newRows);
    }

    const displayRows = rows.map(row => <li>
        {row.map(e => {
            switch (e) {
                case "empty":
                    return <p>[ ]</p>
                case "snakeBlock":
                    return <p>[X]</p>
            }
        })}
    </li>)

    return (
        <div>
            {displayRows}
        </div>
    )
}