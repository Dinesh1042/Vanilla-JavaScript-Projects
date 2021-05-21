import { getRandomGridPosition } from "./grid.js";
import { expandSnake, onSnake } from "./snake.js";

let foodPosition = getRandomFoodPosition();

const EXPANSION = 1;

export function updateFood(snakeBoard) {
  if (onSnake(foodPosition)) {
    foodPosition = getRandomFoodPosition();

    expandSnake(EXPANSION);
  }
}

export function drawFood(snakeBoard) {
  const foodEl = document.createElement("div");

  foodEl.classList.add("food");
  foodEl.style.gridRowStart = foodPosition.y;
  foodEl.style.gridColumnStart = foodPosition.x;
  snakeBoard.appendChild(foodEl);
}

function getRandomFoodPosition() {
  let newFoodPosition;

  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = getRandomGridPosition();
  }

  return newFoodPosition;
}
