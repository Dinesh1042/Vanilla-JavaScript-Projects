class Minesweeper {
  constructor(boardEl, subtitleEl) {
    this.boardEl = boardEl;
    this.subtitleEl = subtitleEl;
    this.BOARD_SIZE = 7;
    this.NUMBER_OF_MINES = 10;
    this.initializeMinesweeper();
  }

  TILE_STATUSES = {
    HIDDEN: "hidden",
    MARKED: "marked",
    NUMBER: "number",
    MINE: "mine",
  };

  initializeMinesweeper() {
    this.mines = this.getMinesPositions();
    this.board = this.initializeBoard();
    this.updateBoardStyleSize();
    this.createBoard();
    this.updateMinesLeft();
  }

  updateBoardStyleSize() {
    this.boardEl.style.setProperty("--size", this.BOARD_SIZE);
  }

  initializeBoard() {
    const board = [];

    for (let y = 0; y < this.BOARD_SIZE; y++) {
      const column = [];

      for (let x = 0; x < this.BOARD_SIZE; x++) {
        const tileElement = document.createElement("div");

        const tile = {
          tileElement,
          x,
          y,
          mine: this.mines.some(this.checkMatch.bind(null, { x, y })),
          get status() {
            return this.tileElement.dataset.status;
          },
          set status(value) {
            this.tileElement.dataset.status = value;
          },
        };

        tile.status = this.TILE_STATUSES.HIDDEN;

        column.push(tile);
      }
      board.push(column);
    }
    return board;
  }

  createBoard() {
    this.board.forEach((column) =>
      column.forEach((tile) => {
        const tileElement = tile.tileElement;
        boardEl.appendChild(tileElement);

        tileElement.addEventListener("click", () => {
          this.revialTile(tile);
          this.checkGameStatus();
        });

        tileElement.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.markTile(tile);
        });
      })
    );
  }

  getMinesPositions() {
    const positions = [];

    while (positions.length < this.NUMBER_OF_MINES) {
      const mineTile = {
        x: this.getRandomNumber(this.BOARD_SIZE),
        y: this.getRandomNumber(this.BOARD_SIZE),
      };
      if (!positions.some(this.checkMatch.bind(null, mineTile)))
        positions.push(mineTile);
    }
    return positions;
  }

  getRandomNumber(size) {
    return Math.floor(Math.random() * size);
  }

  checkMatch(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  revialTile(tile) {
    if (tile.status === this.TILE_STATUSES.HIDDEN) {
      if (tile.mine) {
        tile.status = this.TILE_STATUSES.MINE;
        return;
      }

      tile.status = this.TILE_STATUSES.NUMBER;

      const adjacentTiles = this.getNearByTiles(tile);
      const nearByMineTiles = adjacentTiles.filter((tile) => tile.mine);

      if (nearByMineTiles.length === 0)
        adjacentTiles.forEach((m) => this.revialTile(m));
      else tile.tileElement.textContent = nearByMineTiles.length;
    }
  }

  getNearByTiles({ x, y }) {
    const nearByTile = [];

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        const tile = this.board[yOffset + y]?.[xOffset + x];
        if (tile) nearByTile.push(tile);
      }
    }
    return nearByTile;
  }

  markTile(tile) {
    if (
      tile.status === this.TILE_STATUSES.MARKED ||
      tile.status === this.TILE_STATUSES.HIDDEN
    ) {
      tile.status =
        tile.status === this.TILE_STATUSES.HIDDEN
          ? this.TILE_STATUSES.MARKED
          : this.TILE_STATUSES.HIDDEN;

      this.updateMinesLeft();
    }
  }

  updateMinesLeft() {
    const markedTilesCount = this.board.reduce(
      (count, column) =>
        count +
        column.filter((tile) => tile.status === this.TILE_STATUSES.MARKED)
          .length,
      0
    );

    this.subtitleEl.textContent = `Mines left: ${markedTilesCount} / ${this.NUMBER_OF_MINES}`;
  }

  checkGameStatus() {
    const win = this.checkWin();
    const lose = this.checkLose();

    if (win) subtitleEl.textContent = `You Win`;

    if (lose) {
      this.board.forEach((column) =>
        column.forEach((tile) => {
          if (tile.status === this.TILE_STATUSES.MARKED) this.markTile(tile);

          if (tile.mine) this.revialTile(tile);
        })
      );
      subtitleEl.textContent = `You Lose`;
    }

    if (lose || win) {
      this.boardEl.addEventListener("click", this.stopProp, { capture: true });
      this.boardEl.addEventListener("contextmenu", this.stopProp, {
        capture: true,
      });
    }
  }

  stopProp(e) {
    e.stopImmediatePropagation();
  }

  checkLose() {
    return this.board.some((column) =>
      column.some((tile) => tile.status === this.TILE_STATUSES.MINE)
    );
  }
  checkWin() {
    return this.board.every((column) =>
      column.every((tile) => {
        return (
          tile.status === this.TILE_STATUSES.NUMBER ||
          (tile.mine &&
            (tile.status === this.TILE_STATUSES.MARKED ||
              tile.status === this.TILE_STATUSES.HIDDEN))
        );
      })
    );
  }
}

const boardEl = document.querySelector(".board");
const subtitleEl = document.querySelector(".subtitle");

const minesweeper = new Minesweeper(boardEl, subtitleEl);

console.log(minesweeper);
