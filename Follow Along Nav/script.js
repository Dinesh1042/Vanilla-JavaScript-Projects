const listEl = document.querySelectorAll("#headerwrapper nav li");
const followAlongEl = document.getElementById("followAlong");
const headerEl = document.querySelector("header");

listEl.forEach((link) => {
  link.addEventListener("mouseenter", showNav);
  link.addEventListener("mouseleave", removeNav);
});

function showNav() {
  this.classList.add("active");
  setTimeout(() => {
    this.classList.add("show");
  }, 150);

  const dropDownChord = this.querySelector(
    ".drop_down"
  ).getBoundingClientRect();

  const parentElChords = headerEl.getBoundingClientRect();

  console.log(parentElChords, "pare");
  console.log(dropDownChord);

  const finalChords = {
    height: dropDownChord.height - 10,
    width: dropDownChord.width,
    left: dropDownChord.left - parentElChords.left,
    top: dropDownChord.top - parentElChords.top,
  };
  followAlongEl.classList.add("active");
  followAlongEl.style.width = `${finalChords.width}px`;
  followAlongEl.style.height = `${finalChords.height}px`;
  followAlongEl.style.transform = `translate(${finalChords.left}px,${finalChords.top}px)`;
}

function removeNav() {
  this.classList.remove("active", "show");
  followAlongEl.classList.remove("active");
}
