import {
  TILE_STATUSES,
  createBoard,
  populateBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./logic.js";

const BOARD_SIZE = 12;
const MINE_COUNT = 32;

const board = createBoard(BOARD_SIZE);
const elBoard = document.querySelector(".board");
const elMinesRemaining = document.querySelector("[data-mine-count]");
const elStatus = document.querySelector("h1");
let isBoardNew = true;

board.forEach((row) => {
  row.forEach((tile) => {
    elBoard.append(tile.element);
    tile.element.addEventListener("click", () => {
      if (isBoardNew) {
        populateBoard(board, BOARD_SIZE, MINE_COUNT, tile);
        isBoardNew = false;
      }
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});
elBoard.style.setProperty("--size", BOARD_SIZE);
elMinesRemaining.textContent = MINE_COUNT;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);

  elMinesRemaining.textContent = MINE_COUNT - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    elBoard.addEventListener("contextmenu", stopProp, { capture: true });
    setTimeout(() => document.body.addEventListener("click", () => location.reload()), 400)
  }

  if (win) elStatus.textContent = `You've won!! Click to play again`;
  if (lose) {
    elStatus.textContent = `Game Over! Click to play again`;
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
