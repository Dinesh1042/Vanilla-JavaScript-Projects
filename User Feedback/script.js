const emojiContEl = document.getElementById("emojiCont");
const starsEl = document.querySelectorAll("#stars input");

starsEl.forEach((star) => {
  star.addEventListener("input", (e) => {
    let currentEmoji = e.target.id;

    if (currentEmoji === `rate-1`) angryEmoji();
    if (currentEmoji === `rate-2`) sadEmoji();
    if (currentEmoji === `rate-3`) neutralEmoji();
    if (currentEmoji === `rate-4`) smileEmoji();
    if (currentEmoji === `rate-5`) loveItEmoji();
  });
});

function angryEmoji() {
  return (emojiContEl.innerHTML = `
       <div class="emoji angry">
       <div class="emojiFace">
        <div class="eyeBrow"></div>
        <div class="eye"></div>
        <div class="mouth"></div>
       </div>
       </div>`);
}

function loveItEmoji() {
  return (emojiContEl.innerHTML = `
    <div class="emoji loveIt">
  <div class="emojiFace">
    <div class="eyes">
      <div class="eye eye1"></div>
      <div class="eye eye2"></div>
    </div>
    <div class="mouth"></div>
  </div>
</div>`);
}

function smileEmoji() {
  return (emojiContEl.innerHTML = `
        <div class="emoji smile">
        <div class="emojiFace">
        <div class="emojiBrow"></div>
        <div class="emojiEye"></div>
        <div class="emojiMouth"></div>
        </div>
        </div>`);
}

function neutralEmoji() {
  return (emojiContEl.innerHTML = `<div class="emoji neutral">
            <div class="emojiFace">
              <div class="eye"></div>
              <div class="mouth"></div>
            </div>
          </div>`);
}
function sadEmoji() {
  emojiContEl.innerHTML = `
        <div class="emoji sad">
            <div class="emojiFace">
              <div class="eye"></div>
              <div class="mouth"></div>
            </div>
          </div>`;
}

loveItEmoji();
