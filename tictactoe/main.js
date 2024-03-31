// ==================== CONSTANTE ==================== //
const STATUS_DISPLAY = document.querySelector('.game-notification'),
  GAME_STATE = ["", "", "", "", "", "", "", "", ""],
  WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
  DRAW_MESSAGE = () => `El juego ha terminado en empate!`,
  CURRENT_PLAYER_TURN = () => `Turno del jugador ${currentPlayer}`;

// ==================== VARIABLES ==================== //
let gameActive = true,
  currentPlayer = "O",
  mode = "vsMachine"; // Por defecto, modo de juego vs Machine

// ==================== FUNCTIONS ==================== //

function main() {
  handleStatusDisplay(CURRENT_PLAYER_TURN());
  listeners();
}

function listeners() {
  document.querySelector('.game-container').addEventListener('click', handleCellClick);
  document.querySelector('.game-restart').addEventListener('click', handleRestartGame);
  document.querySelector('.game-mode').addEventListener('change', handleModeChange); // Agregar listener para cambio de modo
}

function handleStatusDisplay(message) {
  STATUS_DISPLAY.innerHTML = message;
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  restartGameState();
  handleStatusDisplay(CURRENT_PLAYER_TURN());
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "");
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  if (clickedCell.classList.contains('game-cell')) {
    const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);
    if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) {
      return false;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
  }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  GAME_STATE[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < WINNINGS.length; i++) {
    const winCondition = WINNINGS[i];
    let position1 = GAME_STATE[winCondition[0]],
      position2 = GAME_STATE[winCondition[1]],
      position3 = GAME_STATE[winCondition[2]];

    if (position1 === '' || position2 === '' || position3 === '') {
      continue;
    }
    if (position1 === position2 && position2 === position3) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    handleStatusDisplay(WIN_MESSAGE());
    gameActive = false;
    return;
  }

  let roundDraw = !GAME_STATE.includes("");
  if (roundDraw) {
    handleStatusDisplay(DRAW_MESSAGE());
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  handleStatusDisplay(CURRENT_PLAYER_TURN());
  
  if (mode === "vsMachine" && currentPlayer === "O") {
    // Si es el turno de la máquina en el modo vs Machine, llama a la función para que juegue la máquina
    handleMachineMove();
  }
}

function handleModeChange(event) {
  mode = event.target.value; // Actualiza el modo de juego según la selección del usuario
}

function handleMachineMove() {
  const bestMove = getBestMove();
  const cell = document.querySelector(`.game-cell:nth-child(${bestMove.index + 1})`);
  handleCellPlayed(cell, bestMove.index);
  handleResultValidation();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (GAME_STATE[i] === '') {
      GAME_STATE[i] = 'O';
      let score = minimax(GAME_STATE, 0, false);
      GAME_STATE[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return {index: move};
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner(board);
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(board) {
  for (let i = 0; i < WINNINGS.length; i++) {
    const [a, b, c] = WINNINGS[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === 'O' ? 1 : -1;
    }
  }
  return null;
}

function restartGameState() {
  for (let i = 0; i < GAME_STATE.length; i++) {
    GAME_STATE[i] = '';
  }
}

main();
