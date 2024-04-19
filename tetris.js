const board1=document.getElementById('board1');
const board2=document.getElementById('board2');
let gameBoard = [[],[]];

//creates grid for both players
function createGrid(surface){
  for(let i=0; i < 20; i++){
    for(let j = 0; j < 10; j++){
      const cell = document.createElement('div');
      cell.classList.add('grid');
      cell.id = i + '-' + j;
      surface.appendChild(cell);
    }
  }
}

createGrid(board1);
createGrid(board2);