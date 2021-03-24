const formEl = document.getElementById("form");
const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const ConfirmpasswordEl = document.getElementById("Confirmpassword");

let isPasswordEntered = false;

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  let formArr = [usernameEl, emailEl, passwordEl, ConfirmpasswordEl];
  checkValidation(formArr);

  passwordEl.addEventListener("input", (e) => {
    isPasswordEntered = true;
  });
});

ConfirmpasswordEl.addEventListener("input", (e) => {
  if (isPasswordEntered) {
    if (passwordEl.value !== ConfirmpasswordEl.value) {
      showError(ConfirmpasswordEl, "Password Does n't match");
    } else if (passwordEl.value === ConfirmpasswordEl.value)
      showSuccess(ConfirmpasswordEl);
  }
});

function checkValidation(formArr) {
  formArr.forEach((input) => {
    const inputId = input.id;
    if (inputId === "username") checkUserName(input);
    if (inputId === "email") checkEmailValidation(input);
    if (inputId === "password") checkPasswordValidation(input);
    if (inputId === "Confirmpassword") checkPasswordValidation(input);
  });
}

function checkUserName(input) {
  if (!input.value) return showError(input, "Username is required");
  checkLengthValidation(input, false);
}

function showError(input, message) {
  let formControl = input.parentElement;
  let smallEl = formControl.querySelector("small");
  smallEl.innerText = message;
  formControl.classList.add("error");
  formControl.classList.remove("success");
}

function checkLengthValidation(input, isPassword) {
  let inputId = input.id.charAt(0).toUpperCase() + input.id.slice(1);

  let minLength = isPassword ? 6 : 3;
  let maxLength = isPassword ? 12 : 15;

  if (input.value.length < minLength)
    return showError(
      input,
      `${inputId} character should be greater than ${minLength}`
    );

  if (input.value.length > maxLength)
    return showError(input, `${inputId}  character should be less than 15`);

  showSuccess(input);
}

function showSuccess(input) {
  let formControl = input.parentElement;
  formControl.classList.add("success");
  formControl.classList.remove("error");
}

function checkEmailValidation(email) {
  if (!email.value) return showError(email, "Email is required");
  if (email.value) {
    console.log(email.value, "121212");
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(email.value), "www");
    if (re.test(email.value) === false) showError(email, "Invalid Email");

    if (re.test(email.value)) return showSuccess(email);
  }
}

function checkPasswordValidation(input) {
  if (!input.value) return showError(input, "Password is required");
  checkLengthValidation(input, true);
}
