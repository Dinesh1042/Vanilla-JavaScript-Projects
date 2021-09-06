export function createBoard(boardSize) {
  const board = [];
  for (let y = 0; y < boardSize; y++) {
    const column = [];
    for (let x = 0; x < boardSize; x++) {
      const tileElement = document.createElement("div");
      tileElement.classList.add("tile");
      const tile = {
        x,
        y,
        tileElement,
        get value() {
          return JSON.parse(this.tileElement.dataset.value || null);
        },
        set value(value) {
          this.tileElement.dataset.value = value;
        },
        isStriken: false,
        isClicked: false,
      };

      column.push(tile);
    }
    board.push(column);
  }
  return board;
}

export function markTile(value, tile, board) {
  if (tile.isClicked) return;
  updateTile(tile, value);
  const adjacentTiles = getAdjacentTiles(tile, board);
  const strikes = checkStrikes(adjacentTiles);
  strikeElement(strikes);
  return strikes;
}

function updateTile(tile, value) {
  tile.isClicked = true;
  tile.tileElement.textContent = value ? "S" : "O";
  tile.value = value;
  tile.tileElement.classList.add("striked");
}

function getAdjacentTiles({ x, y }, board) {
  const tiles = [];
  let leftTopToBottomTiles = [];
  let RightTopToBottomTiles = [];

  for (let yOffset = -2; yOffset <= 2; yOffset++) {
    const horizontalTiles = [];
    const verticalTiles = [];
    let leftSide = 0;
    let rightSide = 0;
    for (let xOffset = -2; xOffset <= 2; xOffset++) {
      const horizontalTile = board[yOffset + y]?.[xOffset + x];
      const verticalTile = board[y + xOffset]?.[x + yOffset];

      const leftToBottomTile = board[y + xOffset]?.[x + leftSide - 2];
      leftSide = leftSide + 1;

      const rightToBottomTile = board[y + xOffset]?.[x + rightSide + 2];
      rightSide = rightSide - 1;

      if (horizontalTile) horizontalTiles.push(horizontalTile);
      if (verticalTile) verticalTiles.push(verticalTile);

      if (leftToBottomTile) leftTopToBottomTiles.push(leftToBottomTile);
      if (rightToBottomTile) RightTopToBottomTiles.push(rightToBottomTile);
    }

    tiles.push(horizontalTiles, verticalTiles);
  }

  leftTopToBottomTiles = [...new Set(leftTopToBottomTiles)];

  RightTopToBottomTiles = [...new Set(RightTopToBottomTiles)];

  tiles.push(leftTopToBottomTiles);
  tiles.push(RightTopToBottomTiles);

  return tiles
    .map((col) => [col.slice(0, 3), col.slice(1, 4), col.slice(2)])
    .map((i) => i.filter((v) => v.length === 3))
    .flat(1);
}

function checkStrikes(nearByTiles) {
  return nearByTiles.filter(
    (i) =>
      i.some((e) => !e.isStriken) &&
      i[0].value === 1 &&
      i[1].value === 0 &&
      i[2].value === 1
  );
}

function strikeElement(strikesTiles) {
  strikesTiles.forEach((column) => {
    if (column.every(({ y }) => y === column[0].y))
      setStrikeClassList("horizontal-strike", column);

    if (column.every(({ x }) => x === column[0].x))
      setStrikeClassList("vertical-strike", column);

    if (
      column[0].x < column[2].x &&
      !column.every(({ y }) => y === column[0].y) &&
      !column.every(({ x }) => x === column[0].x)
    )
      setStrikeClassList("strike-left-to-right", column);

    if (
      column[0].x > column[2].x &&
      !column.every(({ y }) => y === column[0].y) &&
      !column.every(({ x }) => x === column[0].x)
    )
      setStrikeClassList("strike-right-to-left", column);
  });
}

function setStrikeClassList(strikeClass, tiles) {
  const strikesStartEnd = ["start", "center", "end"];
  tiles.forEach((tile, i) => {
    tile.isStriken = true;
    tile.tileElement.classList.add(strikeClass);
    const strikeEl = document.createElement("div");
    tile.tileElement.appendChild(strikeEl);
    strikeEl.classList.add(`strike`);
    strikeEl.classList.add(`${strikeClass}-${strikesStartEnd[i]}`);
  });
}
