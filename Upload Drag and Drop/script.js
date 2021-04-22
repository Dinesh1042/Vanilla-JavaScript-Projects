const uploadInputEl = document.getElementById("uploadInput");
const dropAreaEl = document.getElementById("dropArea");
const uploadedFileContEl = document.getElementById("uploadedFileCont");
const uploadBtnContEl = document.getElementById("uploadBtnCont");
const browseBtnEl = document.getElementById("browseBtn");
const dropTextEl = document.getElementById("dropText");

dropAreaEl.addEventListener("dragover", dragOver);
dropAreaEl.addEventListener("dragleave", dragLeave);
dropAreaEl.addEventListener("drop", dropItem);
browseBtnEl.addEventListener("click", browseFile);
uploadInputEl.addEventListener("change", uploadFile);

let files = [];

function dragOver(e) {
  e.preventDefault();
  this.classList.add("content-over");
  dropTextEl.innerHTML = `Release to Upload files`;
}

function dragLeave(e) {
  e.preventDefault();
  this.classList.remove("content-over");
  dropTextEl.innerHTML = `Drag & Drop your files`;
}

function browseFile() {
  uploadInputEl.click();
}

function uploadFile() {
  let file = [...this.files];
  file.forEach((fl) => (fl.fileId = getRandomFileId()));
  dropFile(file);
}

function dropItem(e, currentFile) {
  e.preventDefault();
  currentFile = [...e.dataTransfer.files];
  currentFile.forEach((file) => (file.fileId = getRandomFileId()));
  dropFile(currentFile);
}

function dropFile(currentFile) {
  files.push(...currentFile);
  uploadedFileContEl.innerHTML = null;
  files.forEach((data) => createFileHolderEl(data));
}

function createFileHolderEl(file) {
  const uploadedFileEl = document.createElement("div");
  uploadedFileEl.classList.add("uploadedFile");

  // Filename
  const fileNameCont = document.createElement("div");
  fileNameCont.classList.add("fileName");

  const fileName = document.createElement("p");
  fileNameCont.appendChild(fileName);
  fileName.innerHTML = file.name; //
  uploadedFileEl.appendChild(fileNameCont);

  const fileSize = document.createElement("span");
  fileNameCont.appendChild(fileSize);
  let sizeInMb =
    (file.size / (1024 * 1024)).toFixed(2) <= 0
      ? `${file.size} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  fileSize.innerHTML = sizeInMb;
  const closeBtn = document.createElement("div");
  closeBtn.classList.add("closeBtn");
  uploadedFileEl.appendChild(closeBtn);
  closeBtn.innerHTML = `<ion-icon name="close"></ion-icon>`;
  uploadedFileContEl.prepend(uploadedFileEl);
  closeBtn.addEventListener("click", (e) => {
    uploadedFileEl.remove();
    removeFile(file.fileId);
    if (!files.length) uploadBtnContEl.classList.remove("content-here");
  });
  if (files.length) uploadBtnContEl.classList.add("content-here");
  dropAreaEl.classList.remove("content-over");
  dropTextEl.innerHTML = `Drag & Drop your files`;
}

function getRandomFileId() {
  return Math.floor(Math.random() * 10000000).toString(16);
}

function removeFile(fileId) {
  return (files = files.filter((file) => file.fileId !== fileId));
}
