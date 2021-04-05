const totalNumberEl = document.getElementById("totalNumber");
const currentNumberEl = document.getElementById("currentNumber");
const allNumberEl = document.querySelectorAll(".number");
const alloperatorEl = document.querySelectorAll(".operator");
const tempResultEl = document.getElementById("tempResult");
const equalToEl = document.getElementById("equalTo");
const clearEl = document.getElementById("clear");
const clearAllEl = document.getElementById("clearAll");
const allButtonsEl = document.querySelectorAll(".numberCont div");

let numberCurrent = ``;
let numberTotal = ``;
let isDecimalAdded = false;
let isOperatorClickedFirst = false;
let isOperatorAdded = false;
let tempResult = null;
let lastOperator = null;
let isEqualToClicked = false;
let notCalculating = false;

// Event Listener

//  -------------------

// Number Event Listener

allNumberEl.forEach((number) => {
  number.addEventListener("click", displayInput);
});

// Operator EventListener

alloperatorEl.forEach((operator) => {
  operator.addEventListener("click", addOperator);
});

// Equal To EventListener

equalToEl.addEventListener("click", finalResult);

// ClearAll

clearAllEl.addEventListener("click", clearAll);

// Clear last one

clearEl.addEventListener("click", clearLast);

// Displaying the input Number

function displayInput() {
  notCalculating = true;
  if (isEqualToClicked && notCalculating) {
    clearAll();
    isEqualToClicked = false;
    notCalculating = false;
  }

  let currentNumber = this.dataset.value;
  if (currentNumber === "." && !isDecimalAdded) isDecimalAdded = true;
  else if (currentNumber === "." && isDecimalAdded) return;
  // Concating the numbers
  numberCurrent += currentNumber;
  currentNumberEl.innerHTML = numberCurrent;
  isOperatorClickedFirst = true;
  isOperatorAdded = false;
}

// Adding Operator

function addOperator() {
  if (!isOperatorClickedFirst) return;
  let currentOperatorDisplay = this.innerHTML;
  let currentOperator = this.dataset.value;
  if (!isOperatorAdded) {
    isOperatorAdded = true;
    isDecimalAdded = false;
    notCalculating = false;
    isEqualToClicked = false;
    if (!numberTotal) tempResult;
    if (numberCurrent && numberTotal && tempResult) {
      calculateTotal();
    } else {
      if (tempResult) {
        tempResult = tempResult;
      } else {
        tempResult = numberCurrent;
      }
    }
    clearInput(currentOperatorDisplay, false);
    lastOperator = currentOperator;
  } else if (isOperatorAdded) {
    clearInput(currentOperatorDisplay, true);
    lastOperator = currentOperator;
  }
  updateTempResult();
}

// Clear the input

function clearInput(operatorName, isThereOperator) {
  if (!isThereOperator) {
    numberTotal += `${numberCurrent} ${operatorName} `;
  } else if (isThereOperator) {
    numberTotal = numberTotal.slice(0, -2) + operatorName + ` `;
  }
  totalNumberEl.innerHTML = numberTotal;
  numberCurrent = ``;
  currentNumberEl.innerHTML = ``;
}

// Update TempResult

function updateTempResult() {
  tempResultEl.innerHTML = tempResult;
}

// Calculate Total

function calculateTotal() {
  return (tempResult = eval(`${tempResult} ${lastOperator} ${numberCurrent}`));
}

function clearAll() {
  numberCurrent = ``;
  numberTotal = ``;
  isDecimalAdded = false;
  isOperatorClickedFirst = false;
  isOperatorAdded = false;
  tempResult = null;
  lastOperator = null;
  isEqualToClicked = false;
  currentNumberEl.innerHTML = 0;
  totalNumberEl.innerHTML = 0;
  tempResultEl.innerHTML = ``;
}

function clearLast() {
  numberCurrent = numberCurrent.slice(0, -1);
  currentNumberEl.innerHTML = numberCurrent;
}

function finalResult() {
  if (numberCurrent && lastOperator && numberTotal) {
    calculateTotal();
    currentNumberEl.innerHTML = tempResult;
    numberTotal = tempResult;
    tempResult = tempResult;
    numberCurrent = ``;
    totalNumberEl.innerHTML = ``;
    tempResultEl.innerHTML = ``;
    isEqualToClicked = true;
  }
}

// Button Ripple Effect

allButtonsEl.forEach((button) => {
  button.addEventListener("click", (e) => {
    let topPos = e.clientY - button.getBoundingClientRect().top;
    let leftPos = e.clientX - button.getBoundingClientRect().left;
    const spanEl = document.createElement("span");
    spanEl.classList.add("overlay");
    spanEl.style.cssText = `
      position: absolute;
      height: 150px;
      width:150px;
      background-color: #9292ff4f;
      top: ${topPos}px;
      left: ${leftPos}px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple .5s ease;
      `;
    button.appendChild(spanEl);
    spanEl.addEventListener("animationend", (e) => {
      spanEl.remove();
    });
  });
});

// KeyBoard Events

window.addEventListener("keyup", (e) => {
  if (
    e.key == 1 ||
    e.key == 2 ||
    e.key == 3 ||
    e.key == 4 ||
    e.key == 5 ||
    e.key == 6 ||
    e.key == 7 ||
    e.key == 8 ||
    e.key == 9 ||
    e.key == 0 ||
    e.key == "."
  ) {
    clickBtn(e.key);
  } else if (
    e.key == "/" ||
    e.key == "+" ||
    e.key == "-" ||
    e.key == "%" ||
    e.key == "*"
  ) {
    operationBtn(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    return finalResult();
  } else if (e.key === "Backspace") {
    clearLast();
  }
});

function clickBtn(key) {
  allNumberEl.forEach((button) => {
    if (button.dataset.value == key) {
      button.click();
    }
  });
}

function operationBtn(key) {
  alloperatorEl.forEach((op) => {
    if (op.dataset.value == key) {
      op.click();
    }
  });
}
