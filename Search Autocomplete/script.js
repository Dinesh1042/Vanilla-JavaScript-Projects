let suggestionWords = [
  "html",
  "css",
  "javascript",
  "jquery",
  "ajax",
  "react",
  "angular",
  "node js",
  "express js",
  "redux",
  "chart js",
  "bootstrap",
  "php",
  "yii",
  "laravel",
  "codigniter",
  "mysql",
  "mongo db",
  "asp .net",
  "java",
  "python",
  "django",
  "ruby",
  "c++",
  "webpack",
  "hammer js",
  "http",
  "server",
  "programming",
  "artificial inteligence",
  "development",
  "website",
  "app",
  "frontend",
  "backend",
  "cross platform",
  "xml",
  "api",
  "algorithm",
  "ssl",
  "enrypt",
  "decrypt",
  "code",
];

const suggestionListEl = document.getElementById("suggestionList");
const inputTextEl = document.getElementById("inputText");
const formEl = document.getElementById("form");
const sectionEl = document.getElementById("section");

let currentPosition = -1;

inputTextEl.addEventListener("input", searchSuggestions);

inputTextEl.addEventListener("click", createRecentSearchSuggestion);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputTextEl.value.trim()) searchGoogle(inputTextEl.value);
});

// Suggestions are stored in localStorage for better Experience for user

class LocalStorage {
  constructor(LOCALSTORAGE_KEY) {
    this.local = localStorage.getItem(LOCALSTORAGE_KEY)
      ? JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
      : [];
    this.localKey = LOCALSTORAGE_KEY;
  }
  saveLocal(userSuggest) {
    if (!suggestionWords.includes(userSuggest)) {
      this.local.push(userSuggest);
      this.local = [...new Set(this.local)];
      this.stringfyLocal();
    }
  }
  deleteLocal(value) {
    this.local = this.local.filter((item) => item !== value);
    suggestionWords = suggestionWords.filter((item) => item !== value);
    this.stringfyLocal();
  }
  stringfyLocal() {
    localStorage.setItem(this.localKey, JSON.stringify(this.local));
  }
}

const localstorage = new LocalStorage("AutoCompleteSuggestions");

if (localstorage.local.length)
  suggestionWords = [...suggestionWords, ...localstorage.local];

function createSuggestionList(list, matchValue) {
  const liEl = document.createElement("li");
  const liLeft = document.createElement("div");
  liLeft.classList.add("liLeft");

  const launchIcon = document.createElement("span");
  launchIcon.classList.add("material-icons");
  launchIcon.innerHTML = `launch`;
  liLeft.appendChild(launchIcon);

  const para = document.createElement("p");
  para.innerHTML = list.replace(matchValue, `<span>${matchValue}</span>`);
  liLeft.appendChild(para);

  liEl.appendChild(liLeft);

  const removeBtn = document.createElement("div");
  removeBtn.classList.add("removeBtn");
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("material-icons");
  closeBtn.innerHTML = `close`;
  removeBtn.appendChild(closeBtn);

  liEl.appendChild(removeBtn);
  suggestionListEl.appendChild(liEl);

  // EventListener

  launchIcon.addEventListener("click", (e) => {
    inputTextEl.value = list;
    searchSuggestions();
    inputTextEl.focus();
  });
  liEl.addEventListener("click", (e) => {
    if (e.target !== launchIcon && e.target !== closeBtn) {
      inputTextEl.value = list;
      searchSuggestions();
      searchGoogle(list);
    }
  });
  removeBtn.addEventListener("click", (E) => {
    localstorage.deleteLocal(list);
    liEl.remove();
  });
}

function searchSuggestions() {
  currentPosition = -1;
  let value = inputTextEl.value.toLowerCase().trim();
  let lists = [...suggestionWords].filter((word) => word.includes(value));

  lists = lists.length > 7 ? lists.slice(0, 7) : lists;

  suggestionListEl.innerHTML = null;
  lists.forEach((list) => createSuggestionList(list, value));
  if (!value) createRecentSearchSuggestion();
  if (!lists.length) createSuggestionList(value);
}

function searchGoogle(value) {
  if (value) {
    localstorage.saveLocal(inputTextEl.value);
    let NavTag = document.createElement("a");
    NavTag.href = `https://www.google.com/search?q=${value}`;
    NavTag.click();
  }
}

window.addEventListener("keydown", (e) => {
  if (suggestionListEl.childElementCount)
    if (e.key === `ArrowDown`) {
      ++currentPosition;
      keySelectionArrow(currentPosition);
    } else if (e.key === `ArrowUp`) {
      --currentPosition;
      keySelectionArrow(currentPosition);
    }

  if (e.key === `Escape`) {
    inputTextEl.value = null;
    searchSuggestions();
    currentPosition = 0;
    suggestionListEl.innerHTML = null;
  }
});

function keySelectionArrow() {
  let lists = document.querySelectorAll("#suggestionList li");
  lists.forEach((list) => list.classList.remove("active"));
  currentPosition = currentPosition >= lists.length ? 0 : currentPosition;

  currentPosition = currentPosition < 0 ? lists.length - 1 : currentPosition;

  lists[currentPosition].classList.add("active");
  let listValue = lists[currentPosition].querySelector(".liLeft p").textContent;

  inputTextEl.value = listValue;
}

function createRecentSearchSuggestion() {
  let lists = localstorage.local;
  if (lists.length && !inputTextEl.value.trim()) {
    suggestionListEl.innerHTML = null;
    lists.forEach((list) => createSuggestionList(list));
  } else if (!lists.length && !inputTextEl.value.trim()) {
    suggestionListEl.innerHTML = null;
    let newSuggestionList = suggestionWords.slice(0, 7);
    newSuggestionList.forEach((list) => createSuggestionList(list));
  }
}

window.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("section") ||
    e.target.classList.contains("suggestionCont") ||
    e.target.closest(".header")
  )
    suggestionListEl.innerHTML = null;
});
