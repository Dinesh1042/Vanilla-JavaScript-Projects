const songData = [
  {
    songName: "Ukulele",
    song: "./Music/ukulele.mp3",
    songImg: "./asset/ukulele.jpg",
    songAuthour: "JV",
  },
  {
    songName: "Hey",
    song: "./Music/hey.mp3",
    songImg: "./asset/hey.jpg",
    songAuthour: "Awesome",
  },
  {
    songName: "Summer",
    song: "./Music/summer.mp3",
    songImg: "./asset/summer.jpg",
    songAuthour: "JM",
  },
];

const audioEl = document.getElementById("audio");

const prevEl = document.getElementById("prev");
const playEl = document.getElementById("play");
const forwardEl = document.getElementById("forward");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const progressFlowEl = document.getElementById("progressFlow");
const progressEl = document.getElementById("progress");

const logoEl = document.getElementById("logo");
const songNameEl = document.getElementById("songName");
const authorEl = document.getElementById("author");

// Icon

const playIcon = `<ion-icon name="play"></ion-icon>`;
const pauseIcon = `<ion-icon name="pause"></ion-icon>`;

// Functions

let songIndex = 0;
let isSongPaused = true;

function playNext() {
  songIndex = 1 + songIndex;
  if (songIndex > songData.length - 1) {
    songIndex = 0;
  }
  return updateSong(songIndex);
}

function playPrev() {
  songIndex = 1 - songIndex;
  if (songIndex < 0) {
    songIndex = songData.length - 1;
  }
  return updateSong(songIndex);
}

function updateSong(index) {
  audioEl.setAttribute("src", songData[index].song);

  logoEl.src = songData[index].songImg;
  songNameEl.innerHTML = songData[index].songName;
  authorEl.innerHTML = songData[index].songAuthour;
  audioEl.addEventListener("loadeddata", (e) => {
    return updateTime(e);
  });
  if (!isSongPaused) {
    playEl.innerHTML = pauseIcon;
    audioEl.play();
  }
}

function playMusic() {
  if (audioEl.paused) {
    audioEl.play();
    playEl.innerHTML = pauseIcon;
    isSongPaused = false;
  } else if (!audioEl.paused) {
    audioEl.pause();
    playEl.innerHTML = playIcon;
    isSongPaused = true;
  }
}

function updateTime(e) {
  const { currentTime, duration } = e.srcElement;

  // Current Time

  let currSeconds =
    JSON.parse(currentTime % 60) < 10
      ? `0${Math.floor(currentTime % 60)}`
      : `${Math.floor(currentTime % 60)}`;

  let currentMin =
    Math.floor(currentTime / 60) <= 9
      ? `0${Math.floor(currentTime / 60)}`
      : `${Math.floor(currentTime / 60)}`;

  currentTimeEl.innerHTML = `${currentMin}:${currSeconds}`;

  // Total Duration

  let totalDurationSecond =
    Math.floor(duration % 60) <= 9
      ? `0${Math.floor(duration % 60)}`
      : `${Math.floor(duration % 60)}`;

  let totalDurationMinute =
    Math.floor(duration / 60) <= 9
      ? `0${Math.floor(duration / 60)}`
      : `${Math.floor(duration / 60)}`;

  totalTimeEl.innerHTML = `${totalDurationMinute}:${totalDurationSecond}`;
}

function updateProgress(e) {
  const { currentTime, duration } = e.srcElement;

  let currentProgress = (currentTime / duration) * 100;

  progressFlowEl.style.width = `${currentProgress}%`;
}

function setProgress(e) {
  const progressWidth = this.clientWidth;
  const clickPos = e.offsetX;
  const audioDuration = audioEl.duration;
  audioEl.currentTime = (clickPos / progressWidth) * audioDuration;
}

// Change Song

forwardEl.addEventListener("click", playNext);
prevEl.addEventListener("click", playPrev);

playEl.addEventListener("click", playMusic);

audioEl.addEventListener("timeupdate", updateTime);

audioEl.addEventListener("timeupdate", updateProgress);

progressEl.addEventListener("click", setProgress);

audioEl.addEventListener("ended", playNext);

updateSong(songIndex);
