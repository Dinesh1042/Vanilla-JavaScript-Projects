const totalValueEl = document.getElementById("totalValue");
const currentValueEl = document.getElementById("currentValue");
const tempValueEl = document.getElementById("tempValue");
const numberEls = document.querySelectorAll(".numberCont .number");
const operatorEls = document.querySelectorAll(".numberCont .operator");
const equalToEl = document.getElementById("equalTo");
const clearEl = document.getElementById("clear");
const allClearEl = document.getElementById("allClear");
const allBUttons = document.querySelectorAll(".numberCont div");

class Calculator {
  constructor(currentEl, totalEl, tempResultEl) {
    this.currentEl = currentEl;
    this.totalEl = totalEl;
    this.tempResultEl = tempResultEl;
  }
  display1 = ``;
  display2 = ``;
  tempResult = null;
  operator = null;
  isEqualToClicked = false;
  isNumberClicked = false;
  isOperatorThere = false;

  appendTextToCurrentText(text) {
    currentValueEl.classList.remove("final");
    this.isNumberClicked = true;
    if (this.isEqualToClicked && this.isNumberClicked) {
      this.isNumberClicked = false;
      this.isEqualToClicked = false;
      this.clearAll();
    }

    let number = text.target.closest(".number").dataset.value;

    if (number === "." && this.display1.includes(".")) return;
    this.display1 += number;
    currentValueEl.innerHTML = this.display1;
  }

  chooseOperation(operator) {
    let currentOperator = operator.target.dataset.value;
    let currentOperatorText = operator.target.querySelector("p").innerHTML;
    if (this.display2 && this.isOperatorThere && !this.display1) {
      this.clearInput(currentOperatorText, true);
      this.operator = currentOperator;
      console.log("data");

      return;
    }
    if (!this.display1) return;

    if (this.tempResult && this.display1 && this.operator) {
      this.calculateTotal();
    } else {
      if (!this.tempResult) {
        this.tempResult = this.display1;
      } else if (this.tempResult) {
        this.tempResult = this.tempResult;
      }
    }
    this.operator = currentOperator;
    this.clearInput(currentOperatorText, false);
    this.updateTempResult();
    this.isEqualToClicked = false;
    this.isOperatorThere = true;
  }

  clearInput(text, isOperatorAdded) {
    if (!isOperatorAdded) this.display2 += `${this.display1} ${text} `;
    else if (isOperatorAdded)
      this.display2 = `${this.display2.slice(0, -2)} ${text} `;
    this.totalEl.innerHTML = this.display2;
    this.display1 = ``;
    this.currentEl.innerHTML = ``;
  }

  updateTempResult() {
    this.tempResultEl.innerHTML = this.tempResult;
  }

  calculateTotal() {
    if (this.tempResult && this.display1 && this.operator) {
      return (this.tempResult = eval(
        `${this.tempResult} ${this.operator} ${this.display1}`
      ));
    }
  }

  equalTo() {
    if (!this.display1) return;
    if (this.tempResult && this.display1 && this.operator) {
      this.calculateTotal();
      this.currentEl.innerHTML = this.tempResult;
      this.tempResultEl.innerHTML = ``;
      this.display1 = this.tempResult;
      this.operator = null;
      this.display2 = ``;
      this.totalEl.innerHTML = ``;
      this.isEqualToClicked = true;
      currentValueEl.classList.add("final");
    }
  }

  clearAll() {
    this.display1 = ``;
    this.display2 = ``;
    this.tempResult = null;
    this.operator = null;
    this.isEqualToClicked = false;
    this.isNumberClicked = false;

    currentValueEl.innerHTML = 0;
    totalValueEl.innerHTML = 0;
    tempValueEl.innerHTML = ``;
    currentValueEl.classList.remove("final");
  }
  clearLastEntity() {
    this.display1 = this.display1.slice(0, -1);
    currentValueEl.innerHTML = this.display1;
  }
}

const calc = new Calculator(currentValueEl, totalValueEl, tempValueEl);

numberEls.forEach((number) => {
  number.addEventListener("click", (e) => {
    calc.appendTextToCurrentText(e);
  });
});

operatorEls.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    calc.chooseOperation(e);
  });
});

equalToEl.addEventListener("click", (e) => {
  calc.equalTo();
});

allClearEl.addEventListener("click", (e) => {
  calc.clearAll();
});

clearEl.addEventListener("click", (e) => {
  calc.clearLastEntity();
});

// Ripple Effects

allBUttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const spanEl = document.createElement("div");
    spanEl.classList.add("ripple");

    let topPos = e.clientY - button.getBoundingClientRect().top;
    let leftPos = e.clientX - button.getBoundingClientRect().left;

    spanEl.style.cssText = `
      position: absolute;
      height: 150px;
      width: 150px;
      top: ${topPos}px;
      left: ${leftPos}px;
      transform: translate(-50%, -50%);
      background-color: #4bad3733;
      animation: .8s ease rippleEffect;
      border-radius:50%;
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
    btnClick(e.key);
  } else if (
    e.key == "/" ||
    e.key == "*" ||
    e.key == "+" ||
    e.key == "-" ||
    e.key == "%"
  ) {
    operatorBtn(e.key);
  } else if (e.key === "Enter") {
    equalToEl.click();
  } else if (e.key == "Backspace") {
    calc.clearLastEntity();
  }
  console.log(e.key);
});

function btnClick(key) {
  numberEls.forEach((number) => {
    let currentNumber = number.dataset.value;
    if (currentNumber === key) {
      number.click();
    }
  });
}

function operatorBtn(key) {
  operatorEls.forEach((operator) => {
    let currentOperator = operator.dataset.value;
    if (currentOperator === key) {
      operator.click();
    }
  });
}
