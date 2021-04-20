function StopWatch(element, action) {
  this.element =
    element instanceof Element ? element : document.querySelector(element);

  this.action = action;

  let startTime = null;
  let isRunning = false;
  let interval = null;
  let savedTime = null;
  let lapCount = 0;
  this.laps = [];

  // Elements

  let minuteEl = this.element.querySelector(".minute");
  let secondEl = this.element.querySelector(".second");
  let millisecondEl = this.element.querySelector(".millisecond");
  const lapCont = this.element.querySelector(".laps");

  // Function

  this.start = (currentBtn) => {
    if (isRunning) return this.stop(currentBtn);
    isRunning = true;
    startTime = new Date().getTime();
    getTime();
    currentBtn.innerHTML = `Stop`;
  };

  this.stop = (currentBtn) => {
    isRunning = false;
    stopTime = new Date().getTime();
    clearInterval(interval);
    interval = null;
    savedTime = time.getTime();
    currentBtn.innerHTML = `Resume`;
  };

  this.lap = () => {
    if (isRunning) updateTime(true);
    updateLap();
  };

  this.reset = (currentBtn) => {
    isRunning = false;
    clearInterval(interval);
    interval = null;
    startTime = null;
    stopTime = null;
    interval = null;
    savedTime = null;
    currentBtn.innerHTML = `Start`;
    updateDOM();
    this.laps = [];
    updateLap();
  };

  function getTime() {
    interval = setInterval(updateTime.bind(this), 100);
  }

  function updateTime(laps) {
    let currentTime = new Date().getTime();

    if (savedTime) time = new Date(currentTime - startTime + savedTime);
    else time = new Date(currentTime - startTime);

    setTime(time, laps);
  }

  function setTime(time, lap) {
    let minuteHolder = time.getMinutes();
    let minute = minuteHolder < 30 ? minuteHolder : minuteHolder - 30;
    let second = time.getSeconds();
    let millisecond = time.getMilliseconds();
    formatTime(minute, second, millisecond, lap);
  }

  formatTime = (minute, second, millisecond, lap) => {
    let minuteText = minute <= 9 ? `0${minute}` : `${minute}`;
    let secondText = second <= 9 ? `0${second}` : `${second}`;
    let millisecondText =
      Math.floor(millisecond / 11) <= 9
        ? `0${Math.floor(millisecond / 11)}`
        : `${Math.floor(millisecond / 11)}`;

    if (!lap) updateDOM(minuteText, secondText, millisecondText);
    else this.laps.push(`${minuteText}:${secondText}:${millisecondText}`);
  };

  function updateDOM(
    minuteText = `00`,
    secondText = `00`,
    millisecondText = `00`
  ) {
    minuteEl.innerHTML = minuteText;
    secondEl.innerHTML = secondText;
    millisecondEl.innerHTML = millisecondText;
  }

  updateLap = () => {
    lapCont.innerHTML = null;
    lapCount = 0;
    this.laps.forEach((lap) => createLapEl(lap));
  };

  createLapEl = (lapTime) => {
    const lapEl = document.createElement("div");
    lapEl.className = `lap`;
    const lapPara = document.createElement("p");
    lapEl.appendChild(lapPara);
    lapPara.innerHTML = `${
      lapCount <= 9 ? `0${lapCount}` : `${lapCount}`
    } - ${lapTime}`;
    lapCont.prepend(lapEl);
    lapCount++;
  };

  // Event Listener

  const { start: startEl, reset: resetEl, lapEl: lapBtn } = this.action;

  startEl.addEventListener("click", () => this.start(startBtn));
  resetEl.addEventListener("click", () => this.reset(startBtn));
  lapBtn.addEventListener("click", () => this.lap());
}

const stopwatchEl = document.getElementById("stopwatch");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");

const stopWatch = new StopWatch(stopwatch, {
  start: startBtn,
  reset: resetBtn,
  lapEl: lapBtn,
});
