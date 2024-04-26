const row = 20;
const col = 10;
const tetrisArray1 = [];
const tetrisArray2 = [];
const board1 = document.getElementById('board1');
const board2 = document.getElementById('board2');

// Creates grid for both players
function createGrid(surface) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid');
            cell.id = i + '-' + j;
            surface.appendChild(cell);
        }
    }
}

// Creates 2D array
function setArray(boardArray) {
    for (let i = 0; i < row; i++) {
        boardArray[i] = [];
        for (let j = 0; j < col; j++) {
            // false = empty cell
            boardArray[i][j] = false;
        }
    }
}

function createBlock(surface, shape) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const cellId = `${i}-${j}`;
            const cell = document.getElementById(cellId);
            if (shape.some(([row, col]) => row === i && col === j)) {
                cell.classList.remove('grid');
                cell.classList.add('block');
                cell.classList.add(getBlockClass(shape)); // Add specific block class
            }
        }
    }
}


function redrawShape(surface, shape) {
  // Remove the 'block' class from all cells
  surface.querySelectorAll('.block').forEach(cell => {
      cell.classList.remove('block', 'lblock', 'sblock', 'tblock', 'iblock', 'jblock', 'zblock');
  });

  // Add the 'block' class and the specific block class to cells occupied by the falling block
  shape.forEach(([row, col]) => {
      const cellId = `${row}-${col}`;
      const cell = document.getElementById(cellId);
      cell.classList.add('block', getBlockClass(shape));
  });
}

function getBlockClass(shape) {
<<<<<<< HEAD
  if (shape === lblock) {
      return 'lblock';
  } else if (shape === sblock) {
      return 'sblock';
  } else if (shape === tblock) {
      return 'tblock';
  } else if (shape === iblock) {
      return 'iblock';
  } else if (shape === jblock) {
      return 'jblock';
  } else if (shape === zblock) {
      return 'zblock';
  } else if (shape === block) {
      return 'block';
  }
}

