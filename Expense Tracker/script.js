const balanceEl = document.getElementById("balance");
const moneyPlusEl = document.getElementById("moneyPlus");
const moneyMinusEl = document.getElementById("moneyMinus");
const formEl = document.getElementById("form");
const userTextEl = document.getElementById("userText");
const priceEl = document.getElementById("price");
const listEl = document.getElementById("list");

let isEditMode = false;
let editElement = null;

let datas = getLocal();

function createListElement(data) {
  const liEl = document.createElement("li");

  const attr = document.createAttribute(`data-id`);
  attr.value = data.id;

  liEl.setAttributeNode(attr);

  liEl.classList.add(data.price < 0 ? `expense` : `income`);
  // List left
  const liLeft = document.createElement("div");

  liLeft.classList.add("liLeft");
  const liLeftPara = document.createElement("p");
  liLeftPara.innerHTML = data.text;
  liLeft.appendChild(liLeftPara);

  liEl.appendChild(liLeft);

  // List Right

  const liRight = document.createElement("div");
  liRight.classList.add("liRight");
  const textContent = document.createElement("div");
  textContent.classList.add("textContent");
  const textContentPara = document.createElement("p");
  textContentPara.innerHTML =
    data.price > -1 ? `+ $${data.price}` : `- $${Math.abs(data.price)}`;
  textContent.appendChild(textContentPara);
  liRight.appendChild(textContent);
  const controlsEl = document.createElement("div");
  controlsEl.classList.add("controls");
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerHTML = `<ion-icon name="create"></ion-icon>`;
  controlsEl.appendChild(editBtn);
  // Delete btn
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = `<ion-icon name="trash"></ion-icon>`;
  controlsEl.appendChild(deleteBtn);
  liRight.appendChild(controlsEl);
  liEl.appendChild(liRight);
  listEl.appendChild(liEl);

  // Event Listener

  editBtn.addEventListener("click", (e) => {
    isEditMode = true;
    editElement = liEl;
    userTextEl.value = data.text;
    priceEl.value = data.price;
  });

  // Delete

  deleteBtn.addEventListener("click", (e) => {
    liEl.remove();
    datas = datas.filter((item) => item.id !== attr.value);
    createDOMList();
    updateIncomeAndExpense();
    deleteLocal(attr.value);
  });
}

function createDOMList() {
  listEl.innerHTML = ``;
  if (datas.length) {
    datas.forEach((data) => {
      createListElement(data);
    });
    updateIncomeAndExpense();
  }
}

function updateIncomeAndExpense() {
  const amounts = datas.map((data) => data.price);

  const balance = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);

  const income = amounts
    .filter((value) => value > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const expense = (
    amounts.filter((value) => value < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balanceEl.innerHTML = balance > -1 ? `$${balance}` : `-$${Math.abs(balance)}`;
  moneyPlusEl.innerHTML = `$${income}`;
  moneyMinusEl.innerHTML = `$${expense}`;
}

createDOMList();

formEl.addEventListener("submit", addTransation);

function addTransation(e) {
  e.preventDefault();
  if (userTextEl.value.trim() && priceEl.value.trim()) {
    if (!isEditMode) {
      const inputData = {
        id: getRandomId(),
        text: userTextEl.value,
        price: JSON.parse(priceEl.value),
      };
      datas.unshift(inputData);
      setLocal(inputData);
      createDOMList();
      userTextEl.value = ``;
      priceEl.value = ``;
    }
    if (isEditMode && editElement) {
      isEditMode = false;
      let textEl = editElement.querySelector(".liLeft p");
      let amountEl = editElement.querySelector(".liRight .textContent p");
      let id = editElement.dataset.id;
      textEl.innerHTML = userTextEl.value;
      amountEl.innerHTML = priceEl.value;

      datas = datas.map((item) => {
        if (item.id === id) {
          item.text = userTextEl.value;
          item.price = JSON.parse(priceEl.value);
        }
        return item;
      });

      let transation = { id, text: userTextEl.value, price: priceEl.value };

      updateLocal(transation);

      userTextEl.value = ``;
      priceEl.value = ``;
      editElement = null;
      createDOMList();
    }
  } else alert("field Cannot be empty");
}

function getRandomId() {
  return Math.floor(Math.random() * 10000000).toString(16);
}

// LocalStorage

function getLocal() {
  return localStorage.getItem("Expense Tacker")
    ? JSON.parse(localStorage.getItem("Expense Tacker"))
    : [];
}

function setLocal(transation) {
  let local = getLocal();
  local.unshift(transation);
  localStorage.setItem("Expense Tacker", JSON.stringify(local));
}

function updateLocal(transation) {
  let local = getLocal();
  local = local.map((item) => {
    if (item.id === transation.id) {
      item.text = transation.text;
      item.price = JSON.parse(transation.price);
    }
    return item;
  });
  localStorage.setItem("Expense Tacker", JSON.stringify(local));
}

function deleteLocal(id) {
  let local = getLocal();
  local = local.filter((item) => item.id !== id);
  localStorage.setItem("Expense Tacker", JSON.stringify(local));
}
