 
const api_key = "be5cba9513a1d559a571d0d38ad6bc4b";
let city = '';

document.addEventListener('DOMContentLoaded', () => {
    displayRecentSearches();
});

function captureInput() {
    var userInput = document.getElementById('cityInput').value.trim();
    city = userInput;

    //after getting input from user, we save it, show the recent searches, and ccall getGeo to display our info
    if (userInput) {
        saveSearch(userInput);
        displayRecentSearches();
        getGeo()
    }
}
function saveSearch(search) {
    //this grabs the input data from our local storage and saves them to a variable which we can use later
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    //to get rid of duplicates
    if (!searches.includes(search)) {
        searches.push(search);
        localStorage.setItem('recentSearches', JSON.stringify(searches));
}
}

function displayRecentSearches() {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    let recentSearchesDiv = document.getElementById('recentSearches');

    recentSearchesDiv.innerHTML = '';

    searches.forEach((search, index) => {
        //makes an 'a' tag
        let searchLink = document.createElement('a');
        searchLink.className = 'panel-block';
        searchLink.textContent = search;
        searchLink.addEventListener('click', () => {
            city = search;
            getGeo();
        });
        recentSearchesDiv.appendChild(searchLink);

        //adds a line break after all of the recent searches but not the last one
        if (index < searches.length - 1) {
            recentSearchesDiv.appendChild(document.createElement('br'));
        }
    });
}

//gets rid of the searches from local storage and clears them from the page with displayRecentSearches
function clearSearches() {
    localStorage.removeItem('recentSearches');
    displayRecentSearches();
}

function getGeo() {
    fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api_key}`)
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        const lat = data[0].lat;
        const lon = data[0].lon;
        
        console.log(lat)
        console.log(lon)

        displayCurrentCity(city);
        getWeather(lat, lon)
    })
}

function getWeather(latitude, longitude) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            displayWeatherForecast(data.list);
        })
}

function displayWeatherForecast(forecastList) {
    let forecastContainer = document.querySelector('.container.is-pulled-right');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < Math.min(5, forecastList.length); i++) {
        let forecast = forecastList[i];
        let date = new Date(forecast.dt * 1000);

        let forecastBox = document.createElement('div');
        forecastBox.className = 'box';
        forecastBox.style.width = '150px';

        forecastBox.innerHTML = `
            <p>Date: ${date.toLocaleDateString()}</p>
            <p>Description: ${forecast.weather[0].description}</p>
            <p>Temperature: ${forecast.main.temp} K</p>
        `;

        forecastContainer.appendChild(forecastBox);
    }
    
}

function displayCurrentCity(cityName) {
    let currentCitySpan = document.getElementById('currentCity');
    currentCitySpan.textContent = cityName; // Update current city name
}

displayRecentSearches();