const mealContEl = document.getElementById("mealCont");
const searchNameEl = document.getElementById("searchName");
const formEl = document.getElementById("form");
const userInputEl = document.getElementById("userInput");
const bodyEl = document.querySelector("body");

let modalCreate = false;

const baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const currentMealBaseUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`;

function getRecipe(searchText) {
  return fetch(baseUrl + searchText)
    .then((res) => res.json())
    .then((data) => {
      let mealArray = data.meals;
      mealContEl.innerHTML = ``;
      if (mealArray !== null) {
        searchNameEl.innerHTML = `Your Search result '${searchText}':`;
        mealArray.forEach((meal) => {
          let mealName = meal.strMeal;
          let mealImg = meal.strMealThumb;
          let mealIns = meal.strInstructions;
          let mealID = meal.idMeal;
          createMealElement(mealName, mealImg, mealIns, mealID);
        });
      } else {
        searchNameEl.innerHTML = `No Search found for ' ${searchText}' try again`;
      }
    });
}

function createMealElement(mealName, mealImg, mealPara, mealID) {
  const mealEl = document.createElement("div");
  const attr = document.createAttribute("data-mealID");
  attr.value = mealID;
  mealEl.setAttributeNode(attr);
  mealEl.classList.add("meal");
  const imgCont = document.createElement("div");
  imgCont.classList.add("imgCont");
  const mealImgEl = document.createElement("img");
  mealImgEl.src = mealImg;
  imgCont.appendChild(mealImgEl);
  mealEl.appendChild(imgCont);
  //
  const mealBody = document.createElement("div");
  mealBody.classList.add("mealBody");
  const mealNameEl = document.createElement("h5");
  mealNameEl.innerHTML = mealName;
  mealBody.appendChild(mealNameEl);
  const mealParaEl = document.createElement("p");
  mealParaEl.innerHTML = mealPara;
  mealBody.appendChild(mealParaEl);
  const ctaBtn = document.createElement("button");
  ctaBtn.innerHTML = `Get Recipe`;
  mealBody.appendChild(ctaBtn);
  mealEl.appendChild(mealBody);
  mealContEl.appendChild(mealEl);

  // Event listener

  ctaBtn.addEventListener("click", (e) => {
    if (!modalCreate) {
      getCurrentRecepie(attr.value);
      modalCreate = true;
    }
  });
}

const mealIngredient = [];

async function getCurrentRecepie(recipeId) {
  const mealApi = await fetch(currentMealBaseUrl + recipeId);
  const res = await mealApi.json();
  const data = await res.meals[0];
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      let ingredient = data[`strIngredient${i}`];
      let measure = data[`strMeasure${i}`].trim();
      mealIngredient.push(`${ingredient} - ${measure}`);
    }
  }
  createCurrentRecipeEl(data);
}

function createCurrentRecipeEl(data) {
  bodyEl.classList.add("modal-open");

  const currentMealCont = document.createElement("div");
  currentMealCont.classList.add("currentMealCont");
  // Current Meal
  const currentMeal = document.createElement("div");
  currentMeal.classList.add("currentMeal");
  currentMealCont.appendChild(currentMeal);
  // Img Cont
  const imgCont = document.createElement("div");
  imgCont.classList.add("imgCont");

  const imgEl = document.createElement("img");
  imgCont.appendChild(imgEl);

  imgEl.src = data.strMealThumb;

  currentMeal.appendChild(imgCont);

  // Meal body

  const mealBody = document.createElement("div");
  mealBody.classList.add("mealBody");

  currentMeal.appendChild(mealBody);

  const mealName = document.createElement("h1");
  mealName.innerHTML = data.strMeal;

  mealBody.appendChild(mealName);

  const ingredients = document.createElement("div");
  ingredients.classList.add("ingridents");
  const ingTitle = document.createElement("p");
  mealBody.appendChild(ingredients);

  ingTitle.innerHTML = "Ingredients";

  ingTitle.classList.add("title");

  ingredients.appendChild(ingTitle);

  const ulEl = document.createElement("ul");

  ingredients.appendChild(ulEl);

  mealIngredient.forEach((item) => {
    const liEl = document.createElement("li");
    liEl.innerHTML = item;
    ulEl.appendChild(liEl);
  });

  // instruction

  const instructionEl = document.createElement("div");

  instructionEl.classList.add("instruction");

  const insTitle = document.createElement("p");
  insTitle.classList.add("title");
  mealBody.appendChild(instructionEl);

  insTitle.innerHTML = `Instruction`;

  instructionEl.appendChild(insTitle);

  const insPara = document.createElement("p");
  insPara.innerHTML = data.strInstructions;

  instructionEl.appendChild(insPara);

  const youtubeEl = document.createElement("div");
  youtubeEl.classList.add("youtube");

  const youtubePara = document.createElement("p");
  youtubePara.innerHTML = `Click below to watch how to cook ${data.strMeal} on youtube`;
  youtubeEl.appendChild(youtubePara);

  const watchLink = document.createElement("a");
  watchLink.innerHTML = "Watch";
  youtubeEl.appendChild(watchLink);

  watchLink.href = data.strYoutube;
  watchLink.target = "_blank";

  mealBody.appendChild(youtubeEl);

  bodyEl.appendChild(currentMealCont);

  window.addEventListener("click", (e) => {
    if (e.target === currentMealCont) {
      currentMealCont.remove();
      bodyEl.classList.remove("modal-open");
      modalCreate = false;
    }
  });

  // Close Btn

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `<ion-icon name="close"></ion-icon>`;
  currentMeal.appendChild(closeBtn);
  closeBtn.classList.add("close-btn");

  closeBtn.addEventListener("click", (e) => {
    currentMealCont.remove();
    modalCreate = false;
    bodyEl.classList.remove("modal-open");
  });
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  let mealName = userInputEl.value;
  getRecipe(mealName);
});