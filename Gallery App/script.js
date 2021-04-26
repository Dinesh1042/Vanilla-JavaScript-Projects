const GalleryAppSection = document.getElementById("GalleryAppSection");
const pexelsApi = null;
const fakeData = "./data/data.json";
const _pexelApi = new WeakMap();

class GalleryApp {
  constructor(element) {
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.curatedIndex = 1;
    this.searchIndex = 1;
    this.userSearchValue = null;
    this.selectedImageEl = null;
    this.isSearched = false;

    if (this.element) this.initializeDOM();
    else throw new Error("Element is not valid");
  }

  async initializeDOM() {
    this.form = this.element.querySelector("#form");
    this.imageContainer = this.element.querySelector("#imageContainer");
    this.loadMoreBtn = this.element.querySelector("#loadMore");
    this.bodyEl = document.querySelector("body");

    this.imageContainer.innerHTML = null;
    if (pexelsApi) {
      _pexelApi.set(this, pexelsApi);
      const pexelsCuratedApi = this.getCuratedUrl(this.curatedIndex);
      let fetchData = await this.fetchImages(pexelsCuratedApi);
      this.createImageEl(fetchData);
    } else {
      let fakeFetchData = await fetch(fakeData).then((res) => res.json());
      alert(
        `You Cannot use this app unless you set your api key in your 'pexelsApi' variable`
      );
      this.createImageEl(fakeFetchData);
    }

    this.form.addEventListener("submit", this.searchImage.bind(this));
    this.loadMoreBtn.addEventListener("click", this.loadMoreImages.bind(this));

    window.addEventListener(
      "scroll",
      (e) => (this.element.className = window.scrollY > 200 ? `navActive` : ``)
    );
  }

  async searchImage(e) {
    e.preventDefault();
    const inputEl = this.form.querySelector("input");
    const searchValue = inputEl.value.trim();
    this.searchIndex = 1;
    this.pexelsSearchUrl = this.getPexelsSearchUrl(
      searchValue,
      this.searchIndex
    );
    if (searchValue && pexelsApi) {
      this.isSearched = true;
      this.userSearchValue = searchValue;
      let searchFetchData = await this.fetchImages(this.pexelsSearchUrl);
      this.imageContainer.innerHTML = null;
      this.createImageEl(searchFetchData);
    } else
      alert(
        `You Cannot use search option unless you set your api key in your 'pexelsApi' variable`
      );
    inputEl.addEventListener("click", () => inputEl.select());
  }

  async loadMoreImages() {
    let fetchData = null;
    if (!this.isSearched && pexelsApi) {
      ++this.curatedIndex;
      const pexelsCuratedApi = this.getCuratedUrl(this.curatedIndex);
      fetchData = await this.fetchImages(pexelsCuratedApi);
    } else if (this.isSearched && pexelsApi) {
      ++this.searchIndex;
      const pexelsSearchUrl = this.getPexelsSearchUrl(
        this.userSearchValue,
        this.searchIndex
      );
      fetchData = await this.fetchImages(pexelsSearchUrl);
    } else return;
    if (fetchData) this.createImageEl(fetchData);
    else return;
  }

  createImageEl(fetchdata) {
    let imagesData = fetchdata.photos;
    imagesData.forEach((image) => this.generateHTML(image));
  }

  generateHTML(image) {
    const { photographer, src, id } = image;
    const imageCont = document.createElement("div");
    imageCont.setAttribute("data-imageid", id);
    imageCont.classList.add("image");
    const imageEl = document.createElement("img");
    imageEl.src = src.large;
    imageCont.appendChild(imageEl);
    const authorEl = document.createElement("div");
    authorEl.classList.add("author");
    const authorName = document.createElement("p");
    authorName.innerHTML = photographer;
    const likeEl = document.createElement("span");
    likeEl.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`;
    authorEl.appendChild(authorName);
    authorEl.appendChild(likeEl);
    imageCont.appendChild(authorEl);
    this.imageContainer.appendChild(imageCont);

    likeEl.addEventListener("click", (e) => {
      let isCurrentImgLiked = imageCont.dataset.isliked
        ? JSON.parse(imageCont.dataset.isliked)
        : false;
      if (!isCurrentImgLiked) {
        imageCont.setAttribute("data-isliked", true);
        likeEl.innerHTML = `<ion-icon name="heart" ></ion-icon>`;
      } else {
        imageCont.setAttribute("data-isliked", false);
        likeEl.innerHTML = `<ion-icon name="heart-outline" ></ion-icon>`;
      }
    });

    imageCont.addEventListener("click", (e) => {
      if (!e.target.closest(".author")) {
        this.selectedImageEl = imageCont;
        this.createLargeView(src.large);
      }
    });
  }

  createLargeView(src) {
    const imgViewContEl = document.createElement("div");
    imgViewContEl.classList.add(`imgViewCont`);
    // Close Btn
    const closeBtnCont = document.createElement("div");
    closeBtnCont.classList.add(`closeBtn`);
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<ion-icon name="close"></ion-icon>`;
    closeBtnCont.appendChild(closeBtn);
    imgViewContEl.appendChild(closeBtnCont);
    // Img Cont
    const imgContEl = document.createElement("div");
    imgContEl.classList.add("imgCont");
    const imgEl = document.createElement("img");
    imgEl.src = src;
    imgContEl.appendChild(imgEl);
    imgViewContEl.appendChild(imgContEl);
    // Cta buttons
    const ctaButtonEl = document.createElement("div");
    ctaButtonEl.classList.add("ctaButtons");
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `<ion-icon name="chevron-back"></ion-icon>`;
    ctaButtonEl.appendChild(prevBtn);
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `<ion-icon name="chevron-forward"></ion-icon>`;
    ctaButtonEl.appendChild(nextBtn);
    imgViewContEl.appendChild(ctaButtonEl);
    this.bodyEl.appendChild(imgViewContEl);
    this.bodyEl.classList.add("imageOverview");

    closeBtnCont.addEventListener("click", resetElement.bind(this));

    window.addEventListener("click", (e) =>
      e.target.classList.contains("overlay") ? resetElement.call(this) : false
    );

    function resetElement() {
      imgViewContEl.remove();
      this.bodyEl.classList.remove("imageOverview");
    }

    const images = [...this.imageContainer.querySelectorAll(".image")];
    let imageIndex = images.indexOf(this.selectedImageEl);

    prevBtn.addEventListener("click", (e) => {
      imageIndex = imageIndex <= 0 ? images.length - 1 : --imageIndex;
      let prevImg = images[imageIndex].querySelector("img").src;
      imgEl.src = prevImg;
    });

    nextBtn.addEventListener("click", (e) => {
      imageIndex = imageIndex >= images.length - 1 ? 0 : ++imageIndex;
      let nextImg = images[imageIndex].querySelector("img").src;
      imgEl.src = nextImg;
    });
  }

  async fetchImages(pexelsUrl) {
    const pexelsFetch = await fetch(pexelsUrl, {
      headers: {
        Authorization: _pexelApi.get(this),
      },
    });
    const response = await pexelsFetch.json();
    return response;
  }

  getPexelsSearchUrl(userSearch, index) {
    return `https://api.pexels.com/v1/search?query=${userSearch}&page=${index}&per_page=20`;
  }
  getCuratedUrl(index) {
    return `https://api.pexels.com/v1/curated?page=${index}&per_page=20`;
  }
}

const galleryApp = new GalleryApp(GalleryAppSection);
