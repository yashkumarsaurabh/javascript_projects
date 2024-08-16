//To Run this program for other test cases you need to do following changes
//1. Change mazeGrid according to obstacles
//2. Change grid-template-columns: repeat(row, 40px) and
//      grid-template-rows: repeat(column, 40px) properties in css file
//      accoding to row and column in mazeGrid.
//3. Run the code and test.

const maze = document.getElementById('maze');
const startStopButton = document.getElementById('start-stop-button');
let isRunning = false;
let ratPosition = { row: 0, col: 0 };
let pathStack = [];
let visited = [];
let intervalId;

// Maze grid (1 for space, 0 for obstacles)
const mazeGrid = [
    [1, 1, 0, 1, 1],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1]
]

//Create Maze and set data of div element (like --> data-row and data-col)
function createMaze() {
    maze.innerHTML = '';
    for (let row = 0; row < mazeGrid.length; row++) {
        visited[row] = [];
        for (let col = 0; col < mazeGrid[0].length; col++) {
            visited[row][col] = false;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (mazeGrid[row][col] === 1) {
                cell.classList.add('empty');
            } else if (mazeGrid[row][col] === 0) {
                cell.classList.add('block');
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            maze.appendChild(cell);
        }
    }
    updateRatPosition();
}

function updateRatPosition() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('rat');
        if (cell.dataset.row == ratPosition.row && cell.dataset.col == ratPosition.col) {
            cell.classList.add('rat');
        }
    });
}

function moveRat() {
    if (ratPosition.row === mazeGrid.length-1 && ratPosition.col === mazeGrid[0].length-1) {
        clearInterval(intervalId);
        startStopButton.textContent = 'Start';
        alert("Victory, Happy Independence day, Rat!!!");
        return;
    }

    visited[ratPosition.row][ratPosition.col] = true;

    const directions = [
        { rowOffset: 1, colOffset: 0 },  // Down Move
        { rowOffset: 0, colOffset: 1 },  // Right Move
        { rowOffset: 0, colOffset: -1 }, // Left Move
        { rowOffset: -1, colOffset: 0 }  // Up Move
    ];

    let moved = false;

    for (let dir of directions) {
        const newRow = ratPosition.row + dir.rowOffset;
        const newCol = ratPosition.col + dir.colOffset;

        if (
            newRow >= 0 && newRow < mazeGrid.length &&
            newCol >= 0 && newCol < mazeGrid[0].length &&
            mazeGrid[newRow][newCol] === 1 &&
            !visited[newRow][newCol]
        ) {
            pathStack.push({ row: ratPosition.row, col: ratPosition.col });
            ratPosition.row = newRow;
            ratPosition.col = newCol;
            updateRatPosition();
            moved = true;
            break;
        }
    }

    if (!moved && pathStack.length > 0) {
        const lastPosition = pathStack.pop();
        ratPosition.row = lastPosition.row;
        ratPosition.col = lastPosition.col;
        moveRat();  // Recursive call to continue finding the path
    }
}

function startStopRat() {
    if (isRunning) {
        clearInterval(intervalId);
        startStopButton.textContent = 'Start';
    } else {
        intervalId = setInterval(moveRat, 2000);
        startStopButton.textContent = 'Stop';
    }
    isRunning = !isRunning;
}

startStopButton.addEventListener('click', startStopRat);
createMaze();
