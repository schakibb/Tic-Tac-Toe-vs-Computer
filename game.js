"use strict";

// Define winning combinations
const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// DOM elements
const choosingX = document.querySelector(".choosing-x");
const choosingO = document.querySelector(".choosing-o");
const choosingContainer = document.querySelector(".choosing-container");
const overlay = document.querySelector(".overlay");
const playerSymbol = document.querySelector(".player-symbol");
const computerSymbol = document.querySelector(".computer-symbol");
const playerScore = document.querySelector(".player .player-score");
const computerScore = document.querySelector(".computer-score");
const newGameBtn = document.querySelector(".new-game-btn");
const replayWindow = document.querySelector(".replay-window");
const winnerLabel = document.querySelector(".winner-label");
const replayButton = document.querySelector(".replay-button");
const currentSymbolLabel = document.querySelector(".current-symbol-label");
const bloc = document.querySelectorAll(".bloc");

// Game variables
let current;
let gameIsOver;
let score;
let board;
let randomCorners;

// Add event listeners to game cells
(function () {
  bloc.forEach((cell) => cell.addEventListener("click", cellClicked));
})();

// Opening the choosing symbol window(to choose ❌ or ⭕)
function openChoosingSymbolWindow() {
  choosingContainer.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Closing the choosing symbol window(to choose ❌ or ⭕)
function closeChoosingSymbolWindow() {
  choosingContainer.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Opening the replay game window
function openReplayWindow() {
  replayWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Closing the replay game window
function closeReplayWindow() {
  replayWindow.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Generates a random array of corner positions starting with 4.

function generateRandomCorners() {
  // Initial array of corner positions
  let corners = [0, 2, 6, 8];
  // Initialize the random corners array with the center (position 4)
  randomCorners = [4];

  // Iterate to select random corners from the remaining positions
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random() * corners.length); // Generate a random index within the range of the corners array
    randomCorners.push(corners[randomIndex]); // Add the randomly selected corner to the randomCorners array
    corners.splice(randomIndex, 1); // Remove the selected corner from the corners array to avoid repetition
  }
}

// Initializes the game state:
// - Resets the game board to an empty state.
// - Resets the game over status.
// - Clears any visual effects on game cells.
// - Randomly selects the starting player (X or O).
// - Displays the symbol of the current player.
// - If the current player is the computer, delays its move by a short duration before making it.
// - Generates a random array of corner positions for computer moves.
function initialiseGame() {
  board = ["", "", "", "", "", "", "", "", ""]; // Reset the game board
  gameIsOver = false; // Reset game over status
  bloc.forEach((cell) => {
    // Clear visual effects on game cells
    cell.classList.remove("colorChangingDiv");
    cell.innerHTML = "";
  });
  current = Math.random() < 0.5 ? "X" : "O"; // Randomly select starting player
  displayCurrentPlayer(); // Display current player's symbol
  if (current === computerSymbol.textContent) {
    // If current player is computer, delay its move
    setTimeout(() => {
      computerMove();
      switchPlayer();
    }, 150);
  }
  generateRandomCorners(); // Generate random array of corner positions for computer moves
}

// Start a new game when the page loads
startNewGame();

// Starts a new game
function startNewGame() {
  openChoosingSymbolWindow();
  score = { X: 0, O: 0 };
  initialiseGame();
}

// Displays the current player's symbol in the top
function displayCurrentPlayer() {
  currentSymbolLabel.textContent = current;
}

// Switches the current player.
function switchPlayer() {
  current = current === "X" ? "O" : "X";
  displayCurrentPlayer();
}

// Handles the click event on a game cell
function cellClicked() {
  const cellNum = this.getAttribute("cellNum");

  // If the clicked cell is empty and the game is not over ,and it's the players turn
  if (
    board[cellNum] === "" &&
    !gameIsOver &&
    current === playerSymbol.textContent
  ) {
    updateCell(this, cellNum); //Update the cell with the player's symbol
    checkForWinOrDraw(); //check fir a win or draw
    switchPlayer(); //switc to the next players's turn
  }
  // if its the computer's trun and the game is not over yet
  if (current === computerSymbol.textContent && !gameIsOver) {
    // wait a short delay before making the computer move
    setTimeout(() => {
      computerMove(); // Make the computer move
      checkForWinOrDraw(); // Check for a win or draw
      switchPlayer(); // Switch to the next player's turn
    }, 400);
  }
}

function computerMove() {
  // If the board is empty, choose the center cell
  if (board.every((cell) => cell === "")) {
    updateCell(bloc[4], 4);
    return;
  }

  // Check for winning move
  for (const condition of WIN_CONDITIONS) {
    const [a, b, c] = condition;

    // If two cells are already occupied by the computer and the third cell is empty, occupy it for the win
    if (
      board[a] === computerSymbol.textContent &&
      board[b] === computerSymbol.textContent &&
      !board[c]
    ) {
      updateCell(bloc[c], c);
      return;
    }
    if (
      board[a] === computerSymbol.textContent &&
      board[c] === computerSymbol.textContent &&
      !board[b]
    ) {
      updateCell(bloc[b], b);
      return;
    }
    if (
      board[b] === computerSymbol.textContent &&
      board[c] === computerSymbol.textContent &&
      !board[a]
    ) {
      updateCell(bloc[a], a);
      return;
    }
  }

  // Check for blocking opponent's winning move
  for (const condition of WIN_CONDITIONS) {
    const [a, b, c] = condition;

    // If two cells are already occupied by the opponent and the third cell is empty, block the opponent
    if (
      board[a] === playerSymbol.textContent &&
      board[b] === playerSymbol.textContent &&
      !board[c]
    ) {
      updateCell(bloc[c], c);
      return;
    }
    if (
      board[a] === playerSymbol.textContent &&
      board[c] === playerSymbol.textContent &&
      !board[b]
    ) {
      updateCell(bloc[b], b);
      return;
    }
    if (
      board[b] === playerSymbol.textContent &&
      board[c] === playerSymbol.textContent &&
      !board[a]
    ) {
      updateCell(bloc[a], a);
      return;
    }
  }

  // If no winning move or blocking move, prioritize the center and then the corners, if available
  const corners = randomCorners;
  for (const corner of corners) {
    if (board[corner] === "") {
      updateCell(bloc[corner], corner);
      return;
    }
  }
  // If none of the above conditions are met, choose a random empty cell
  const emptyCells = [];
  board.forEach((cell, index) => {
    if (!cell) {
      emptyCells.push(index);
    }
  });
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  updateCell(bloc[emptyCells[randomIndex]], emptyCells[randomIndex]);
}

// Updates the specified cell on the game board with the current player's symbol
// Parameters:
// - cell: The HTML element representing the game cell to be updated
// - cellNum: The index of the cell in the game board (cell number 0,1,2......,8)
function updateCell(cell, cellNum) {
  board[cellNum] = current;
  let html = `<div class='${current}'></div>`;
  cell.insertAdjacentHTML("afterbegin", html);
}

// Handles the end of the game, updating UI and scores accordingly.
function HandleEndGame(winnerLabelContent, winningCells) {
  gameIsOver = true;
  winnerLabel.textContent = winnerLabelContent;
  // If there are winning cells
  if (winningCells.length) {
    // Add colorChangingDiv class to winning cells
    winningCells.forEach((index) => {
      bloc[index].classList.add("colorChangingDiv");
    });
    // Increment score for the current player
    score[current]++;
  } else {
    // If it's a draw, add colorChangingDiv class to all cells
    bloc.forEach((cell) => {
      cell.classList.add("colorChangingDiv");
    });
  }
  // Open the replay game window
  openReplayWindow();
}

//Handles the end of the game, updating UI and scores accordingly.
function HandleEndGame(winnerLabelContent, winningCells) {
  gameIsOver = true;
  winnerLabel.textContent = winnerLabelContent;
  // If there are winning cells
  if (winningCells.length) {
    winningCells.forEach((index) => {
      bloc[index].classList.add("colorChangingDiv"); // Add colorChangingDiv class to winning cells
    });

    score[current]++; // Increment score for the current player
  } else {
    // If it's a draw, add colorChangingDiv class to all cells
    bloc.forEach((cell) => {
      cell.classList.add("colorChangingDiv");
    });
  }

  openReplayWindow(); // Open the replay window
}

// Declares a win and invokes HandleEndGame with appropriate parameters
function declareWin(winningCells) {
  HandleEndGame(
    `${current === playerSymbol.textContent ? "You Win" : "Computer Wins"} !!`,
    winningCells
  );
}

// Declares a draw and invokes HandleEndGame
function declareDraw() {
  HandleEndGame(`Its A Draw`, []);
}

// Checks for a win or draw condition after each player's move.
function checkForWinOrDraw() {
  // Iterate through each winning condition
  for (const condition of WIN_CONDITIONS) {
    const [a, b, c] = condition;
    // If all cells in a winning condition have the same symbol, declare win
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      declareWin([a, b, c]);
      return;
    }
  }
  // If there are no empty cells(or the cells are not empty), declare draw
  if (!board.includes("")) {
    declareDraw();
  }
}

// Handles the player's selection of a symbol (❌ or ⭕).
function handlePlayerSelectionSymbol(symbol) {
  // Set player and computer symbols based on player selection and initialise their scores to 0
  playerSymbol.textContent = symbol;
  playerScore.textContent = "0";
  computerSymbol.textContent = `${symbol === "X" ? "O" : "X"}`;
  computerScore.textContent = "0";
  closeChoosingSymbolWindow(); // Close the choosing symbol window
  current = symbol; // Set current player
  displayCurrentPlayer(); // Display current player's symbol
}

//Displays the current scores for player and computer.
function displayScores() {
  // Update player and computer scores
  playerScore.textContent = score[playerSymbol.textContent];
  computerScore.textContent = score[computerSymbol.textContent];
}

// Event listener for the replay button click event.
replayButton.addEventListener("click", () => {
  displayScores(); // Display current scores
  closeReplayWindow(); // Close the replay window
  initialiseGame(); // Initialize a new game
});

//Event listener for the new game button click event.
newGameBtn.addEventListener("click", startNewGame);

// Event listener for selecting ❌ or ⭕ symbol.
choosingX.addEventListener("click", () => handlePlayerSelectionSymbol("X"));
choosingO.addEventListener("click", () => handlePlayerSelectionSymbol("O"));
