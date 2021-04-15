const curouselContEl = document.getElementById("curouselCont");

// Curousel

class Curousel {
  constructor(element, action) {
   this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.index = 0;
    this.isSliding = false;
    this.slideInterval = null;
    Object.assign(this.action, action);
    this.interval = this.action.interval;
    this.slides = [...this.element.querySelectorAll(".slide")];
    if (this.action.indicator) {
      this.indicators = [...this.setIndicator().querySelectorAll(".dot")];
    }
    this.setNavigation();
    this.showSlide();
    this.autoplaySlide();
    this.slidePause();
  }
  action = {
    navigation: true,
    interval: 2000,
    indicator: true,
    autoplay: false,
  };

  showSlide() {
    let [currentSlide, previousSlide, nextSlide] = this.getSlidePosition();

    this.slides.forEach((slide) => {
      slide.classList.remove("active");
      slide.classList.remove("prev-slide");
      slide.classList.remove("next-slide");
    });

    if (this.action.indicator) {
      this.indicators.forEach((dot) => {
        dot.classList.remove("active");
      });
    }

    this.slides.forEach((slide, index) => {
      if (currentSlide === slide) {
        slide.classList.add("active");
        if (this.action.indicator)
          this.indicators[index].classList.add("active");
      }
    });
    this.moveSlideAnimation();
  }

  moveSlideAnimation() {
    let [currentSlide, previousSlide, nextSlide] = this.getSlidePosition();

    this.slides.forEach((slide) => {
      if (slide === previousSlide) slide.classList.add("prev-slide");
      if (slide === nextSlide) slide.classList.add("next-slide");
    });

    const sliderCont = this.element.querySelector(".slider");
    sliderCont.addEventListener("transitionend", (e) => {
      this.isSliding = false;
    });
  }

  moveSlide(moveValue) {
    if (moveValue === "left") {
      this.index = this.index <= 0 ? this.slides.length - 1 : --this.index;
    }
    if (moveValue === "right") {
      this.index = this.index >= this.slides.length - 1 ? 0 : ++this.index;
    }
    this.moveSlideAnimation();
    this.isSliding = false;
    return this.showSlide();
  }

  getSlidePosition() {
    let currentSlide = this.slides[this.index];
    let previousSlide = this.slides[
      this.index <= 0 ? this.slides.length - 1 : this.index - 1
    ];
    let nextSlide = this.slides[
      this.index >= this.slides.length - 1 ? 0 : this.index + 1
    ];
    return [currentSlide, previousSlide, nextSlide];
  }

  setNavigation() {
    if (this.action.navigation) {
      const navigationCont = document.createElement("div");
      navigationCont.classList.add("navigation");
      // Left Btn

      const leftBtn = document.createElement("button");
      leftBtn.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
      navigationCont.appendChild(leftBtn);

      // Event listener

      leftBtn.addEventListener("click", (e) => {
        if (!this.isSliding) {
          this.moveSlide("left");
          this.isSliding = true;
        }
      });

      // Right Btn
      const rightBtn = document.createElement("button");
      rightBtn.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
      navigationCont.appendChild(rightBtn);

      rightBtn.addEventListener("click", (e) => {
        if (!this.isSliding) {
          this.moveSlide("right");
          this.isSliding = true;
        }
      });

      return this.element.appendChild(navigationCont);
    }
    return;
  }

  setIndicator() {
    if (this.action.indicator) {
      const indicatorCont = document.createElement("div");
      indicatorCont.classList.add("indicators");
      let initialSlideId = 0;
      this.slides.forEach((slide) => {
        const dotEl = document.createElement("div");
        const attr = document.createAttribute("data-slideId");
        attr.value = initialSlideId++;
        dotEl.setAttributeNode(attr);
        dotEl.classList.add("dot");
        indicatorCont.appendChild(dotEl);
      });

      const dotsEl = [...indicatorCont.querySelectorAll(".dot")];

      let isSlideInterval = false;

      const sliderCont = this.element.querySelector(".slider");

      dotsEl.forEach((dot) => {
        dot.addEventListener("click", (e) => {
          let slideId = JSON.parse(e.target.dataset.slideid);
          if (!isSlideInterval) {
            isSlideInterval = true;
            sliderCont.style.transition = `0.5s ease transform`;
            let slideInterval = setInterval(() => {
              if (this.index === slideId) {
                sliderCont.style.transition = `1s ease transform`;
                return clearSlideInterval();
              }

              if (slideId < this.index) this.index--;
              if (slideId > this.index) this.index++;
              this.showSlide();
            }, 500);
            function clearSlideInterval() {
              clearInterval(slideInterval);
              slideInterval = null;
              isSlideInterval = false;
            }
          }
        });
      });

      this.element.appendChild(indicatorCont);
      return indicatorCont;
    }
  }

  autoplaySlide() {
    if (this.action.autoplay) {
      this.slideInterval = this.getInterval();
    }
  }
  slidePause() {
    this.element.addEventListener("mouseover", (e) => {
      clearInterval(this.slideInterval);
    });
    this.element.addEventListener("mouseout", (e) => {
      if (this.action.autoplay) {
        this.slideInterval = this.getInterval();
      }
    });
  }

  getInterval() {
    return setInterval(() => {
      this.index++;

      if (this.index > this.slides.length - 1) this.index = 0;

      this.showSlide();
    }, this.interval);
  }
}

new Curousel(curouselContEl, {
  indicator: true,
  navigation: true,
  autoplay: true,
  interval: 5000,
});
