const row = 20;
const col = 10; 
const tetrisArray1 = [[],[]];
const tetrisArray2 = [[],[]];
const board1=document.getElementById('board1');
const board2=document.getElementById('board2');

//creates grid for both players
function createGrid(surface){
  for(let i=0; i < row; i++){
    for(let j = 0; j < col; j++){
      const cell = document.createElement('div');
      cell.classList.add('grid');
      cell.id = i + '-' + j;
      surface.appendChild(cell);
    }
  }
}

//creates 2d array 
function setArray(boardArray){
  for(let i=0; i < row; i++){
    boardArray[i] = [];
    for(let j = 0; j < col; j++){
      //false = empty cell
      boardArray[i][j] = false;
    }
  }
}

//test function for displaying block on grid
function createBlock(surface, shape){
  shape.forEach(([row, col]) => {
    const cellId = `${row}-${col}`;
    const cell = document.getElementById(cellId);
    cell.classList.remove('grid');
    cell.classList.add('block');
  });
}

//Function to move shpe down
function moveDown(surface,shape,tetrisArray){
    if (canMoveDown(surface,shape,tetrisArray)){
        shape.forEach(cell => {
            cell[0]++;
        });
        redrawShape(surface,shape);
    }
}
// Function to check if shape can move down
function moveDown(surface,shape){
    return shape.every(([row, col]) => row < row -1 && !document.getElementById('${row + 1 }-${col}').classList.contains('block'));
}

//Function to redraw shape in new position
function redrawShape(surface,shape){
    surface.querySelectorAll('.block').forEach(cell =>{
        cell.classList.removw('block');
    });
    createBlock(surface,shape);
}
//define the l shape block
const lblock = [
    [0,4],
    [1,4],
    [2,4],
    [2,5]
];
//define the s block
const sblock = [
    [0,4],
    [0,5],
    [1,3],
    [1,4],
];

//define the t block
const tblock = [
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 5]
];
const iblock=[
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
    [0,4],
    [0,5],
    [1,3],
    [1,4]
];

createGrid(board1);
createGrid(board2);
setArray(tetrisArray1);
setArray(tetrisArray2);
//for viewing array contents using inspect element
console.log(tetrisArray1);
console.log(tetrisArray2);
//test block tetrimino
const block = [
  [0, 4], [0, 5],
  [1, 4], [1, 5]
];
createBlock(board1, block);
createBlock(board1, lblock);
createBlock(board1, sblock);
createBlock(board2, tblock);
createBlock(board2, iblock);
createBlock(board2, jblock);
createBlock(board2, zblock);
