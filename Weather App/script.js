const countryEl = document.getElementById("country");
const windSpeedEl = document.getElementById("windSpeed");
const temperatureEl = document.getElementById("temperature");
const precipitationEl = document.getElementById("precipitation");
const formEl = document.getElementById("form");

const iconEl = document.getElementById("icon");

(function getGoeLocation() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(getUserCityName);
  else alert("Geo location is not supported in your browser");
})();

async function getUserCityName(position) {
  const { latitude, longitude } = position.coords;
  getWeather(`${latitude} , ${longitude}`);
}

async function getWeather(cityName) {
  const AccessKey = Null;

  // You must sign in and get your access key in the https://weatherstack.com/

  const weatherApi = `http://api.weatherstack.com/current?access_key=${AccessKey}&query=${cityName}`;

  const fetchData = await fetch(weatherApi);
  const res = await fetchData.json();
  updateDOM(res);
}

function updateDOM(data) {
  console.log(data);
  const { region, country } = data.location;
  const {
    precip,
    temperature,
    wind_speed,
    weather_descriptions,
  } = data.current;
  const icon = weather_descriptions[0].split(" ").join("_").toUpperCase();

  countryEl.innerHTML = `${region}, ${country}`;
  temperatureEl.innerHTML = temperature;
  windSpeedEl.innerHTML = wind_speed;
  precipitationEl.innerHTML = precip;

  setIcon(icon);
}

function setIcon(value) {
  let skycons = new Skycons({ color: "#3c5568" });
  skycons.play();
  skycons.set(iconEl, Skycons[value]);
}

formEl.addEventListener("submit", searchWeather);

function searchWeather(e) {
  e.preventDefault();
  let userInput = this.querySelector("input");
  let userLocation = userInput.value;
  getWeather(userLocation);

  console.log(userLocation);

  userInput.addEventListener("click", (e) => {
    userInput.select();
  });
}

setIcon("SNOW");
