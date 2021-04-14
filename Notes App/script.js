const notesEl = document.getElementById("notes");
const userSearchEl = document.getElementById("userSearch");
const sectionEl = document.getElementById("section");
const addNoteEl = document.getElementById("addNote");
const bodyEl = document.querySelector("body");

let isEditingMode = false;
let LOCALSTORAGE_NOTES_KEY = `Notes App`;
let previousBackground = null;

// LocalStorage

class LocalStorage {
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.local = localStorage.getItem(this.localStorageKey)
      ? JSON.parse(localStorage.getItem(this.localStorageKey))
      : [];
  }

  save(newNote) {
    this.local.push(newNote);
    this.stringifyLocal();
  }

  delete(id) {
    this.local = this.local.filter((item) => item.id !== id);
    this.stringifyLocal();
  }

  update(id, title, text) {
    this.local = this.local.map((item) => {
      if (item.id === id) {
        item.title = title;
        item.text = text;
      }
      return item;
    });
    this.stringifyLocal();
  }

  updateIsStared(id, value) {
    this.local = this.local.map((item) => {
      if (item.id === id) {
        item.isStared = value;
      }
      return item;
    });
    this.stringifyLocal();
  }

  stringifyLocal() {
    return localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.local)
    );
  }
}

const noteLocal = new LocalStorage("Notes App");

addNoteEl.addEventListener("click", (e) => {
  let noteCount = noteLocal.local.length ? noteLocal.local.length : ``;
  getNotePad(`New note ${noteCount}`, null);
  bodyEl.classList.add("notePad__active");
});

