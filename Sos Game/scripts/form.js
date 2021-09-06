const formEl = document.getElementById("form");

export function createNewGameForm(e) {
  const player1NameEl = formEl.querySelector("#player1Name");
  const player2NameEl = formEl.querySelector("#player2Name");
  const boardSizeEl = formEl.querySelector("#boardSize");

  const player1Name = player1NameEl.value.trim() || "Player 1";
  const player2Name = player2NameEl.value.trim() || "Player 2";
  const boardSize = +boardSizeEl.value || 7;

  const players = [
    {
      id: "PLAYER1",
      playerName: player1Name,
      score: 0,
    },
    {
      id: "PLAYER2",
      playerName: player2Name,
      score: 0,
    },
  ];

  return { boardSize, players };
}
