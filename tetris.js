const row = 20;
const col = 10;
const player1 = 1;
const player2 = 2;
const board1 = document.getElementById('board1');
const board2 = document.getElementById('board2');
let gameOver = false;

// Player objects
const players = {
    1: {
        board: board1,
        tetrisArray: [],
        currentBlock: null,
        fallingBlock: null,
        nextBlock: null,
        blockOrientation: 0
    },
    2: {
        board: board2,
        tetrisArray: [],
        currentBlock: null,
        fallingBlock: null,
        nextBlock: null,
        blockOrientation: 0
    }
};

// Creates grid for both players
function createGrid(player) {
    const { board } = players[player];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid');
            cell.id = player + '-' + i + '-' + j;
            board.appendChild(cell);
        }
    }
}

// Creates 2D array
function setArray(player) {
    const { tetrisArray } = players[player];
    for (let i = 0; i < row; i++) {
        tetrisArray[i] = [];
        for (let j = 0; j < col; j++) {
            // 0 = empty cell
            tetrisArray[i][j] = 0;
        }
    }
}

// Displays block on top of screen
function createBlock(player) {
    const { currentBlock } = players[player];
    // Draw the currentBlock
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cellId = `${player}-${i}-${j}`;
            const cell = document.getElementById(cellId);
            if (currentBlock.some(([row, col]) => row === i && col === j)) {
                cell.classList.remove('grid');
                cell.classList.add(getBlockClass(currentBlock));
            }
        }
    }
}

// Updates array as piece is falling on board 1 = falling block, 2 = set block
function updateArray(player, isSettingBlock = false) {
    const { tetrisArray, fallingBlock } = players[player];

    // Clear the previous fallingBlock positions in the tetrisArray
    tetrisArray.forEach((row, i) =>
        row.forEach((_, j) => {
            if (tetrisArray[i][j] == 1) {
                tetrisArray[i][j] = 0;
            }
        })
    );

    // Update the tetrisArray with the fallingBlock positions (1) or set block positions (2)
    fallingBlock.forEach(([row, col]) => {
        tetrisArray[row][col] = isSettingBlock ? 2 : 1;
    });

    console.log("Player 1 Tetris Array:", JSON.stringify(players[player1]));
}

function startFalling(player) {
    if (gameOver) {
        return;
    }
    const { tetrisArray, fallingBlock } = players[player];

    // Calculate the new positions of the falling block cells
    const newPositions = fallingBlock.map(([row, col]) => [row + 1, col]);

    // Check if any of the new positions are invalid or collide with occupied cells
    const canMoveDown = newPositions.every(([newRow, newCol]) => {
        // Check if the new position is within the tetrisArray
        if (newRow >= tetrisArray.length) {
            return false;
        }

        // Check if the new position collides with a set block
        if (tetrisArray[newRow][newCol] === 2) {
            return false;
        }

        // if no collisions return true
        return true;
    });

    if (canMoveDown) {
        clearPreviousBlock(player);
        // Update the fallingBlock with the new positions
        players[player].fallingBlock = newPositions;

        // Update the game board with the new position of the falling block
        updateArray(player);
        console.log("newpos in playeraray", players[player].fallingBlock);
        renderFalling(player);

        // continue falling
        setTimeout(() => startFalling(player), 500);
    } else {
        // Block is set and cannot move
        // Update the tetrisArray with the fallingBlock position 2
        updateArray(player, true);

        // Clear the fallingBlock
        players[player].fallingBlock = null;

        // Generate a new block 
        getCurrentBlock(player);

        // Start falling for the next block after
        setTimeout(() => startFalling(player), 500);
    }
}

// Clears falling block from screen
function clearPreviousBlock(player) {
    const { fallingBlock } = players[player];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cellId = `${player}-${i}-${j}`;
            const cell = document.getElementById(cellId);
            if (fallingBlock && fallingBlock.some(([row, col]) => row === i && col === j)) {
                cell.classList.remove(getBlockClass(players[player].currentBlock));
                cell.classList.add('grid');
            }
        }
    }
}

// Renders block falling on screen.
function renderFalling(player) {
    const { fallingBlock, currentBlock } = players[player];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cellId = `${player}-${i}-${j}`;
            const cell = document.getElementById(cellId);
            if (fallingBlock.some(([row, col]) => row === i && col === j)) {
                cell.classList.remove('grid');
                cell.classList.add(getBlockClass(currentBlock));
            }
        }
    }

    // Generate a new preview block after rendering the current block
    getNextBlock(player);
}

