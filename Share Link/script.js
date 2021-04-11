const shareBtnEl = document.getElementById("share");
const bodyEl = document.querySelector("body");
const closeBtnEl = document.getElementById("closeBtn");
const copyEl = document.getElementById("copyIcon");

shareBtnEl.addEventListener("click", (e) => {
  let leftPos = e.clientX - shareBtnEl.getBoundingClientRect().left;
  let topPos = e.clientY - shareBtnEl.getBoundingClientRect().top;
  const spanEl = document.createElement("span");
  spanEl.className = `ripple`;
  spanEl.style.cssText = `
      height:100px;
      width:100px;
      background:#61428f;
      position:absolute;
      top:${topPos}px;
      left:${leftPos}px;
      animation : rippleEffect 1s ease;
      border-radius:50%;
      transform:translate(-50%,-50%);
      z-index:0;
      opacity:0;

    `;
  shareBtnEl.prepend(spanEl);
  spanEl.addEventListener("animationend", () => spanEl.remove());

  bodyEl.classList.toggle("shareModal");
});

closeBtnEl.addEventListener("click", (e) =>
  bodyEl.classList.remove("shareModal")
);

window.addEventListener("click", (e) =>
  e.target.classList.contains("overlay")
    ? bodyEl.classList.remove("shareModal")
    : false
);

copyEl.addEventListener("click", (e) => {
  let value = copyEl.previousElementSibling.innerHTML;
  navigator.clipboard.writeText(value);
  copyEl.innerHTML = `<p>Copied</p>`;
  setTimeout(() => {
    copyEl.innerHTML = `<i class='fas fa-copy'></i>`;
  }, 2000);
});
