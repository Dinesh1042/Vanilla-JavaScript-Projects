import { createNewGameForm } from "./form.js";
import { createBoard, markTile } from "./sos.js";

const boardEl = document.querySelector(".board");
const formEl = document.getElementById("form");
const headerEl = document.querySelector(".header");
const brandEl = document.querySelector(".brand");
const currentPlayerNameEl = document.getElementById("currentPlayerName");
const playersEl = document.getElementById("players");
const resultModalEl = document.querySelector(".winner-modal");
const modalBackDropEl = document.querySelector(".modal-backdrop");
const gameModalEl = document.querySelector(".game-modal");

let players = [];
let BOARD_SIZE = 0;
let currentPlayer = null;
let board = [];

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const { boardSize, players: p } = createNewGameForm();
  BOARD_SIZE = boardSize;
  players = p;
  currentPlayer = players[0];
  board = createBoard(BOARD_SIZE);
  headerEl.classList.remove("d-none");
  brandEl.classList.remove("d-none");
  gameModalEl.remove();
  initializeBoard();
});

function initializeBoard() {
  board.forEach((column) =>
    column.forEach((tile) => {
      const { tileElement } = tile;
      boardEl.appendChild(tileElement);

      tileElement.addEventListener(
        "click",
        (_) => countScore(markTile(1, tile, board)),
        {
          once: true,
        }
      );

      tileElement.addEventListener(
        "contextmenu",
        (_) => countScore(markTile(0, tile, board)),
        {
          once: true,
        }
      );
    })
  );

  boardEl.style.setProperty("--size", BOARD_SIZE);
  updateCurrentPlayerDom();
  updateScoreDOM();
}

function countScore(strikedTiles) {
  if (checkGameEnd()) {
    checkWinner();
    return;
  }
  if (!strikedTiles.length) {
    swapPlayers();
    return;
  }
  currentPlayer.score += strikedTiles.length;

  updatePlayerStrikeCss(strikedTiles);
  updateScoreDOM();
}

function updatePlayerStrikeCss(strikedTiles) {
  strikedTiles
    .flat(2)
    .forEach((el) => el.tileElement.classList.add(currentPlayer.id));
}

function updateScoreDOM() {
  const [player1, player2] = players;

  const player1Name = playersEl.querySelector("#player1Name");
  const player1Score = playersEl.querySelector("#player1Score");
  const player2Name = playersEl.querySelector("#player2Name");
  const player2Score = playersEl.querySelector("#player2Score");

  player1Name.textContent = player1.playerName;
  player1Score.textContent = player1.score;

  player2Name.textContent = player2.playerName;
  player2Score.textContent = player2.score;
}

function checkGameEnd() {
  return board.flat(2).filter((i) => !i.isClicked).length === 0;
}

function checkWinner() {
  const [player1, player2] = players;
  const sortedPlayersScore = players.sort((a, b) => b.score - a.score);

  player1.score === player2.score
    ? showWinnerModal(sortedPlayersScore, true)
    : showWinnerModal(sortedPlayersScore, false);
}

boardEl.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();
    console.log(checkGameEnd());
  },
  {
    capture: true,
  }
);

function swapPlayers() {
  const [player1, player2] = players;
  currentPlayer = currentPlayer === player1 ? player2 : player1;
  updateCurrentPlayerDom();
}

function updateCurrentPlayerDom() {
  currentPlayerNameEl.textContent = currentPlayer.playerName;
}

function showWinnerModal(players, isMatchDraw) {
  const [player1, player2] = players;

  const winnerNameEl = resultModalEl.querySelector("#winnerName");
  const winnerScoreEl = resultModalEl.querySelector("#winnerScore");
  const opponentScore = resultModalEl.querySelector("#opponentScore");
  const wonTextEl = resultModalEl.querySelector("#wonText");
  const player1NameEl = resultModalEl.querySelector("#player1Name");
  const player2NameEl = resultModalEl.querySelector("#player2Name");

  const restartBtnEl = resultModalEl.querySelector(".btn-success");

  if (isMatchDraw) wonTextEl.remove();

  resultModalEl.classList.add("show");
  modalBackDropEl.classList.add("show");
  winnerNameEl.textContent = isMatchDraw
    ? "OOPS! IT'S A DRAW"
    : player1.playerName;

  player1NameEl.textContent = player1.playerName;

  player2NameEl.textContent = player2.playerName;

  winnerScoreEl.textContent = player1.score;
  opponentScore.textContent = player2.score;
  restartBtnEl.addEventListener("click", (_) => window.location.reload());
}
