const accpectBtn = document.getElementById("acceptBtn");
const cookieContainer = document.getElementById("cookieContainer");

const isCookieThere = document.cookie.includes("CookieBy=Yummy🍪");

accpectBtn.addEventListener("click", acceptCookie);

if (isCookieThere) cookieContainer.classList.remove("accept-cookie");
else cookieContainer.classList.add("accept-cookie");

function acceptCookie() {
  document.cookie = "CookieBy=Yummy🍪;max-age=" + 60 * 60 * 24 * 30;

  if (document.cookie) cookieContainer.classList.remove("accept-cookie");
  else alert("Can't set Cookie.🍪");
}