function updateAndRedraw(surface, shape) {
    // Check if the new position is within the grid bounds
    const canMove = shape.every(cell => {
        const newRow = cell[0] + 1;
        const newCol = cell[1];
        return newRow >= 0 && newRow < row && newCol >= 0 && newCol < col;
    });

    if (canMove) {
        // Remove the 'block' class from the previous position
        shape.forEach(cell => {
            const prevCellId = `${cell[0]}-${cell[1]}`;
            const prevCellElement = document.getElementById(prevCellId);
            prevCellElement.classList.remove('block');
        });

        // Update the position of the shape
        shape.forEach(cell => {
            cell[0]++; // Move the cell down by one row
        });

        // Add the 'block' class to the new position
        shape.forEach(cell => {
            const newCellId = `${cell[0]}-${cell[1]}`;
            const newCell = document.getElementById(newCellId);
            newCell.classList.add('block');
        });
    } else {
=======
    if (shape === lblock) {
        return 'lblock';
    } else if (shape === sblock) {
        return 'sblock';
    } else if (shape === tblock) {
        return 'tblock';
    } else if (shape === iblock) {
        return 'iblock';
    } else if (shape === jblock) {
        return 'jblock';
    } else if (shape === zblock) {
        return 'zblock';
    } else {
        return 'block'; // Default class
    }
}

function updateAndRedraw(surface, shape) {
    // Get the existing grid cells
    const gridCells = surface.querySelectorAll('.grid');

    // Clear all cells
    gridCells.forEach(cell => {
        cell.classList.remove('block', 'lblock', 'sblock', 'tblock', 'iblock', 'jblock', 'zblock');
    });

    // Draw the current block shape
    shape.forEach(cell => {
        const [row, col] = cell;
        const cellId = `${row}-${col}`;
        const cellElement = document.getElementById(cellId);
        cellElement.classList.add('block');
        cellElement.classList.add(getBlockClass(shape)); // Add specific block class
    });

    // Update the position of the shape
    shape.forEach(cell => {
        cell[0]++; // Move the cell down by one row
    });

    // Check if the new position is within the grid bounds
    const canMove = shape.every(cell => {
        const newRow = cell[0];
        const newCol = cell[1];
        return newRow >= 0 && newRow < row && newCol >= 0 && newCol < col;
    });

    if (!canMove) {
>>>>>>> test
        // If the new position is outside the grid bounds, stop the block from moving further
        clearInterval(surface.getAttribute('data-interval-id'));
    }
}

function startFalling(surface, shape) {
    // Calculate the initial column position for the block to start in the middle
    const initialCol = Math.floor((col - shape[0].length) / 2);

    // Calculate the initial row position for the block to start at the top
    const initialRow = 0;

    // Find the topmost row position of the block
    const topmostRow = Math.min(...shape.map(cell => cell[0]));

    // Calculate the offset for adjusting row positions to start at the top
    const rowOffset = initialRow - topmostRow;

    // Find the leftmost column position of the block
    const leftmostCol = Math.min(...shape.map(cell => cell[1]));

    // Calculate the offset for adjusting column positions to center the block
    const colOffset = initialCol - leftmostCol;

    // Update the position of each cell in the shape to start at the calculated position
    shape.forEach(cell => {
        cell[0] += rowOffset; // Adjusting row position to start at the top
        cell[1] += colOffset; // Adjusting column position to center the block
    });

    // Redraw the shape in the new position
    redrawShape(surface, shape);

    // Start falling
    const intervalId = setInterval(() => {
        updateAndRedraw(surface, shape);
    }, 1000); // Adjust the interval (in milliseconds) for the speed of falling

    return intervalId;
}

function generateAndDisplayNextBlockPreview(surface) {
    const nextBlock = generateRandomBlock();
    const previewContainer = document.getElementById(surface.id.replace('board', 'preview'));
    
    // Clear previous preview
    previewContainer.innerHTML = '';
    
    // Calculate the maximum row and column indices of the next block
    let maxRow = -1;
    let maxCol = -1;
    nextBlock.forEach(([row, col]) => {
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
    });
    
    // Calculate the offset to center the next block preview within the preview container
    const offsetX = Math.floor((4 - (maxCol + 1)) / 2);
    const offsetY = Math.floor((4 - (maxRow + 1)) / 2);
    
    // Create and display the next block preview
    nextBlock.forEach(([row, col]) => {
        const cell = document.createElement('div');
        cell.classList.add('preview-cell');
        cell.classList.add(getBlockClass(nextBlock));
        cell.style.gridRow = row + offsetY + 1;
        cell.style.gridColumn = col + offsetX + 1;
        previewContainer.appendChild(cell);
    });
}

// Define the Tetris blocks
const lblock = [
    [0, 4],
    [1, 4],
    [2, 4],
    [2, 5]
];

const sblock = [
    [0, 4],
    [0, 5],
    [1, 3],
    [1, 4],
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

createGrid(board1);
createGrid(board2);

generateAndDisplayNextBlockPreview(board1);
generateAndDisplayNextBlockPreview(board2);

setArray(tetrisArray1);
setArray(tetrisArray2);

function generateRandomBlock() {
  const blocks = [lblock, sblock, tblock, iblock, jblock, zblock];
  const randomIndex = Math.floor(Math.random() * blocks.length);
  return blocks[randomIndex];
}


// Function to add a block on the specified grid
function addBlockOnGrid(surface, block) {
    const intervalId = startFalling(surface, block);
    surface.setAttribute('data-interval-id', intervalId);
    createBlock(surface, shape);
}

// Add a random block on each player's grid
addBlockOnGrid(board1, generateRandomBlock()); // For player 1
addBlockOnGrid(board2, generateRandomBlock()); // For player 2
console.log(tetrisArray1)
console.log(tetrisArray2)
