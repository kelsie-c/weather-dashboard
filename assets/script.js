// use Open Weather API: One Call API & Geocoding API
let searchValue;
let cityValue;
let stateValue;
let geocodeAPIurl = "http://api.openweathermap.org/geo/1.0/";
let oneCallAPIurl = "https://api.openweathermap.org/data/2.5/onecall?";
let myAPIkey = "9d3d1ebc0d24d21eb01463e1e0715eb4";
let cityButtons = document.querySelector(".savedCities");
let currentWeather = $('.current-weather');
let currentTemp = $('.current-temp');


currentDay = moment().format('MM')
currentHour = moment().format('H');

// Checks current day and hour and updates textarea background colors once an hour
setInterval(function() {
    currentDay = moment().format('MM');
    currentHour = moment().format('H');    
}, 360000);

// use this variable to test if user input a 5-digit zip code
let zipCodeParam = /^\d{5}$/;

// log user input city and send to local storage
let searchCity = document.querySelector('.searchInput');
let searchBtn = document.querySelector('.searchBtn');

// when zip code search button is clicked, assign user input to a variable and send to api
$('.searchbtnZip').on('click', function(event) {
    searchValue = event.target.parentElement.parentElement.children[0].children[0].value;
    console.log(searchValue);
    if (zipCodeParam.test(searchValue) === true) {
        // send zip code to geocoding api and return city, lat & lon
        let zipSearch = geocodeAPIurl + "zip?zip=" + searchValue + ",US&appid=" + myAPIkey;
        fetch(zipSearch)
            .then(response => response.json())
            .then(data => {
                // reset form values
                searchValue = event.target.parentElement.parentElement.children[0].children[0].value='';

                console.log(data);
                let lat = data.lat;
                console.log(lat);
                let lon = data.lon;
                console.log(lon);
                // create an object with the lattitude and longitude
                let obj = {
                    lat,
                    lon
                }
                console.log(obj);
                let city = data.name;
                console.log(city);
                currentWeather.text("Current weather for " + city + " - " + moment().format('MMMM Do, YYYY'));
                // send city name and object to local storage & create button
                sendToLocalStorage(city, obj);
                getWeather(lat,lon);
            });
    }  
    // else return error message - please enter a valid 5-digit zip code 
})

$('.searchbtnName').on('click', function(event) {
    cityValue = event.target.parentElement.parentElement.children[0].children[0].value;
    stateValue = event.target.parentElement.parentElement.children[1].children[0].value;
    console.log(cityValue);
    console.log(stateValue);
    let nameSearch = geocodeAPIurl + "direct?q=" + cityValue + "," + stateValue + ",US&appid=" + myAPIkey;
    fetch(nameSearch)
        .then(response => response.json())
        .then(data => {
            // reset form values
            cityValue = event.target.parentElement.parentElement.children[0].children[0].value='';
            stateValue = event.target.parentElement.parentElement.children[1].children[0].value='';

            console.log(data);
            let lat = data[0].lat;
            console.log(lat);
            let lon = data[0].lon;
            console.log(lon);
            // create an object with the lattitude and longitude
            let obj = {
                lat,
                lon
            }
            console.log(obj);
            let city = data[0].name;
            console.log(city);
            currentWeather.text("Current weather for " + city + " - " + moment().format('MMMM Do, YYYY'));
            // send city name and object to local storage & create button
            sendToLocalStorage(city, obj);
            getWeather(lat,lon);
        });  
    // else return error message - please enter a valid 5-digit zip code 
})

// Set event listener for created buttons that call the weather api
$('.savedCities').on('click', function(event) {
    let cityName = event.target.textContent;
    console.log(cityName);
    let newRequest = localStorage.getItem(cityName);
    let clickedCity = JSON.parse(newRequest);
    console.log(newRequest);
    console.log(clickedCity);
    let lat = clickedCity.lat;
    let lon = clickedCity.lon;
    getWeather(lat,lon);
})

// Set local storage and create button
function sendToLocalStorage(city, obj) {
    localStorage.setItem(city, JSON.stringify(obj));
    createButtons(city);
}

function createButtons(city) {
    let allButtons = document.querySelectorAll(".savedCities");
    for (i = 0; i < allButtons.length; i++) {
        let savedbtnCities = allButtons[i].innerText;

        if (savedbtnCities.includes(city)) {
            return;
        } else {
            let newCity = document.createElement("button");
            newCity.innerText = city;
            newCity.classList.add("button");
            newCity.classList.add("is-block");
            cityButtons.append(newCity);
        }
    }
}

function getWeather(lat,lon) {
    console.log(lat);
    console.log(lon);
    let searchURL = oneCallAPIurl + "lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myAPIkey;
    fetch(searchURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let tempData = data.current.temp;
            currentTemp.text(tempData);
        });

}

// populate buttons on page from local storage on page load
function loadButtons() {
    let values = [];
    let keys = Object.entries(localStorage);

    for (i = 0; i < keys.length; i++) {
        values.push(localStorage.key(i));
    }
    
    for (j = 0; j < values.length; j++) {
        let city = values[j];
        let newCity = document.createElement("button");
        newCity.innerText = city;
        newCity.classList.add("button");
        newCity.classList.add("is-block");
        cityButtons.append(newCity);
    }
}

// api call to get the following for current day stats:

    // current temperature

    // current feels like temperature

    // current precipitation percentage

    // current weather (sunny, cloudy, rainy, etc) & assign an icon depending on response

    // humidity

    // wind

    // pressure

    // visibility

    // dew point

    // uv index

// api call to get the following for next three hour stats:

    // temperature

    // weather

    // humidity

    // wind

// api call to get the following for each of the next 5 days:

    // temperature

    // weather

    // wind

loadButtons();
onload();
// on load show data for NYC
function onload() {
    let lat = 40.7143;
    let lon = -74.006;
    currentWeather.text("Current weather for New York City - " + moment().format('MMMM Do, YYYY'));
    getWeather(lat,lon);
}