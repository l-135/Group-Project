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
  block.forEach(([row, col]) => {
    const cellId = `${row}-${col}`;
    const cell = document.getElementById(cellId);
    cell.classList.remove('grid');
    cell.classList.add('block');
  });
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
createBlock(board1,lblock);