function createNoteDOM(data) {
  const noteEl = document.createElement("div");
  noteEl.classList.add("note");
  noteEl.setAttribute("data-noteId", data.id);
  noteEl.style.background = data.backgroundColor;
  // Header
  const headerEl = document.createElement("header");
  const titleEl = document.createElement("div");
  titleEl.classList.add("title");
  const titlePara = document.createElement("h1");
  titlePara.innerHTML = data.title;
  titleEl.appendChild(titlePara);
  headerEl.appendChild(titleEl);
  // Header Star
  const starContEl = document.createElement("div");
  starContEl.classList.add("starCont");
  starContEl.innerHTML = data.isStared
    ? `<ion-icon name="star"></ion-icon>`
    : `<ion-icon name="star-outline"></ion-icon>`;
  headerEl.appendChild(starContEl);
  noteEl.appendChild(headerEl);

  if (data.isStared) {
    noteEl.classList.add("stared");
  }

  // star Event listener

  starContEl.addEventListener("click", (e) => {
    data.isStared = !data.isStared;
    starContEl.innerHTML = data.isStared
      ? `<ion-icon name="star"></ion-icon>`
      : `<ion-icon name="star-outline"></ion-icon>`;

    data.isStared
      ? noteEl.classList.add("stared")
      : noteEl.classList.remove("stared");
    noteLocal.updateIsStared(data.id, data.isStared);
  });

  // Text area cont

  const textAreaContEl = document.createElement("div");
  textAreaContEl.classList.add("textareaNote");

  const notePara = document.createElement("p");
  notePara.innerHTML = data.text;
  textAreaContEl.appendChild(notePara);
  noteEl.appendChild(textAreaContEl);

  // DateAndEditBtn
  const dateAndEditBtnEl = document.createElement("div");
  dateAndEditBtnEl.classList.add("dateAndEditBtn");
  const dateEl = document.createElement("div");
  dateEl.classList.add("date");
  const datePara = document.createElement("p");
  datePara.innerHTML = data.date;
  dateEl.appendChild(datePara);
  dateAndEditBtnEl.appendChild(dateEl);

  const editBtnEl = document.createElement("div");
  editBtnEl.classList.add("ctaBtns");
  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<ion-icon name="pencil"></ion-icon>`;
  editBtnEl.appendChild(editBtn);
  editBtn.classList.add("edit");
  const delBtn = document.createElement("button");
  delBtn.classList.add("delete");
  delBtn.innerHTML = `<ion-icon name="trash"></ion-icon>`;
  editBtnEl.appendChild(delBtn);

  dateAndEditBtnEl.appendChild(editBtnEl);
  noteEl.appendChild(dateAndEditBtnEl);
  notesEl.appendChild(noteEl);

  editBtn.addEventListener("click", (e) => {
    isEditingMode = true;
    getNotePad(titleEl.innerText, notePara.innerHTML, noteEl);
    bodyEl.classList.add("notePad__active");
  });

  delBtn.addEventListener("click", (e) => {
    noteEl.remove();
    noteLocal.delete(data.id);
  });
}

function getNotePad(title, note, currentEditEl) {
  const addNoteEl = document.createElement("div");
  addNoteEl.classList.add("addNote");
  const mainEl = document.createElement("main");
  addNoteEl.appendChild(mainEl);

  // noteTitleCont
  const noteTitleContEl = document.createElement("div");
  noteTitleContEl.classList.add("noteTitleCont");
  const fromEl = document.createElement("form");
  const noteTitle = document.createElement("h1");
  noteTitle.innerHTML = title;

  fromEl.appendChild(noteTitle);
  const inputEl = document.createElement("input");
  inputEl.value = title;

  // Change title

  noteTitle.addEventListener("click", (e) => {
    fromEl.innerHTML = ``;
    fromEl.appendChild(inputEl);
    inputEl.value = noteTitle.innerHTML;
    inputEl.focus();
    inputEl.placeholder = `Enter the title`;
  });
  fromEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputEl.value.trim()) {
      fromEl.innerHTML = ``;
      noteTitle.innerHTML = inputEl.value;
      fromEl.appendChild(noteTitle);
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target !== inputEl && e.target !== noteTitle) {
      fromEl.innerHTML = ``;
      noteTitle.innerHTML = inputEl.value.trim()
        ? inputEl.value
        : noteTitle.innerHTML;
      fromEl.appendChild(noteTitle);
    }
  });

  noteTitleContEl.appendChild(fromEl);
  const saveBtnEl = document.createElement("div");
  const saveBtn = document.createElement("button");
  saveBtn.id = `save`;
  saveBtn.innerHTML = `Save`;
  saveBtnEl.appendChild(saveBtn);
  const closeBtn = document.createElement("button");
  closeBtn.id = `close`;
  closeBtn.innerHTML = `Close`;
  saveBtnEl.appendChild(closeBtn);
  noteTitleContEl.appendChild(saveBtnEl);
  mainEl.appendChild(noteTitleContEl);

  const userNoteEl = document.createElement("div");
  userNoteEl.classList.add("userNote");
  const textAreaNote = document.createElement("textarea");
  textAreaNote.placeholder = `Enter your Text`;
  textAreaNote.value = note;
  userNoteEl.appendChild(textAreaNote);
  mainEl.appendChild(userNoteEl);
  sectionEl.appendChild(addNoteEl);

  // save

  saveBtn.addEventListener("click", (e) => {
    if (textAreaNote.value.trim()) {
      let newTitle = noteTitle.innerText;
      let newNote = textAreaNote.value;
      setNotesDOM(newTitle, newNote, currentEditEl);
      addNoteEl.remove();
      bodyEl.classList.remove("notePad__active");
    } else alert("Note cannot be empty");
  });

  // Close Btn

  closeBtn.addEventListener("click", (e) => {
    isEditingMode = false;
    addNoteEl.remove();
    bodyEl.classList.remove("notePad__active");
  });
}
function setNotesDOM(title, note, currentEditEl) {
  if (!isEditingMode) {
    const newNote = {
      id: getRandomId(),
      date: getCurrentDate(),
      text: note,
      title,
      backgroundColor: getRandomBackground(),
      isStared: false,
    };
    createNoteDOM(newNote);
    noteLocal.save(newNote);
  } else if (isEditingMode) {
    const id = currentEditEl.dataset.noteid;
    const titleEl = currentEditEl.querySelector("header .title h1");
    const noteEl = currentEditEl.querySelector(".textareaNote p");
    titleEl.innerHTML = title;
    noteEl.innerHTML = note;
    noteLocal.update(id, title, note);
    isEditingMode = false;
  }
}

function getRandomId() {
  return Math.floor(Math.random() * 10000000).toString(16);
}

function getCurrentDate() {
  const date = new Date();
  let months = [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`,
  ];
  const month = months[date.getMonth()];
  const todayDate = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${todayDate} ${year}`;
}

function getRandomBackground() {
  let backgroundColors = [
    `#b8dbd9`,
    `#d0f4de`,
    `#fcf6bd`,
    `#f7d488`,
    `#4eaf9c`,
  ];

  let currentBackground =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  if (previousBackground === currentBackground) {
    return getRandomBackground();
  }
  previousBackground = currentBackground;
  return currentBackground;
}

// Search Function

userSearchEl.addEventListener("input", searchNote);

function searchNote(e) {
  let notes = notesEl.querySelectorAll(".note");
  let value = this.value;
  notes.forEach((note) => {
    let noteTitle = note.querySelector("header .title h1");
    let notePara = note.querySelector(".textareaNote p");
    let regex = new RegExp(value, "gi");
    note.style.display = `none`;
    if (notePara.innerText.match(regex) || noteTitle.innerText.match(regex)) {
      note.style.display = `unset`;
    }
  });
}

(function () {
  let local = noteLocal.local;
  if (local.length) {
    local.forEach((item) => {
      createNoteDOM(item);
    });
    previousBackground = local[local.length - 1].backgroundColor;
  }
})();
