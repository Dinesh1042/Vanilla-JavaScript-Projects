class BinaryCalculator {
  constructor(element) {
    this.calculator =
      element instanceof Element ? element : document.querySelector(element);

    //   Elements
    this.historyEl = this.calculator.querySelector(".display .history");
    this.currentEl = this.calculator.querySelector(".display .current");
    this.shortSpan = this.calculator.querySelector(".display .shortSpan");

    //   Defaults
    this.display1 = "";
    this.display2 = "";
    this.temp = "";
    this.operator = "";
    this.isOperatorAdded = false;
    this.isEqualToClicked = false;
  }

  addOperand(val) {
    if (this.isEqualToClicked) {
      this.clear();
      this.isEqualToClicked = false;
    }

    this.display1 += val;
    this.currentEl.innerHTML = this.display1;
    this.isOperatorAdded = false;
  }

  addOperator(val) {
    if (this.display2 && this.isOperatorAdded && !this.display1) {
      this.operator = val;
      this.updateDisplay();
      return;
    }

    this.isEqualToClicked = false;

    if (!this.display1) return;

    if (!this.temp) this.temp = this.display1;

    if (this.temp && this.display1 && this.operator) this.calculate();

    this.operator = val;
    this.updateDisplay();
    this.shortSpan.innerHTML = this.temp;
    this.isOperatorAdded = true;
  }

  updateDisplay() {
    if (!this.isOperatorAdded)
      this.display2 += `${this.display1} ${this.operator} `;
    else this.display2 = `${this.display2.slice(0, -2)} ${this.operator} `;

    this.display1 = "";
    this.currentEl.innerHTML = "";
    this.historyEl.innerHTML = this.display2;
  }

  calculate() {
    const op1 = parseInt(this.temp, 2);
    const op2 = parseInt(this.display1, 2);

    this.temp = eval(`${op1} ${this.operator} ${op2}`).toString(2);
  }

  equal() {
    if (!this.display1) return;

    if (this.display1 && this.operator && this.temp) {
      this.calculate();
      this.display2 = "";
      this.display1 = this.temp;
      this.temp = "";
      this.shortSpan.innerHTML = ``;
      this.historyEl.innerHTML = ``;
      this.currentEl.innerHTML = this.display1;
      this.operator = null;
      this.isEqualToClicked = true;
    }
  }

  clear() {
    this.display1 = "";
    this.display2 = "";
    this.temp = "";
    this.operator = "";
    this.isOperatorAdded = false;
    this.isEqualToClicked = false;
    this.historyEl.innerHTML = ``;
    this.currentEl.innerHTML = 0;
    this.shortSpan.innerHTML = ``;
  }
}

const calculatorEl = document.getElementById("calculator");
const operandEl = document.querySelectorAll(".operand");
const operatorEl = document.querySelectorAll(".operator");
const equalToEl = document.querySelector(".equal");
const clearEl = document.querySelector(".clear");

const binaryCalculator = new BinaryCalculator(calculatorEl);

operandEl.forEach((operand) =>
  operand.addEventListener("click", (e) =>
    binaryCalculator.addOperand(operand.innerHTML)
  )
);

operatorEl.forEach((operator) =>
  operator.addEventListener("click", (e) =>
    binaryCalculator.addOperator(operator.innerHTML)
  )
);

equalToEl.addEventListener("click", (e) => binaryCalculator.equal());

clearEl.addEventListener("click", (e) => binaryCalculator.clear());

window.addEventListener("keyup", (e) => {
  if (e.key === "1" || e.key === "0") binaryCalculator.addOperand(e.key);
  if (e.key === "*" || e.key === "/" || e.key === "-" || e.key === "+")
    binaryCalculator.addOperator(e.key);
  if (e.key === "Enter") binaryCalculator.equal();
  if (e.key === "Escape") binaryCalculator.clear();
});
