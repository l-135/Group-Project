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
        blockOrientation: 0,
        attackScore: 0
    },
    2: {
        board: board2,
        tetrisArray: [],
        currentBlock: null,
        fallingBlock: null,
        nextBlock: null,
        blockOrientation: 0,
        attackScore: 0
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
    const { tetrisArray, fallingBlock, currentBlock } = players[player];

    // Clear the previous fallingBlock positions in the tetrisArray
    tetrisArray.forEach((row, i) =>
        row.forEach((cell, j) => {
            if (cell === 1) {
                tetrisArray[i][j] = 0;
            }
        })
    );

    // Update the tetrisArray with the fallingBlock positions (1) or set block positions (2)
    fallingBlock.forEach(([row, col]) => {
        if (isSettingBlock){
            tetrisArray[row][col] = getBlockClass(currentBlock);
        }
        else {
            tetrisArray[row][col] = 1;
        }
    });

}

function startFalling(player) {
    if (gameOver) {
        return;
    }
    const { tetrisArray, fallingBlock } = players[player];

    // Calculate the new positions of the falling block cells
    let newPositions = fallingBlock.map(([row, col]) => [row + 1, col]);

    // Check if any of the new positions are invalid or collide with occupied cells
    const canMoveDown = newPositions.every(([newRow, newCol]) => {
        // Check if the new position is within the tetrisArray
        if (newRow >= tetrisArray.length) {
            return false;
        }

        // Check if a set block (2) is found
        if (tetrisArray[newRow][newCol] !== 0 && tetrisArray[newRow][newCol] !== 1) {
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
        renderFalling(player);

        // continue falling
        setTimeout(() => startFalling(player), 500);
    } else {
        // Block is set and cannot move
        // Update the tetrisArray with the fallingBlock position 2
        updateArray(player, true);

        checkLineBreak(player);

        // Clear the fallingBlock
        players[player].fallingBlock = null;

        // Generate a new block 
        getCurrentBlock(player);

        // Start falling for the next block after
        setTimeout(() => startFalling(player), 500);
    }
}

// Modified function to handle push down action for only the current player
function pushDown(player) {
    if (gameOver) {
        return;
    }
    const { fallingBlock } = players[player];

    // Keep track of whether the push down action should affect only the current player
    let onlyCurrentPlayer = true;

    // Check if the falling block for the current player can move down
    const { tetrisArray } = players[player];
    let newPositions = fallingBlock.map(([row, col]) => [row + 1, col]);
    const canMoveDown = newPositions.every(([newRow, newCol]) => {
        if (newRow >= tetrisArray.length || (tetrisArray[newRow][newCol] !== 0 && tetrisArray[newRow][newCol] !== 1)) {
            onlyCurrentPlayer = false;
            return false;
        }
        return true;
    });

    // If the current player's falling block can move down, apply the push down action
    if (canMoveDown && onlyCurrentPlayer) {
        clearPreviousBlock(player);
        players[player].fallingBlock = newPositions;
        updateArray(player);
        renderFalling(player);
    }
    //set block
    else{
    updateArray(player, true);
    checkLineBreak(player);
    players[player].fallingBlock = null;
    getCurrentBlock(player);
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

function updateScore(player)
{
    const { attackScore } = players[player];
    const scoreElement = document.getElementById(`score${player}`);
    scoreElement.textContent = attackScore; //update the score displayed in Html

if (attackScore >= 5)
    {
        scoreElement.syle.color = 'red';
    }
    else
    {
        scoreElement.style.color = ''; // Reset color if attackScore is less than 5
    }
}



function checkLineBreak(player){
    const {tetrisArray, attackScore} = players[player];
    linesCleared =0;
    for (let i = tetrisArray.length - 1; i >= 0; i--) {
        //checks if each cell is occupied
        const isLineBreak = tetrisArray[i].every((cell) => cell !== 0 && cell !== 1 && cell !== 'attackblock');

        if (isLineBreak) {
            // Remove the full each element from row
            tetrisArray.splice(i, 1);
            linesCleared++;
        }
    }
    // Add a new empty array for each line cleared
    for (let i = 0; i < linesCleared; i++) {
        tetrisArray.unshift(new Array(col).fill(0));
    }
    
    // Update the game board if any lines were cleared
    if (linesCleared > 0) {
        console.log("lineBroke!")
        console.log(`Player ${player} tetrisArray:`);
        console.log(JSON.stringify(players[player].tetrisArray));
        players[player].attackScore += linesCleared;
        updateScore(player);//add score
        updateBoard(player);
    }
    
}




function updateBoard(player){
    const { tetrisArray, board, } = players[player];
    // Clear current board
    board.innerHTML = '';
    console.log('Updating board with tetrisArray:', JSON.stringify(tetrisArray));


    // Redraw the game board based on the updated tetrisArray
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid');
            cell.id = `${player}-${i}-${j}`;
            //checks array to get previous block classes
            const blockClass = tetrisArray[i][j];
            console.log(`Cell (${i}, ${j}) - blockClass: ${blockClass}`);

            if (blockClass !== 0 && blockClass !== 1) {
                cell.classList.remove('grid');
                cell.classList.add(blockClass);
            }
            board.appendChild(cell);
        }
    }
}  

function addAttackLine(player) {
    const { tetrisArray } = players[player];
    //check if blocks in first row
    const topRowHasBlocks = tetrisArray[0].some((cell) => cell !== 0 && cell !==1);
    if (topRowHasBlocks) {
        // If there are blocks in the top row, end the game
        gameOver = true;
    } 
    else {

        // Remove the top row
        tetrisArray.shift();

        // Add a new row of blocks at the bottom
        const attackLine = new Array(col).fill('attackblock');
        tetrisArray.push(attackLine);

        updateBoard(player);
    }
}

function getBlockClass(shape) {
    if (shape === block) {
        return 'block'; // Apply the 'block' class
    }

    const shapeString = JSON.stringify(shape);

    if (shapeString === JSON.stringify(lblock)) {
        return 'lblock';
    } else if (shapeString === JSON.stringify(sblock)) {
        return 'sblock';
    } else if (shapeString === JSON.stringify(tblock)) {
        return 'tblock';
    } else if (shapeString === JSON.stringify(iblock)) {
        return 'iblock';
    } else if (shapeString === JSON.stringify(jblock)) {
        return 'jblock';
    } else if (shapeString === JSON.stringify(zblock)) {
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
    [0, 5],
    [0, 4],
    [1, 4],
    [1, 3]
];

// Function to render the next block in the preview container
function renderPreview(player, nextBlock) {
    const previewElement = document.getElementById(`preview${player}`);
    previewElement.innerHTML = ''; // Clear previous preview content

    [1, 3],
    [1, 4],
    [1, 5]
];

const zblock = [
    [0, 5],
    [0, 4],
    [1, 4],
    [1, 3]
];

// Function to render the next block in the preview container
function renderPreview(player, nextBlock) {
    const previewElement = document.getElementById(`preview${player}`);
    previewElement.innerHTML = ''; // Clear previous preview content

    [1, 3],
    [1, 4],
    [1, 5]
];

const zblock = [
    [0, 5],
    [0, 4],
    [1, 4],
    [1, 3]
];

// Function to render the next block in the preview container
function renderPreview(player, nextBlock) {
    const previewElement = document.getElementById(`preview${player}`);
    previewElement.innerHTML = ''; // Clear previous preview content

    [1, 3],
    [1, 4],
    [1, 5]
];

const zblock = [
    [0, 5],
    [0, 4],
    [1, 4],
    [1, 3]
];

// Function to render the next block in the preview container
function renderPreview(player, nextBlock) {
    const previewElement = document.getElementById(`preview${player}`);
    previewElement.innerHTML = ''; // Clear previous preview content

    [1, 3],
    [1, 4],
    [1, 5]
];

const zblock = [
    [0, 5],
    [0, 4],
    [1, 4],
    [1, 3]
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

    players[player].currentBlock = newBlock;
    players[player].fallingBlock = newBlock;

    // Check tetris array.
    const canFit = newBlock.every(([row, col]) => tetrisArray[row][col] === 0 || tetrisArray[row][col] === 1);

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
    createBlock(player);
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
    const canMoveLeft = fallingBlock.every(([row, col]) => col > 0 && (tetrisArray[row][col - 1] === 0 || tetrisArray[row][col - 1] === 1));

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
    const canMoveRight = fallingBlock.every(([row, col]) => col < 9 && (tetrisArray[row][col + 1] === 0 || tetrisArray[row][col + 1] === 1));
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
                    
                    break;
                case 1:
                    offsets = [[1, -1], [0, 0], [-1, 1], [-2, 0]];
                    
                    break;
                case 2:
                    offsets = [[-1, -1], [0, 0], [1, 1], [0, 2]];
                    break;
                case 3:
                    offsets = [[-1, 1], [0, 0], [1, -1], [2, 0]]; 
                    break;
            }
            break;
        case 'sblock':
            // Rotation logic for S-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[0, 2], [1, 1], [0, 0], [1, -1]];
                    break;
                case 1:
                    offsets = [[2, 0], [1, -1], [0, 0], [-1, -1]];
                    break;
                case 2:
                    offsets = [[0, -2], [-1, -1], [0, 0], [-1, 1]];
                    break;
                case 3:
                    offsets = [[-2, 0], [-1, 1], [0, 0], [1, 1]];
                    break;
            }
            break;
        case 'tblock':
            // Rotation logic for T-block 
            switch (blockOrientation) {
                case 0:
                    offsets = [[1, 1], [-1, 1], [0, 0], [1, -1]];
                    break;
                case 1:
                    offsets = [[1, -1], [1, 1], [0, 0], [-1, -1]];
                    break;
                case 2:
                    offsets = [[-1, -1], [1, -1], [0, 0], [-1, 1]];
                    break;
                case 3:
                    offsets = [[-1, 1], [-1, -1], [0, 0], [1, 1]];
                    break;
            }
            break;
        case 'iblock':
            // Rotation logic for I-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[-1, 1], [0, 0], [1, -1], [2, -2]];
                    break;
                case 1:
                    offsets = [[1, 1], [0, 0], [-1, -1], [-2, -2]];
                    break;
                case 2:
                    offsets = [[1, -1], [0, 0], [-1, 1], [-2, 2]];
                    break;
                case 3:
                    offsets = [[-1, -1], [0, 0], [1, 1], [2, 2]];
                    break;
            }
            break;
        case 'jblock':
            // Rotation logic for J-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[0, 2], [-1, 1], [0, 0], [1, -1]];
                    break;
                case 1:
                    offsets = [[2, 0], [1, 1], [0, 0], [-1, -1]];
                    break;
                case 2:
                    offsets = [[0, -2], [1, -1], [0, 0], [-1, 1]];
                    break;
                case 3:
                    offsets = [[-2, 0], [-1, -1], [0, 0], [1, 1]];
                    break;
            }
            break;
        case 'zblock':
            // Rotation logic for Z-block
            switch (blockOrientation) {
                case 0:
                    offsets = [[2, 0], [1, 1], [0, 0], [-1, 1]];
                    break;
                case 1:
                    offsets = [[0, -2], [1, -1], [0, 0], [1, 1]];
                    break;
                case 2:
                case 2:
                    offsets = [[-2, 0], [-1, -1], [0, 0], [1, -1],];
                    break;
                case 3:
                    offsets = [[0, 2], [-1, 1], [0, 0], [-1, -1]];
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
    
    //check if rotatin doesnt cause collisions
    const canRotate = newPositions.every(([newRow, newCol]) =>
        newRow >= 0 &&
        newRow < tetrisArray.length &&
        newCol >= 0 &&
        newCol < tetrisArray[0].length &&
        (tetrisArray[newRow][newCol] === 0 || tetrisArray[newRow][newCol] === 1)
    );
    
    if (canRotate) {
        players[player].blockOrientation++;
        if (players[player].blockOrientation > 3){
            players[player].blockOrientation = 0;
        }
        clearPreviousBlock(player);
        players[player].fallingBlock = newPositions;
        renderFalling(player);
    }
}
