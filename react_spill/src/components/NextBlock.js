import React from 'react'
import GridSquare from './GridSquare'

// Draws the "next" block view showing the next block to drop
export default function NextBlock(props) {

    const box = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    // Map the block to the grid
    const grid = box.map((rowArray, row) => {
        return rowArray.map((square, col) => {
            return <GridSquare key={`${row}${col}`} color={square} />
        })
    })

    console.log(grid)

    return (
        <div className="next-block">
            {grid}
        </div>
    )
}