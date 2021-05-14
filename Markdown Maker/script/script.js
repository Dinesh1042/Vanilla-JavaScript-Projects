const formEl = document.getElementById("form");
const listsEl = document.getElementById("lists");
const textAreaEl = formEl.querySelector(".userFeedback");

let isEditMode = false;
let editElement = null;

formEl.addEventListener("submit", createMarkDown);

function createMarkDown(e) {
  e.preventDefault();

  const userFeedbackEl = this.querySelector(".userFeedback");
  const userFeedbackValue = userFeedbackEl.value.trim();

  if (userFeedbackValue && !isEditMode) {
    const List = textToHTMLConvertor(userFeedbackValue);
    createUserFeebackList(List, userFeedbackValue);
    userFeedbackEl.value = null;
  } else if (userFeedbackValue && isEditMode) {
    editElement.innerHTML = textToHTMLConvertor(userFeedbackValue);

    isEditMode = false;
    userFeedbackEl.value = null;
    editElement.closest(".list").classList.remove("editing");
    editElement = null;
  } else return;
}

function textToHTMLConvertor(str) {
  let finalWord = null;

  const { code, link, img, para, bold } = {
    code: /```\s*([^]+?.*?[^]+?[^]+?)```/gm,
    link: /\[(.*?)\]\((.*?)\)/g,
    img: /!\[(.*?)\]\((.*?)\)/gim,
    para: /(.+((\r?\n.+)*))/g,
    bold: /\*\*\*([\s\S]*)\*\*\*/gim,
  };

  finalWord = str
    .replace(code, `<code>$1</code>`)
    .replace(img, `<img src="$2" alt="$1">`)
    .replace(link, `<a href="$2">$1</a>`)
    .replace(para, `<p>$1</p>`)
    .replace(bold, `<b>$1</b>`);

  return finalWord;
}

function createUserFeebackList(text) {
  const liEl = document.createElement("li");
  liEl.className = `list`;

  const contentEl = document.createElement("div");
  contentEl.className = `content`;

  contentEl.innerHTML = text;
  liEl.appendChild(contentEl);

  const editWrapper = document.createElement("div");
  editWrapper.classList.add("editWrapper");

  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<img src="./asset/edit.svg" alt="edit-icon">`;
  editWrapper.appendChild(editBtn);
  liEl.appendChild(editWrapper);

  listsEl.appendChild(liEl);

  editBtn.addEventListener("click", (e) => {
    isEditMode = true;
    editElement = contentEl;
    textAreaEl.value = HTMLToMdConvertor(contentEl.innerHTML);
    textAreaEl.focus();

    const AllListItem = listsEl.querySelectorAll("li");
    AllListItem.forEach((lt) => lt.classList.remove("editing"));

    liEl.classList.add("editing");
  });
}

function HTMLToMdConvertor(str) {
  let finalCode = null;
  const { Startcode, Endcode, link, img, para, Startbold, Endbold } = {
    Startcode: /<code>/gim,
    Endcode: /<\/code>/gim,
    link: /<a href=\"([^\"]*)\"[^>]*>([\s\S]*)<\/a>/gi,
    img: /<img[^>]* src=\"([^\"]*)\"[^>]* alt=\"([^\"]*)\"[^>]*>/gi,
    Startbold: /<b>/gi,
    Endbold: /<\/b>/gi,
  };

  finalCode = str
    .replace(Startcode, "```")
    .replace(Endcode, "```")
    .replace(Startbold, "***")
    .replace(Endbold, "***")
    .replace(img, `![$2]($1)`)
    .replace(link, `[$2]($1)`)
    .replace("<p>", "")
    .replace("</p>", "");

  return finalCode;
}
