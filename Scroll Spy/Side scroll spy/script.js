const navEl = [...document.querySelectorAll(".nav")];
const spyEl = document.querySelector(".spy");
const sectionEl = [...document.querySelectorAll(".section")];

window.addEventListener("scroll", scrollSpy);
window.addEventListener("load", scrollSpy);
window.addEventListener("resize", scrollSpy);

function scrollSpy(e) {
  const scrolled = window.scrollY;
  sectionEl.forEach((section) => {
    const sectionOffset = section.offsetTop;
    if (scrolled >= sectionOffset - 100) {
      const currentSection = section.getAttribute("id");
      navEl.forEach((nav) => {
        const currentNav = nav.dataset.id;
        if (currentNav === currentSection) {
          navEl.forEach((nv) => {
            const navId = nv.dataset.id;
            if (currentNav !== navId) {
              nv.classList.remove("active");
            }
          });

          nav.classList.add("active");

          const parentEl = nav.parentElement.getBoundingClientRect();
          const { height, width, left, top } = nav.getBoundingClientRect();
          spyEl.style.cssText = `
          width : ${width}px;
          height :${height}px;
          top:${top - parentEl.top}px;
          left:${left - parentEl.left}px;
          `;
        }

        nav.addEventListener("mouseenter", () => nav.classList.add("show"));
        nav.addEventListener("mouseleave", () => nav.classList.remove("show"));
      });
    }
  });
}
