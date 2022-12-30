const IconEl = document.querySelector(".weatherIcon");
const TempEl = document.querySelector(".temp p");
const TempDescEl = document.querySelector(".TempDesc p");
const locationElement = document.querySelector(".location p");
const NotifyEl = document.querySelector(".notify");


const weather = {};

weather.temperature = {
    unit : "celsius"
}


const KELVIN = 273;

const key = "82005d27a116c2880c8f0fcb866998a0";


if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    NotifyEl.style.display = "block";
    NotifyEl.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

function showError(error){
    NotifyEl.style.display = "block";
    NotifyEl.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

function displayWeather(){
    IconEl.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    TempEl.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    TempDescEl.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

TempEl.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        TempEl.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        TempEl.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});