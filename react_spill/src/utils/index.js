export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Define block shapes and their rotations as arrays.
export const shapes = [
    // none
    [[[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]],

    // I
    [[[0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]]],

    // T
    [[[0, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]]],

    // L
    [[[0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0]],

    [[1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]],

    [[0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]]],

    // J
    [[[1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]],

    [[0, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]]],

    // Z
    [[[0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]],

    [[0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]]],

    // S
    [[[0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]],

    [[0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]]],

    // O
    [[[0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]]
]

// Random Shape
export const randomShape = () => {
    return random(1, shapes.length - 1)
}

// Return the default state for the game
export const defaultState = () => {
    return {
        // Create an empty grid
        grid: gridDefault(),
        // Get a new random shape
        shape: randomShape(),
        // set rotation of the shape to 0
        rotation: 0,
        // set the 'x' position of the shape to 5 and y to -4, which puts the shape in the center of the grid, above the top
        x: 5,
        y: -4,
        // set the index of the next shape to a new random shape
        nextShape: randomShape(),
        // Tell the game that it's currently running
        isRunning: true,
        // Set the score to 0
        score: 0,
        // Set the default speed
        speed: 1000,
        // Game isn't over yet
        gameOver: false
    }
}

// Returns the default grid
export const gridDefault = () => {
    const rows = 18
    const cols = 10
    const array = []

    // Fill array with 18 arrays each containing
    // 10 zeros (0)
    for (let row = 0; row < rows; row++) {
        array.push([])
        for (let col = 0; col < cols; col++) {
            array[row].push(0)
        }
    }

    return array
}