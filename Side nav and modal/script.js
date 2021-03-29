const hamburgarEl = document.getElementById("hamburgar");
const bodyEl = document.querySelector("body");
const linksEl = document.querySelectorAll("#links li");
const containerEl = document.querySelector(".container");

const ctaModalEl = document.querySelectorAll(".ctaModal");

hamburgarEl.addEventListener("click", (e) => {
  bodyEl.classList.toggle("nav-open");
});

linksEl.forEach((link) => {
  link.addEventListener("click", (e) => {
    linksEl.forEach((item) => {
      item.classList.remove("active");
    });
    link.classList.add("active");
  });
});

// Create Modal

function createModal() {
  const modalCont = document.createElement("div");
  const modalEl = document.createElement("div");
  modalCont.classList.add("modalCont");
  modalEl.classList.add("modal");

  // Modal Top

  const modalTop = document.createElement("div");
  modalTop.classList.add("modalTop");
  modalEl.appendChild(modalTop);
  modalCont.appendChild(modalEl);
  // Modal Title

  const modalTitle = document.createElement("h2");
  modalTitle.innerHTML = `Sign In`;
  modalTop.appendChild(modalTitle);

  // Close Btn
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `<ion-icon name="close"></ion-icon>`;
  modalTop.appendChild(closeBtn);
  const formEl = document.createElement("form");

  // UserName
  const userNameDiv = document.createElement("div");
  const userNameLabel = document.createElement("label");
  userNameLabel.htmlFor = "userName";
  const userNameInput = document.createElement("input");
  userNameInput.id = "userName";
  userNameInput.placeholder = "Username";
  userNameLabel.innerHTML = `User Name`;
  userNameDiv.appendChild(userNameLabel);
  userNameDiv.appendChild(userNameInput);
  formEl.appendChild(userNameDiv);

  // Email

  const userEmailDiv = document.createElement("div");
  const userEmailLabel = document.createElement("label");
  userEmailLabel.htmlFor = "email";
  const userEmailInput = document.createElement("input");
  userEmailInput.id = "email";
  userEmailInput.placeholder = "Email";
  userEmailLabel.innerHTML = `Email`;
  userEmailDiv.appendChild(userEmailLabel);
  userEmailDiv.appendChild(userEmailInput);
  formEl.appendChild(userEmailDiv);

  // PassWord
  const userPasswordDiv = document.createElement("div");
  const userPasswordLabel = document.createElement("label");
  userPasswordLabel.innerHTML = `Password`;
  userPasswordLabel.htmlFor = `password`;
  const userPasswordInput = document.createElement("input");
  userPasswordInput.id = `password`;
  userPasswordInput.placeholder = `Password`;
  userPasswordDiv.appendChild(userPasswordLabel);
  userPasswordDiv.appendChild(userPasswordInput);
  formEl.appendChild(userPasswordDiv);

  // Submit btn
  const ctaBtn = document.createElement("button");
  ctaBtn.type = "submit";
  ctaBtn.innerHTML = `Submit`;
  formEl.appendChild(ctaBtn);

  closeBtn.addEventListener("click", (e) => {
    bodyEl.classList.remove("modal-open");
    modalCont.remove();
  });

  //
  window.addEventListener("click", (e) => {
    if (e.target.classList == "overlay2") {
      bodyEl.classList.remove("modal-open");
      modalCont.remove();
    }
  });

  modalEl.appendChild(formEl);
  containerEl.appendChild(modalCont);
}

ctaModalEl.forEach((button) => {
  button.addEventListener("click", (e) => {
    createModal();
    bodyEl.classList.add("modal-open");
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList == "overlay") bodyEl.classList.remove("nav-open");
});
