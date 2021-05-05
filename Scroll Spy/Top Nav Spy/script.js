const navEl = document.querySelectorAll("#nav a");
const spyEl = document.querySelector(".spy");
const sectionEl = document.querySelectorAll(".section");
const logoEl = document.getElementById("logo");

window.addEventListener("scroll", scrollSpy);
window.addEventListener("load", scrollSpy);
window.addEventListener("resize", scrollSpy);

function scrollSpy(e) {
  const scrolled = window.scrollY;
  sectionEl.forEach((section) => {
    const currentSection = section.getAttribute("id");
    const sectionOffset = section.offsetTop;
    if (scrolled > sectionOffset - 100) {
      navEl.forEach((nav) => {
        const currentNav = nav.dataset.id;
        if (currentNav === currentSection) {
          navEl.forEach((nv) => nv.classList.remove("active"));
          nav.classList.add("active");
          const navChords = nav.getBoundingClientRect();
          const parentChords = nav.parentElement.getBoundingClientRect();
          const chords = {
            top: navChords.top - parentChords.top,
            left: navChords.left - parentChords.left,
            width: navChords.width,
            background: window.getComputedStyle(section, null).backgroundColor,
          };

          const { top, width, left, background } = chords;

          spyEl.style.cssText = `
            left:${left}px;
            top:${top}px;
            width:${width}px;
            background-color:${background};
            `;
          logoEl.style.color = background;
        }
      });
    }
  });
}
