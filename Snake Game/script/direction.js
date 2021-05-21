let direction = { x: 0, y: 0 };

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y !== 0) break;
      direction = { x: 0, y: -1 };
      break;
    case "ArrowLeft":
      if (direction.x !== 0) break;
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x !== 0) break;
      direction = { x: 1, y: 0 };
      break;
    case "ArrowDown":
      if (direction.y !== 0) break;
      direction = { x: 0, y: 1 };
      break;
  }
});

export function getDirection() {
  return direction;
}
