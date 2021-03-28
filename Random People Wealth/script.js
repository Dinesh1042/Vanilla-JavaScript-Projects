const addUserEl = document.getElementById("addUser");
const doubleEl = document.getElementById("double");
const showMillionariesEl = document.getElementById("showMillionaries");
const sortEl = document.getElementById("sort");
const calculateEl = document.getElementById("calculate");
const mainEl = document.getElementById("main");
const userEl = document.getElementById("userEl");
const wealthContEl = document.getElementById("wealthCont");

sortEl.addEventListener("click", sortRichest);

addUserEl.addEventListener("click", getRandomUser);

doubleEl.addEventListener("click", doubleMoney);

showMillionariesEl.addEventListener("click", showMillionare);

calculateEl.addEventListener("click", calculateWealth);

for (let i = 0; i <= 4; i++) {
  getRandomUser();
}

let userData = [];

async function getRandomUser() {
  const baseUrl = await fetch("https://randomuser.me/api");
  const res = await baseUrl.json();
  const data = res.results[0];

  const user = {
    name: `${data.name.first} ${data.name.last}`,
    profile: `${data.picture.medium}`,
    money: Math.floor(Math.random() * 10000000),
  };
  addUser(user);
}

function addUser(obj) {
  userData.push(obj);
  updateDOM();
}

function updateDOM() {
  userEl.innerHTML = ``;
  userData.forEach((data) => {
    createUser(data);
  });
  calculateWealth();
}

function createUser(data) {
  const userCont = document.createElement("div");
  userCont.classList.add("UserCont");
  const userLeft = document.createElement("div");
  userLeft.classList.add("userLeft");
  const profile = document.createElement("img");
  profile.src = data.profile;
  userLeft.appendChild(profile);
  const username = document.createElement("p");
  username.textContent = data.name;
  userLeft.appendChild(username);
  const userRight = document.createElement("div");
  const moneyEl = document.createElement("p");
  moneyEl.textContent = formatMoney(data.money);
  userRight.appendChild(moneyEl);

  userCont.appendChild(userLeft);
  userCont.appendChild(userRight);

  userEl.appendChild(userCont);
}

function formatMoney(number) {
  return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function doubleMoney() {
  userData = userData.map((user) => {
    return { ...user, money: user.money * 2 };
  });
  updateDOM();
}

function showMillionare() {
  userData = userData.filter((user) => user.money > 10000000);
  updateDOM();
}

function sortRichest() {
  userData = userData.sort((a, b) => b.money - a.money);
  updateDOM();
}

function calculateWealth() {
  const wealth = userData.reduce((acc, value) => {
    return acc + value.money;
  }, 0);
  createWealth(wealth);
}

function createWealth(wealth) {
  wealthContEl.innerHTML = ``;
  const TotalWealthEl = document.createElement("h2");
  TotalWealthEl.innerHTML = `<strong>Total Wealth</strong> ${formatMoney(
    wealth
  )}`;
  wealthContEl.appendChild(TotalWealthEl);
}
