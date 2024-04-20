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

createGrid(board1);
createGrid(board2);
setArray(tetrisArray1);
setArray(tetrisArray2);