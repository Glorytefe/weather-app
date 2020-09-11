// select required Element

const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

// store data in object.. this can be gotten from the api
const weather = {};

weather.temperature = {
    unit: "celsius",
};

// app const..
const KELVIN = 273;
// api key
const key = "853b5d2ce3bb8180f0b86df75c062cd5";
// check if browser supports geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support Geolocation</p>";
}

// set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
// show error when there is an issue with geolocation services on client's device
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// get weather from api
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.IconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}
// display weather by changing innerHtml of the required element
function displayWeather() {
    iconElement.innerHTML = `<img src='icons/${weather.IconId}.png'>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = `${weather.description};`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// celsius to fahrenheit conversion
function cel(temperature) {
    return (temperature * 9) / 5 + 32;
}

tempElement.addEventListener("click", conversion);

function conversion() {
    if (weather.temperature.value === undefined) return;
    if (weather.temperature.unit == "celsius") {
        let fahrenheit = cel(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
}
