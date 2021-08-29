const boardEl = document.querySelector(".board");
const cellsEl = [...document.querySelectorAll(".cell")];
const gameStatusEl = document.querySelector(".game-status");

const CLASS_X = "x";
const CLASS_CIRCLE = "circle";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [0, 4, 8],
];

const xPositions = [];

cellsEl.forEach((cell) =>
  cell.addEventListener("click", handleClick, { once: true })
);

function handleClick(e) {
  const currentXCell = e.target;

  updateCell(currentXCell, CLASS_X);

  xPositions.push(cellsEl.indexOf(currentXCell));

  const xWins = checkWin(CLASS_X);

  xWins ? showGameModal(`won`) : addO();
}

function addO() {
  const position = getOPositon();

  const currentOCell = cellsEl[position];

  if (currentOCell) {
    updateCell(currentOCell, CLASS_CIRCLE);
    currentOCell.removeEventListener("click", handleClick);
    const oWins = checkWin(CLASS_CIRCLE);

    if (oWins) showGameModal(`lost`);
  }
}

function updateCell(cell, currentClass) {
  cell.classList.add(currentClass);
}

function getOPositon() {
  const xWinningCombinations = WINNING_COMBINATIONS.filter(
    (column) =>
      xPositions.some((i) => column.includes(i)) &&
      !column.some((i) => cellsEl[i].classList.contains(CLASS_CIRCLE))
  );

  const emptyCells = WINNING_COMBINATIONS.filter((i) =>
    i.some((v) => !cellsEl[v].classList.contains(CLASS_CIRCLE))
  );

  const xPositionArr = xWinningCombinations
    .map((column) =>
      column.filter((i) => !cellsEl[i].classList.contains(CLASS_X))
    )
    .sort((a, b) => a.length - b.length);

  const position = xPositionArr[0]?.[getRandomNumber(xPositionArr[0]?.length)];

  if (!position && position !== 0) showGameModal(`draw`);

  return position;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((column) =>
    column.every((i) => cellsEl[i].classList.contains(currentClass))
  );
}

function stopGame() {
  cellsEl.forEach((cell) => cell.removeEventListener("click", handleClick));
  boardEl.classList.add("game-end");
}

function showGameModal(gameStatus) {
  const gameStatusTitle = gameStatusEl.querySelector(".game-status-title");
  const restartBtn = gameStatusEl.querySelector(".btn-primary");

  const gameStatues = {
    won: { className: "won", text: "You Won!" },
    lost: { className: "lost", text: "Oops! You Lost" },
    draw: { className: "draw", text: "It's a draw" },
  };

  const {
    [gameStatus]: { className, text },
  } = gameStatues;

  gameStatusEl.classList.add(className);
  gameStatusEl.style.display = "flex";
  gameStatusTitle.textContent = text;
  stopGame();

  restartBtn.addEventListener("click", () => window.location.reload());
}

// Helper functions

function getRandomNumber(limit) {
  return Math.floor(Math.random() * limit);
}
