const captchaTextEl = document.getElementById("captchaText");
const captchaInputEl = document.getElementById("captchaInput");
const captchaBtnEl = document.getElementById("captchaBtn");

const captchaValue = getCaptcha();

(function () {
  captchaTextEl.textContent = captchaValue;
})();

captchaInputEl.addEventListener("input", verifyCaptcha);

function verifyCaptcha() {
  const inputValue = captchaInputEl.value;

  captchaInputEl.classList.remove("success");
  captchaInputEl.classList.remove("danger");
  captchaBtnEl.disabled = true;

  if (inputValue === captchaValue) {
    captchaInputEl.classList.add("success");
    captchaBtnEl.disabled = false;
  }

  if (inputValue.length === 6 && inputValue !== captchaValue)
    captchaInputEl.classList.add("danger");
}

function getCaptcha() {
  return Array.from({ length: 6 }, () =>
    [getRandomNumber, getRandomUpperCaseCharacter, getRandomLowerCaseCharacter][
      getSomeRandomNumber(3)
    ]()
  ).join("");
}

// Helper Functions

function getRandomNumber() {
  return Array.from({ length: 10 }, (_, i) => String.fromCharCode(i + 48))[
    getSomeRandomNumber(10)
  ];
}

function getRandomUpperCaseCharacter() {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65))[
    getSomeRandomNumber(26)
  ];
}

function getRandomLowerCaseCharacter() {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97))[
    getSomeRandomNumber(26)
  ];
}

function getSomeRandomNumber(limit) {
  return Math.floor(Math.random() * limit);
}
