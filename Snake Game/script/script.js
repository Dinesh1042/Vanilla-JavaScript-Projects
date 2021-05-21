import { drawFood, updateFood } from "./food.js";
import { isGoneOut } from "./grid.js";
import {
  SNAKE_SPEED,
  drawSnake,
  updateSnake,
  getHead,
  isIntersected,
} from "./snake.js";

const snakeBoardEl = document.getElementById("board");

let lastRenderTime = 0;

let isGameOver = false;

function snakeLoop(currentTime) {
  if (isGameOver)
    if (confirm("Oops!😟. You lost Wanna try again?"))
      return window.location.reload();
    else return;

  IsOut();
  const sinceLastRender = (currentTime - lastRenderTime) / 1000;

  window.requestAnimationFrame(snakeLoop);

  if (sinceLastRender < 1 / SNAKE_SPEED) return;

  lastRenderTime = currentTime;
  update();
  draw();
}

window.requestAnimationFrame(snakeLoop);

function update() {
  updateSnake();
  updateFood(snakeBoardEl);
}

function draw() {
  snakeBoardEl.innerHTML = null;
  drawSnake(snakeBoardEl);
  drawFood(snakeBoardEl);
}

function IsOut() {
  isGameOver = isGoneOut(getHead()) || isIntersected();
}
