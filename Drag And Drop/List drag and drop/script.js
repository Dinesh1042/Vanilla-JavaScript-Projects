const containerEl = document.querySelector(".container");

const boxEl = Array.from(document.querySelectorAll(".box"));

boxEl.forEach((dragItems) => {
  dragItems.addEventListener("dragstart", (e) => {
    dragItems.classList.add("dragging");
  });
  dragItems.addEventListener("dragend", (e) => {
    dragItems.classList.remove("dragging");
  });
  dragItems.addEventListener("dragenter", (e) => {
    previousEl = e.target;
  });

  // Adding draggable true to html when mouse key is down

  dragItems.addEventListener("mousedown", (e) => {
    dragItems.classList.add("dragging");
    dragItems.setAttribute("draggable", true);
  });
  dragItems.addEventListener("mouseup", (e) => {
    dragItems.classList.remove("dragging");
    dragItems.setAttribute("draggable", false);
  });
});

containerEl.addEventListener("dragover", (e) => {
  e.preventDefault();
  let draggingElement = document.querySelector(".dragging");

  if (containerEl.firstElementChild === previousEl) {
    containerEl.prepend(draggingElement);
  } else if (
    containerEl.lastElementChild === previousEl ||
    containerEl.childElementCount <= 1
  ) {
    containerEl.appendChild(draggingElement);
  } else {
    containerEl.insertBefore(draggingElement, previousEl);
  }
});
