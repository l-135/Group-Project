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

// Test function for displaying block on grid
function createBlock(surface, shape) {
    block.forEach(([row, col]) => {
        const cellId = `${row}-${col}`;
        const cell = document.getElementById(cellId);
        cell.classList.remove('grid');
        cell.classList.add('block');
    });
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

// Function to get CSS class based on block shape
function getBlockClass(shape) {
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
        // If the new position is outside the grid bounds, stop the block from moving further
        clearInterval(surface.getAttribute('data-interval-id'));
    }
}

function startFalling(surface, shape) {
  // Calculate the initial column position for the block to start in the center
  const initialCol = Math.floor((col - shape[0].length) / 2);
  
  // Set the initial row position to 0 (top of the grid)
  const initialRow = 0;

  // Update the position of each cell in the shape to start at the calculated position
  shape.forEach(cell => {
      cell[0] += initialRow;
      cell[1] += initialCol;
  });

  // Redraw the shape in the new position
  redrawShape(surface, shape);

  // Start falling
  const intervalId = setInterval(() => {
      updateAndRedraw(surface, shape);
  }, 1000); // Adjust the interval (in milliseconds) for the speed of falling
  
  return intervalId;
}

/*function generateAndDisplayNextBlockPreview(surface) {
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
        cell.style.gridRow = row + offsetY + 1;
        cell.style.gridColumn = col + offsetX + 1;
        previewContainer.appendChild(cell);
    });
}*/

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
    createBlock(surface, block);
}

// Add a random block on each player's grid
addBlockOnGrid(board1, generateRandomBlock()); // For player 1
addBlockOnGrid(board2, generateRandomBlock()); // For player 2
console.log(tetrisArray1)
console.log(tetrisArray2)

