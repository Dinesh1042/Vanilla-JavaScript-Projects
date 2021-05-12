const passwordLengthEl = document.getElementById("passwordLength");
const sliderEl = document.getElementById("slider");
const upperEl = document.getElementById("upper");
const lowerEl = document.getElementById("lower");
const symbolEl = document.getElementById("symbol");
const generatePasswordBtn = document.getElementById("generatePassword");
const copyBtn = document.getElementById("copybtn");
const passwordViewEl = document.getElementById("passwordView");

sliderEl.addEventListener("input", changeLength);
generatePasswordBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

let passwordLength = null;

function changeLength() {
  const value = +sliderEl.value;
  passwordLength = value;
  passwordLengthEl.innerHTML = value;
}
changeLength();

function generatePassword() {
  const requiredField = [];
  const isUpperCaseChecked = upperEl.checked;
  const isLowerCaseChecked = lowerEl.checked;
  const isSymbolChecked = symbolEl.checked;

  if (isUpperCaseChecked) requiredField.push(generateRandomUpperCase);
  if (isLowerCaseChecked) requiredField.push(generateRandomLowerCase);
  if (isSymbolChecked) requiredField.push(generateRandomSymbol);

  passwordViewEl.innerHTML = getPassword(requiredField);
}

function getPassword(arr) {
  let password = "";
  console.log(arr);
  for (let i = 0; i < passwordLength; i++) {
    password += arr[Math.floor(Math.random() * arr.length)]();
  }
  return password;
}

function copyPassword() {
  this.dataset.tooltip = `Copied`;
  this.addEventListener("mouseleave", () => (this.dataset.tooltip = `Copy`));

  window.navigator.clipboard.writeText(passwordViewEl.textContent);
}

function generateRandomLowerCase() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function generateRandomUpperCase() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function generateRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function generateRandomSymbol() {
  let symbols = "!@#$%^&*()_+/*-~";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

// If user unchecks all the checkboxes checksomething function randomly checks the checkboxes

const allCheckBox = [upperEl, lowerEl, symbolEl];

allCheckBox.forEach(function (checkbox) {
  checkbox.addEventListener("click", function (e) {
    const isAllUnchecked = allCheckBox.every((chkbox) => !chkbox.checked);
    const lastChecked = this;
    if (isAllUnchecked) checkSomething(lastChecked);
  });
});

function checkSomething(lastChecked) {
  const randomCheck =
    allCheckBox[Math.floor(Math.random() * allCheckBox.length)];

  if (lastChecked === randomCheck) {
    return checkSomething(lastChecked);
  } else randomCheck.checked = true;
}
