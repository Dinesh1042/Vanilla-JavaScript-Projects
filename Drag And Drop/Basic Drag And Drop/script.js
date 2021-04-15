const dragItemEl = document.getElementById("dragItem");
const dropboxesEl = [...document.querySelectorAll(".dropbox")];

// Drag

dragItemEl.addEventListener("mousedown", (e) => {
  dragItemEl.setAttribute("draggable", true);
  dragItemEl.classList.add("dragging");
});
dragItemEl.addEventListener("mouseup", (e) => {
  dragItemEl.setAttribute("draggable", false);
  dragItemEl.classList.remove("dragging");
});

dragItemEl.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData(`text`, e.target.id);
});

dropboxesEl.forEach((dropbox) => {
  dropbox.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    dropbox.appendChild(document.getElementById(data));
    dropbox.classList.add("dropped");
  });
  dropbox.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropbox.classList.remove("dropped");
  });
  dropbox.addEventListener("dragenter", (e) => {
    dropbox.classList.add("over");
  });
  dropbox.addEventListener("dragleave", (e) => {
    dropbox.classList.remove("over");
  });
});
