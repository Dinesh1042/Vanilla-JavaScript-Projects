const secondEl = document.getElementById("second");
const minuteEl = document.getElementById("minute");
const hourEl = document.getElementById("hour");

// Digital

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

// Analog

function setTime() {
  const date = new Date();
  const second = (date.getSeconds() / 60) * 360;
  const minute = (second + date.getMinutes() / 60) * 360;
  const hour = (minute + date.getHours() / 12) * 360;
  setClock(second, minute, hour);
}

function setClock(second, minute, hour) {
  secondEl.style.transform = `rotate(${second}deg)`;
  minuteEl.style.transform = `rotate(${minute}deg)`;
  hourEl.style.transform = `rotate(${hour}deg)`;

  if (second > 350) {
    secondEl.style.transition = `none`;
  } else if (second > 6) {
    secondEl.style.transition = `.3s ease`;
  }
}

// Digital Clock

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "We", "Thu", "Fri", "Sat"];

function setTime2() {
  const date = new Date();
  const second = date.getSeconds();
  const minute = date.getMinutes();
  const hour = date.getHours();

  const secondText = second <= 9 ? `0${second}` : `${second}`;
  const minuteText = minute <= 9 ? `0${minute}` : `${minute}`;

  const hourConvert12 = hour > 12 ? hour - 12 : hour;

  const hourText =
    hourConvert12 <= 9 ? `0${hourConvert12}` : `${hourConvert12}`;

  timeEl.innerHTML = `${hourText}:${minuteText}:${secondText}`;
}

const date = new Date();
const month = months[date.getMonth()];
const day = days[date.getDay()];
dateEl.innerHTML = `${day}, ${month}`;

setInterval(() => {
  setTime();
  setTime2();
}, 1000);
