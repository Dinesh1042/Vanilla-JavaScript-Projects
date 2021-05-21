import { getDirection } from "./direction.js";

export const SNAKE_SPEED = 5;

let newSegment = 0;

const snakeBody = [{ x: 11, y: 11 }];

export function updateSnake() {
  addSegment();
  const direction = getDirection();

  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].x += direction.x;
  snakeBody[0].y += direction.y;
}

export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segments, index) => {
    if (ignoreHead && index === 0) return false;

    return segments.x === position.x && segments.y === position.y;
  });
}

export function drawSnake(snakeBoard) {
  snakeBody.forEach((segments) => {
    const snakeEl = document.createElement("div");
    snakeEl.classList.add("snake");

    snakeEl.style.gridRowStart = segments.y;
    snakeEl.style.gridColumnStart = segments.x;

    snakeBoard.appendChild(snakeEl);
  });
}

export function expandSnake(amount) {
  newSegment += amount;
}

export function getHead() {
  return snakeBody[0];
}

export function isIntersected() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function addSegment() {
  for (let i = 0; i < newSegment; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegment = 0;
}
