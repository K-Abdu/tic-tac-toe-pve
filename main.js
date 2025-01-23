let emptyCells = [];
const statusNext = document.querySelector('.status');
const resetBtn = document.querySelector('.restart');
const cells = document.querySelectorAll('.cell');

let o = 0;
let x = 0;

let gameStatus = true;
let xNext = true;

const winningfunction = (letter) => {
  gameStatus = false;
  console.log(`${letter} is the winner!!`);
  xNext = null;

  if (letter === 'x') {
    statusNext.innerHTML = 'X is the winner!!';
    x += 1;
    document.getElementById("xPoints").innerHTML = x;
    console.log(`X has won ${x}, O has won ${o}`);
  } else {
    statusNext.innerHTML = 'O is the winner!!';
    o += 1;
    document.getElementById("oPoints").innerHTML = o;
    console.log(`X has won ${x}, O has won ${o}`);
  }
};

const checkGameStatus = () => {
  const boardState = [...cells].map(cell => cell.classList[2]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      winningfunction(boardState[a]);
      cells[a].classList.add('won');
      cells[b].classList.add('won');
      cells[c].classList.add('won');
      return;
    }
  }

  if (boardState.every(cell => cell)) {
    gameStatus = false;
    xNext = null;
    statusNext.innerHTML = 'The game is a tie!';
  } else {
    xNext = !xNext;
    statusNext.innerHTML = `${xNext ? 'X' : 'O'} is next`;
  }
};

const reset = () => {
  xNext = true;
  gameStatus = true;
  emptyCells = [];
  statusNext.innerHTML = 'X is next';

  for (const cell of cells) {
    cell.classList.remove('x', 'o', 'won');
  }
};

const cellClick = (e) => {
  const classList = e.target.classList;

  if (!gameStatus || classList.contains('x') || classList.contains('o')) return;

  if (xNext) {
    classList.add('x');
  } else {
    classList.add('o');
  }

  checkGameStatus();
};

const bestMove = () => {
  let bestScore = -Infinity;
  let move;

  const boardState = [...cells].map(cell => cell.classList[2] || '');

  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === '') {
      boardState[i] = 'o'; // AI makes a move
      const score = minimax(boardState, 0, false);
      boardState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    cells[move].classList.add('o');
    checkGameStatus();
  }
};

const minimax = (board, depth, isMaximizing) => {
  const winner = getWinner(board);
  if (winner === 'x') return -10 + depth;
  if (winner === 'o') return 10 - depth;
  if (board.every(cell => cell)) return 0; // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'o';
        const score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'x';
        const score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

resetBtn.addEventListener('click', reset);

for (const cell of cells) {
  cell.addEventListener('click', (e) => {
    cellClick(e);

    if (!xNext && gameStatus) {
      setTimeout(bestMove, 500); // AI makes its move after a short delay
    }
  });
}