function getBlockClass(shape) {
    if (shape === block) {
        return 'block'; // Apply the 'block' class
    }

    const shapeString = JSON.stringify(shape.sort());

    if (shapeString === JSON.stringify(lblock.sort())) {
        return 'lblock';
    } else if (shapeString === JSON.stringify(sblock.sort())) {
        return 'sblock';
    } else if (shapeString === JSON.stringify(tblock.sort())) {
        return 'tblock';
    } else if (shapeString === JSON.stringify(iblock.sort())) {
        return 'iblock';
    } else if (shapeString === JSON.stringify(jblock.sort())) {
        return 'jblock';
    } else if (shapeString === JSON.stringify(zblock.sort())) {
        return 'zblock';
    } else {
        return 'block'; // Default class
    }
}

// Define the Tetris blocks
const block = [
    [0, 4],
    [0, 5],
    [1, 4],
    [1, 5]
];

const lblock = [
    [0, 4],
    [1, 4],
    [2, 4],
    [2, 5]
];

const sblock = [
    [0, 3],
    [0, 4],
    [1, 4],
    [1, 5],
];

const tblock = [
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 5]
];

const iblock = [
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6]
];

const jblock = [
    [0, 3],
    [1, 3],
    [1, 4],
    [1, 5]
];

const zblock = [
    [0, 4],
    [0, 5],
    [1, 3],
    [1, 4]
];

// Function to render the next block in the preview container
function renderPreview(player, nextBlock) {
    const previewElement = document.getElementById(`preview${player}`);
    previewElement.innerHTML = ''; // Clear previous preview content

    // Create preview cells for the next block
    nextBlock.forEach(([row, col]) => {
        const cell = document.createElement('div');
        cell.classList.add('preview-cell');
        cell.classList.add(getBlockClass(nextBlock)); // Apply color based on block type
        cell.style.gridColumn = col + 1; // Adjust column index for CSS grid
        cell.style.gridRow = row + 1; // Adjust row index for CSS grid
        previewElement.appendChild(cell);
    });
}

// Modify getCurrentBlock to generate both falling and preview blocks
function getCurrentBlock(player) {
    const { fallingBlock, currentBlock, tetrisArray, blockOrientation } = players[player];
    const blocks = [block, lblock, sblock, tblock, iblock, jblock, zblock];
    const randomIndex = Math.floor(Math.random() * blocks.length);
    const newBlock = blocks[randomIndex];
    console.log('newBlock:', newBlock);

    players[player].currentBlock = newBlock;
    players[player].fallingBlock = newBlock;
    console.log('fallingBlock before assignment:', players[player].fallingBlock);

    // Check tetris array.
    const canFit = newBlock.every(([row, col]) => tetrisArray[row][col] !== 2);

    // Continue game
    if (canFit) {
        players[player].currentBlock = newBlock;
        players[player].fallingBlock = newBlock;
        players[player].blockOrientation = 0;
        createBlock(player);
        // Game over
    } else {
        console.log("Game over!");
        gameOver = true;
    }
    console.log("this curblock", players[player].currentBlock);
    createBlock(player);
    console.log('fallingBlock after assignment:', players[player].fallingBlock);
}

// Modify getNextBlock to generate a new preview block
function getNextBlock(player) {
    const blocks = [block, lblock, sblock, tblock, iblock, jblock, zblock];
    const randomIndex = Math.floor(Math.random() * blocks.length);
    const nextBlock = blocks[randomIndex];

    // Render the next block in the preview container
    renderPreview(player, nextBlock);
}

function moveBlockLeft(player) {
    const { fallingBlock, tetrisArray } = players[player];
    // Check for collision with end of array or set block
    const canMoveLeft = fallingBlock.every(([row, col]) => col > 0 && tetrisArray[row][col - 1] !== 2);

    if (canMoveLeft) {
        // Check for collision with end of array or set block
        clearPreviousBlock(player);
        players[player].fallingBlock = fallingBlock.map(([row, col]) => [row, col - 1]);
        renderFalling(player);
    }
}

function moveBlockRight(player) {
    const { fallingBlock, tetrisArray } = players[player];
    // Check for collision with end of array or set block
    const canMoveRight = fallingBlock.every(([row, col]) => col < 9 && tetrisArray[row][col + 1] !== 2);
    // Update piece and board
    if (canMoveRight) {
        clearPreviousBlock(player);
        players[player].fallingBlock = fallingBlock.map(([row, col]) => [row, col + 1]);
        renderFalling(player);
    }
}


