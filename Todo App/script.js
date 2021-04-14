const listsEl = document.getElementById("lists");
const formEl = document.getElementById("form");
const AddTodoBtnEl = document.querySelector("#AddTodoBtn p");
const ctaBtnsEl = document.querySelectorAll(".ctaBtn");
const getStatsEl = document.getElementById("getStats");
const bodyEl = document.querySelector("body");
const progressEl = document.getElementById("progress");
const percentEl = document.getElementById("percent");
const totalTaskEl = document.getElementById("totalTask");
const CompletedTaskEl = document.getElementById("CompletedTask");
const inCompletedTaskEl = document.getElementById("inCompletedTask");
const userNameEl = document.getElementById("userName");
const statUserNameEl = document.getElementById("statUserName");

let isEditMode = false;
let editEl = null;
let TODO_LOCALSTORAGE_KEY = `Todo`;
let userName = getUserName();
userNameEl.innerHTML = userName;

formEl.addEventListener("submit", addTodo);

class LocalStorage {
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.local = localStorage.getItem(this.localStorageKey)
      ? JSON.parse(localStorage.getItem(this.localStorageKey))
      : [];
  }

  save(newData) {
    this.local.push(newData);
    this.stringifyLocal();
  }

  delete(id) {
    this.local = this.local.filter((item) => item.id !== id);
    this.stringifyLocal();
  }

  update(id, task, description) {
    this.local = this.local.map((item) => {
      if (item.id === id) {
        item.task = task;
        item.description = description;
      }
      return item;
    });
    this.stringifyLocal();
  }

  updateIsCompleted(id, value) {
    this.local = this.local.map((item) => {
      if (item.id === id) {
        item.isCompleted = value;
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

let todoLocal = new LocalStorage(TODO_LOCALSTORAGE_KEY);

function addTodo(e) {
  e.preventDefault();
  let inputEl = this.querySelector("#userInput");
  let inputvalue = inputEl.value.trim();
  if (inputvalue)
    if (!isEditMode) createNewTodo(inputEl);
    else if (isEditMode) editMyTodo(inputEl);
}

// Changing User Name

userNameEl.addEventListener("click", NameModalInput);

// Creating New Todo

function createNewTodo(inputEl) {
  let inputvalue = inputEl.value.trim();
  let isDescriptionThere = inputvalue.includes(`//`);
  let task = inputvalue;
  let description = null;
  if (isDescriptionThere) {
    let indexOfComment = inputvalue.indexOf(`//`);
    task = inputvalue.slice(0, indexOfComment).trim();
    description = inputvalue
      .slice(indexOfComment + 2, inputvalue.length)
      .trim();
  }
  const todoData = {
    id: getTodoId(),
    task: task,
    date: getDate(),
    isCompleted: false,
    description: description,
  };
  createTodoEl(todoData);
  todoLocal.save(todoData);
  inputEl.value = null;
}

function createTodoEl(todo) {
  const liEl = document.createElement("li");
  // liMain
  const liMain = document.createElement("div");
  liMain.classList.add("liMain");
  // liLeft
  const liLeft = document.createElement("div");
  liLeft.classList.add("lileft");
  liEl.appendChild(liMain);

  // Li id

  liEl.dataset.id = todo.id;

  // Check

  const checkEl = document.createElement("div");
  checkEl.classList.add("check");

  const todoTextEl = document.createElement("div");

  if (!todo.isCompleted) {
    // Circle
    const circleEl = document.createElement("div");
    circleEl.classList.add("circle");
    checkEl.appendChild(circleEl);
  } else if (todo.isCompleted) {
    // Check
    checkEl.innerHTML = `<span class="material-icons"> done </span>`;
    liEl.classList.add("completed");
  }
  liLeft.appendChild(checkEl);

  todoTextEl.className = `todoText`;
  const todoPara = document.createElement("h1");
  todoPara.innerHTML = todo.task;
  const todoDate = document.createElement("p");
  todoDate.innerHTML = todo.date;
  todoTextEl.appendChild(todoPara);
  todoTextEl.appendChild(todoDate);
  liLeft.appendChild(todoTextEl);

  liMain.appendChild(liLeft);

  // Li Right
  const liRight = document.createElement("div");
  liRight.classList.add("liRight");
  const iconsEl = document.createElement("div");
  iconsEl.classList.add("icons");

  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<span class="material-icons"> create </span>`;
  editBtn.classList.add("edit");

  const delBtn = document.createElement("button");
  delBtn.innerHTML = `<span class="material-icons"> delete </span>`;
  delBtn.classList.add("delete");
  iconsEl.appendChild(editBtn);
  iconsEl.appendChild(delBtn);

  liRight.appendChild(iconsEl);
  liMain.appendChild(liRight);

  // Description
  if (todo.description) {
    const description = document.createElement("div");
    description.classList.add("todoDescription");
    const descPara = document.createElement("p");
    descPara.innerHTML = todo.description;
    description.appendChild(descPara);
    liEl.appendChild(description);
  }

  listsEl.prepend(liEl);

  // Event listeners

  editBtn.addEventListener("click", (e) => {
    isEditMode = true;
    editEl = liEl;
    updateEditView(liEl);
    AddTodoBtnEl.innerHTML = `Edit Todo`;

    createEditRipple(editBtn, e);
  });

  delBtn.addEventListener("click", (e) => {
    liEl.remove();
    todoLocal.delete(liEl.dataset.id);
  });

  // Checkbox Event

  checkEl.addEventListener("click", (e) => {
    checkEl.innerHTML = null;
    let isCompValue = false;
    if (liEl.classList.contains("completed")) {
      liEl.classList.remove("completed");
      const circleEl = document.createElement("div");
      circleEl.classList.add("circle");
      checkEl.appendChild(circleEl);
      isCompValue = false;
    } else {
      liEl.classList.add("completed");
      // Check
      checkEl.innerHTML = `<span class="material-icons"> done </span>`;
      isCompValue = true;
    }
    todoLocal.updateIsCompleted(liEl.dataset.id, isCompValue);
  });
}

function getDate() {
  let date = new Date();
  let days = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
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
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let todayDate = date.getDate();
  return `${day}, ${month} ${todayDate}`;
}

function editMyTodo(inputEl) {
  let todoPara = editEl.querySelector(".lileft .todoText h1");
  let id = editEl.dataset.id;
  let inputvalue = inputEl.value;
  let task = inputvalue.trim();
  let description = null;
  let indexOfComment =
    inputvalue.indexOf("//") === -1 ? false : inputvalue.indexOf("//");
  if (indexOfComment) {
    task = task.slice(0, indexOfComment).trim();
    description = inputvalue
      .slice(indexOfComment + 2, inputvalue.length)
      .trim();
  }
  if (description) {
    let descriptionElement = editEl.querySelector(".todoDescription");
    if (descriptionElement) {
      descriptionElement.querySelector("p").innerHTML = description;
    } else if (!descriptionElement) {
      const newDecriptionEle = document.createElement("div");
      newDecriptionEle.classList.add("todoDescription");
      const newDescPara = document.createElement("p");
      newDescPara.innerHTML = description;
      newDecriptionEle.appendChild(newDescPara);
      editEl.appendChild(newDecriptionEle);
    }
  } else if (!description) {
    let descriptionElement = editEl.querySelector(".todoDescription");
    if (descriptionElement) {
      descriptionElement.remove();
    }
  }
  todoPara.innerHTML = task;
  inputEl.value = null;
  isEditMode = false;
  editEl = null;
  AddTodoBtnEl.innerHTML = `Add Todo`;
  todoLocal.update(id, task, description);
}

function updateEditView(liEl) {
  const inputEl = document.getElementById("userInput");
  let inputPlaceHolder = null;
  let task = liEl.querySelector(".lileft .todoText h1").innerHTML;
  let descriptionEl = liEl.querySelector(".todoDescription");
  inputPlaceHolder = task;
  if (descriptionEl) {
    let description = descriptionEl.querySelector("p").innerHTML;
    inputPlaceHolder += ` // ${description}`;
  }
  inputEl.value = inputPlaceHolder.trim();
}

function getTodoId() {
  return Math.floor(Math.random() * 10000000).toString(16);
}

// Button Ripple Effect

ctaBtnsEl.forEach((button) => {
  button.addEventListener("click", (e) => {
    const spanEl = document.createElement("span");
    spanEl.classList.add("ripple");

    let topPos = e.clientY - button.getBoundingClientRect().top;
    let leftPos = e.clientX - button.getBoundingClientRect().left;

    spanEl.style.cssText = `
    position: absolute;
    height: 150px;
    width: 150px;
    background-color: #1bc42b8a;
    top: ${topPos}px;
    left: ${leftPos}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
     animation: .8s ease rippleEffect;
    `;

    button.prepend(spanEl);

    spanEl.addEventListener("animationend", (e) => {
      spanEl.remove();
    });
  });
});

// Edit Ripple

function createEditRipple(elem, e) {
  const spanEl = document.createElement("span");
  spanEl.classList.add("ripple");

  let topPos = e.clientY - elem.getBoundingClientRect().top;
  let leftPos = e.clientX - elem.getBoundingClientRect().left;

  spanEl.style.cssText = `
    position: absolute;
    height: 50px;
    width: 50px;
    background-color: #1bc42c48;
    top: ${topPos}px;
    left: ${leftPos}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
     animation: .8s ease rippleEffect;
    `;

  elem.prepend(spanEl);

  spanEl.addEventListener("animationend", (e) => {
    spanEl.remove();
  });
}

getStatsEl.addEventListener("click", (e) => {
  showStats();
  bodyEl.classList.toggle("sideActive");
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("overlay")) {
    bodyEl.classList.remove("sideActive");
  }
});

function showStats() {
  let local = todoLocal.local;
  let totalTaskLength = local.length;
  const completedTaskLength = local.filter((item) => item.isCompleted).length;
  const inCompletedTaskLength = totalTaskLength - completedTaskLength;
  const percentage =
    Math.floor((completedTaskLength / totalTaskLength) * 100).toString() ===
    `NaN`
      ? 0
      : Math.floor((completedTaskLength / totalTaskLength) * 100);

  totalTaskEl.innerHTML = totalTaskLength;
  CompletedTaskEl.innerHTML = completedTaskLength;
  inCompletedTaskEl.innerHTML = inCompletedTaskLength;
  percentEl.innerHTML = `${percentage}%`;
  progressEl.style.cssText = `stroke-dashoffset: calc(380 - (380 * ${percentage}) / 100)`;
}

function NameModalInput() {
  // Popup Cont
  const modalCont = document.createElement("div");
  modalCont.classList.add("modalCont");

  const modalEl = document.createElement("div");
  modalEl.classList.add("modal");
  modalCont.appendChild(modalEl);
  // Top Cont

  const topCont = document.createElement("div");
  topCont.classList.add("topCont");
  const logoEl = document.createElement("div");
  logoEl.classList.add("logo");
  const imgEl = document.createElement("img");
  imgEl.src = `./Images/Logo.png`;
  logoEl.appendChild(imgEl);
  topCont.appendChild(logoEl);
  const textContent = document.createElement("div");
  textContent.classList.add("textContent");
  const textHead = document.createElement("h1");
  textHead.innerHTML = `Hey, User`;
  const textPara = document.createElement("p");
  textPara.innerHTML = `Stick with your Goals by achieving your tasks`;
  textContent.appendChild(textHead);
  textContent.appendChild(textPara);
  topCont.appendChild(textContent);
  modalEl.appendChild(topCont);

  const formEl = document.createElement("form");
  const labelEl = document.createElement("label");
  labelEl.htmlFor = `inputNametext`;
  labelEl.innerHTML = `Enter your name`;
  const inputEl = document.createElement("input");
  inputEl.type = `text`;
  inputEl.placeholder = `Enter your Username`;
  const buttonEl = document.createElement("button");
  buttonEl.type = `submit`;
  buttonEl.innerHTML = `Submit`;

  inputEl.value = userName;
  formEl.appendChild(labelEl);
  formEl.appendChild(inputEl);
  formEl.appendChild(buttonEl);
  modalEl.appendChild(formEl);
  bodyEl.appendChild(modalCont);
  bodyEl.classList.add("userNameModal");
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputEl.value.trim()) {
      userName = inputEl.value;
      userNameEl.innerHTML = userName;
      statUserNameEl.innerHTML = userName;
      localStorage.setItem("userName", userName);
    }
    modalCont.remove();
    bodyEl.classList.remove("userNameModal");
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modalOverlay")) {
      modalCont.remove();
      bodyEl.classList.remove("userNameModal");
    }
  });
}

function getUserName() {
  return localStorage.getItem("userName")
    ? localStorage.getItem("userName")
    : `User`;
}

(function setUserName() {
  let user = localStorage.getItem("userName");
  if (!user) return NameModalInput();
})();

(function () {
  let local = todoLocal.local;
  if (local.length) local.forEach((item) => createTodoEl(item));
})();
