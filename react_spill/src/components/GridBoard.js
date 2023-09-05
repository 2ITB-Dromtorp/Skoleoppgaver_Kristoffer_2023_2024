import React from 'react'
import GridSquare from './GridSquare'

export default function GridBoard(props) {
    const grid = []
    for (let row = 0; row < 18; row++) {
        grid.push([])
        for (let col = 0; col < 10; col++) {
            grid[row].push(<GridSquare key={`${col}${row}`} color={props} />)
        }

    }
    return (
        <div className='grid-board'>
            {grid}
        </div>
    )
}