function rotateBlock(player) {
    const { fallingBlock, currentBlock, tetrisArray, blockOrientation } = players[player];
    
    let offsets;
    switch (getBlockClass(currentBlock)) {
        case 'lblock':
            // Rotation logic for L-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[1, 1], [0, 0], [-1, -1], [0, -2]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                    offsets = [[1, -1], [0, 0], [-1, 1], [-2, 0]];
                    players[player].blockOrientation++;
                    break;
                case 2:
                    offsets = [[-1, -1], [0, 0], [1, 1], [0, 2]];
                    players[player].blockOrientation++;
                    break;
                case 3:
                    offsets = [[-1, 1], [0, 0], [1, -1], [2, 0]]; 
                    players[player].blockOrientation = 0;
                    break;
            }
            break;
        case 'sblock':
            // Rotation logic for S-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[-1, 1], [0, 0], [0, 1], [1, 0]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                    offsets = [[1, 1], [0, 0], [1, -1], [0, -2]];
                    players[player].blockOrientation = 0;
                    break;
            }
            break;
        case 'tblock':
            // Rotation logic for T-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[-1, 0], [0, -1], [0, 0], [0, 1]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                    offsets = [[0, -1], [-1, 0], [0, 0], [1, 0]];
                    players[player].blockOrientation++;
                    break;
                case 2:
                    offsets = [[1, 0], [0, 1], [0, 0], [0, -1]];
                    players[player].blockOrientation++;
                    break;
                case 3:
                    offsets = [[0, 1], [1, 0], [0, 0], [-1, 0]];
                    players[player].blockOrientation = 0;
                    break;
            }
            break;
        case 'iblock':
            // Rotation logic for I-block
            switch (blockOrientation) {
                case 0:
                case 2:
                    offsets = [[-1, 0], [0, 0], [1, 0], [2, 0]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                case 3:
                    offsets = [[0, -1], [0, 0], [0, 1], [0, 2]];
                    players[player].blockOrientation++;
                    break;
            }
            break;
        case 'jblock':
            // Rotation logic for J-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[1, -1], [0, 0], [-1, 1], [0, 2]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                    offsets = [[-1, -1], [0, 0], [1, 1], [2, 0]];
                    players[player].blockOrientation++;
                    break;
                case 2:
                    offsets = [[-1, 1], [0, 0], [1, -1], [0, -2]];
                    players[player].blockOrientation++;
                    break;
                case 3:
                    offsets = [[1, 1], [0, 0], [-1, -1], [-2, 0]];
                    players[player].blockOrientation = 0;
                    break;
            }
            break;
        case 'zblock':
            // Rotation logic for Z-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[-1, -1], [0, 0], [0, -1], [1, 0]];
                    players[player].blockOrientation++;
                    break;
                case 1:
                    offsets = [[1, -1], [0, 0], [1, 1], [0, 2]];
                    players[player].blockOrientation = 0;
                    break;
            }
            break;
        default:
            return;
    }
    
    const newPositions = fallingBlock.map(([row, col], index) => {
        const [rowOffset, colOffset] = offsets[index];
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        return [newRow, newCol];
    });
    
    const canRotate = newPositions.every(([newRow, newCol]) =>
        newRow >= 0 &&
        newRow < tetrisArray.length &&
        newCol >= 0 &&
        newCol < tetrisArray[0].length &&
        tetrisArray[newRow][newCol] !== 2
    );
    
    if (canRotate) {
        clearPreviousBlock(player);
        players[player].fallingBlock = newPositions;
        renderFalling(player);
    }
}








// Check arrow keys for player 1 movement
function handlePlayer1Movement(event) {
    if (event.key === 'a') {
        moveBlockLeft(player1);
    } else if (event.key === 'd') {
        moveBlockRight(player1);
    }
   
}

function handlePlayer2Movement(event) {
    if (event.key === 'ArrowLeft') {
        moveBlockLeft(player2);
    } else if (event.key === 'ArrowRight') {
        moveBlockRight(player2);
    } //else if (event.key === 'ArrowUp') {
        //rotateBlock(player2);
    //}
  
}

let score = 0;
const scoreDisplay = document.getElementById('score');

// Function to update the score
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

// Event listener for game start
document.getElementById('start-button').addEventListener('click', () => {
    setArray(player1);
    setArray(player2);
    createGrid(player1);
    createGrid(player2);
    getCurrentBlock(player1);
    getCurrentBlock(player2);
    getNextBlock(player1);
    getNextBlock(player2);
    startFalling(player1);
    startFalling(player2);
    // Event listeners for movement
    document.addEventListener('keydown', handlePlayer1Movement);
    document.addEventListener('keydown', handlePlayer2Movement);
    document.addEventListener('keydown', handlePlayer1Rotation);
    document.addEventListener('keydown', handlePlayer2Rotation);
    document.getElementById('start-overlay').classList.add('hidden');
});

// Function to handle rotation for Player 1
function handlePlayer1Rotation(event) {
    if (event.key === 'q') { // Rotate counterclockwise for Player 1
        rotateBlock(player1, 'counterclockwise');
    } else if (event.key === 'w') { // Rotate clockwise for Player 1
        rotateBlock(player1, 'clockwise');
    }
}

// Function to handle rotation for Player 2
function handlePlayer2Rotation(event) {
    if (event.key === 'ArrowDown') { // Rotate counterclockwise for Player 2
        rotateBlock(player2, 'counterclockwise');
    } else if (event.key === 'ArrowUp') { // Rotate clockwise for Player 2
        rotateBlock(player2, 'clockwise');
    }
}

