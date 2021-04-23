const holderRangeEl = document.getElementById("holderRange");
const imageSliderEl = document.getElementById("imageSlider");
const image2ContEl = document.getElementById("image2Cont");
const wrapperEl = document.getElementById("wrapper");
const ctaBtnsEl = document.querySelectorAll(".ctaBtns button");
const imageInputEl = document.getElementById("imageInput");
const image1El = document.getElementById("image1");
const image2El = document.getElementById("image2");

imageSliderEl.addEventListener("input", sliderValue);

ctaBtnsEl.forEach((button) => button.addEventListener("click", loadImage));

window.addEventListener("load", adjustWrapperSize);

function sliderValue() {
  let value = `${this.value}%`;
  holderRangeEl.style.left = value;
  image2ContEl.style.width = value;
}

function loadImage() {
  let btnId = this.id;
  if (btnId === `image1Btn`) {
    imageInputEl.click();
    imageInputEl.onchange = () => getImage(imageInputEl, `image1`);
  } else if (btnId === `image2Btn`) {
    imageInputEl.click();
    imageInputEl.onchange = () => getImage(imageInputEl, `image2`);
  } else return;
}

function getImage(inputEl, currentImg) {
  let file = inputEl.files[0];
  const imageExtensions = ["image/jpeg", "image/png", "image/jpg"];
  if (imageExtensions.includes(file.type)) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      let imageUrl = fileReader.result;
      if (currentImg === `image1`) image2El.src = imageUrl;
      else if (currentImg === `image2`) image1El.src = imageUrl;
      else return;

      adjustWrapperSize();
      imageInputEl.addEventListener("change", adjustWrapperSize);
      window.addEventListener("change", adjustWrapperSize);
    };
  } else alert("Image extension should be png, jpg, or jpeg");
}

async function adjustWrapperSize() {
  let image1Width = await image1El.getBoundingClientRect().width;
  let image2Width = await image2El.getBoundingClientRect().width;

  let wrapperWidth =
    (await image1Width) > image2Width ? image2Width : image1Width;

  wrapperEl.style.width = await `${wrapperWidth}px`;
}

window.addEventListener("resize", adjustWrapperSize);
