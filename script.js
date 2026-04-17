"use strict";
// const weatherAPI="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=rain,temperature_2m,relative_humidity_2m,wind_speed_10m";
// const geoCodeAPI="https://geocoding-api.open-meteo.com/v1/search?name=Satkhira&count=10&language=en&format=json";

// Path HTML Document object (DOM):
let userInput = document.querySelector(".search-box input");
let searchBtn = document.querySelector(".search-box button");
let cityName = document.querySelector(".weather-card h2");
let desc = document.querySelector(".desc");
let temp = document.querySelector(".temp");
let humidity = document.querySelector(".details #p1");
let wind = document.querySelector(".details #p2");
let rainy = document.querySelector(".details #p3");
let is_day = document.querySelector(".details #p4");
let snowfall = document.querySelector(".details #p5");
let div = document.querySelector(".weather-card");
let history = document.querySelector(".history ul");


//Variables :
let weather;
let geo;

let geoAPICall = async () => {
    const urlGEO = `https://geocoding-api.open-meteo.com/v1/search?name=${userInput.value}&count=10&language=en&format=json`;
    let res = await fetch(urlGEO);
    let data = await res.json();
    try {
        geo = data.results[0];
    }
    catch (e) {
        alert("You enter incorrect location name");
    }
    return geo;
}

let weatherAPICall = async () => {
    const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=rain,temperature_2m,relative_humidity_2m,wind_speed_10m,is_day,snowfall`;
    let res = await fetch(urlWeather);
    let data = await res.json();
    weather = data.current;
    return weather;
}

let mainFunc = async () => {
    if (!userInput.value) {
        console.log("You didn't search anything");
    } else {
         geo = await geoAPICall();
        console.log(geo);
        weather = await weatherAPICall();
        console.log(weather);
        cityName.innerHTML = `${geo.admin1}, ${geo.country}`;
        desc.innerHTML = `
    <b>Location: </b> ${geo.admin1} | 
    <b>Latitude: </b> ${geo.latitude} | 
    <b>Longitude:</b>  ${geo.longitude} |
    <b>Timezone: </b> ${geo.timezone}
    `
        temp.innerHTML = `${weather.temperature_2m}°C`;
        humidity.innerHTML = `💧 Humidity: ${weather.relative_humidity_2m}%`;
        wind.innerHTML = `🌬️ Wind: ${weather.wind_speed_10m} km/h`;
        if (weather.rain <= 0) {
            rainy.innerHTML = `No rain`;

        } else {
            rainy.innerHTML = `Rain: ${weather.rain} mm`;
        }

        if (weather.snowfall == 0) {
            snowfall.innerHTML = `No snowfall`;
        } else {
            snowfall.innerHTML = `Snowfall ${weather.snowfall} cm`;
        }

        if (weather.is_day == 0) {
            is_day.innerHTML = `Night`;
        } else {
            is_day.innerHTML = `Day`;
        }
        window.localStorage.setItem(userInput.value, geo.admin1);
    
    }
}

let arr=Object.keys(localStorage);

for(let value of arr){
    // console.log(value);
    history.innerHTML += `<li>${value}</li>`;
};

searchBtn.addEventListener("click", () => {
    mainFunc();
});

document.querySelector("body").addEventListener("keydown", (e) => {
    if(e.key==="Enter"){
        mainFunc();
    }
});