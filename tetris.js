const board1=document.getElementById('board1');
const board2=document.getElementById('board2');

//creates grid for both players
function createGrid(board){
  for(let i=0; i < 20; i++){
    for(let j = 0; j < 10; j++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      board.appendchild('cell')
    }
  }
}
creatgrid(board1);
createGrid(board2);