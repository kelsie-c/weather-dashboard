// use Open Weather API: One Call API & Geocoding API
let searchValue;
let cityValue;
let stateValue;
let cities = JSON.parse(localStorage.getItem("cities"));
let geocodeAPIurl = "https://api.openweathermap.org/geo/1.0/";
let oneCallAPIurl = "https://api.openweathermap.org/data/2.5/onecall?";
let myAPIkey = "9d3d1ebc0d24d21eb01463e1e0715eb4";
let cityButtons = document.querySelector(".savedCities");
let currentWeather = $('.current-weather');
let currentTemp = $('.current-temp');
let feelsLike = $('.feels-like');
let weatherNow = $('.weather-now');
let weatherIcon = $('#wicon');
let currentHumidity = $('.humidity');
let currentWind = $('.wind');
let currentUV = $('.uv-index');
let currentPressure = $('.pressure');
let currentVisibility = $('.visibility');
let currentDewPoint = $('.dew-point');

currentDay = moment().format('MM')
currentHour = moment().format('H');
// console.log(currentHour);
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
    // console.log(searchValue);
    if (zipCodeParam.test(searchValue) === true) {
        // send zip code to geocoding api and return city, lat & lon
        let zipSearch = geocodeAPIurl + "zip?zip=" + searchValue + ",US&appid=" + myAPIkey;
        fetch(zipSearch)
            .then(response => response.json())
            .then(data => {
                // reset form values
                searchValue = event.target.parentElement.parentElement.children[0].children[0].value='';

                // console.log(data);
                let lat = data.lat;
                // console.log(lat);
                let lon = data.lon;
                // console.log(lon);
                // create an object with the lattitude and longitude
                let obj = {
                    lat,
                    lon
                }
                // console.log(obj);
                let city = data.name;
                // console.log(city);
                currentWeather.text("Current weather for " + city + " - " + moment().format('MMMM Do, YYYY'));
                // send city name and object to local storage & create button
                cities.push({city, obj});
                sendToLocalStorage(cities);
                createButtons(city);
                getWeather(city,lat,lon);
            });
    }  
    // else return error message - please enter a valid 5-digit zip code 
})

$('.searchbtnName').on('click', function(event) {
    cityValue = event.target.parentElement.parentElement.children[0].children[0].value;
    stateValue = event.target.parentElement.parentElement.children[1].children[0].value;
    // console.log(cityValue);
    // console.log(stateValue);
    let nameSearch = geocodeAPIurl + "direct?q=" + cityValue + "," + stateValue + ",US&appid=" + myAPIkey;
    fetch(nameSearch)
        .then(response => response.json())
        .then(data => {
            // reset form values
            cityValue = event.target.parentElement.parentElement.children[0].children[0].value='';
            stateValue = event.target.parentElement.parentElement.children[1].children[0].value='';

            // console.log(data);
            let lat = data[0].lat;
            // console.log(lat);
            let lon = data[0].lon;
            // console.log(lon);
            // create an object with the lattitude and longitude
            let obj = {
                lat,
                lon
            }
            // console.log(obj);
            let city = data[0].name;
            // console.log(city);
            currentWeather.text("Current weather for " + city + " - " + moment().format('MMMM Do, YYYY'));
            // send city name and object to local storage & create button
            cities.push({city, obj});
            sendToLocalStorage(cities);
            createButtons(city);
            getWeather(city,lat,lon);
        });  
    // else return error message - please enter a valid 5-digit zip code 
})

// Set event listener for created buttons that call the weather api
$('.savedCities').on('click', function(event) {
    let cityName = event.target.textContent;
    // console.log(cityName);
    let newRequest = localStorage.getItem("cities");
    let keyObj = JSON.parse(newRequest);

    for (i = 0; i < keyObj.length; i++) {
        if (cityName === keyObj[i].city) {
            lat = keyObj[i].obj.lat;
            lon = keyObj[i].obj.lon;
        }
    }
    currentWeather.text("Current weather for " + cityName + " - " + moment().format('MMMM Do, YYYY'));
    getWeather(cityName,lat,lon);
})

// Set local storage and create button
function sendToLocalStorage(cities) {
    localStorage.setItem("cities", JSON.stringify(cities));
    
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

function getWeather(city,lat,lon) {
    // console.log(lat);
    // console.log(lon);
    let searchURL = oneCallAPIurl + "lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myAPIkey;
    fetch(searchURL)
        .then(response => response.json())
        .then(data => {
            // get weather data
            // console.log(data);

            // current temperature, feels like, and icon
            let tempData = Math.round(data.current.temp);
            currentTemp.text(tempData + "\u00B0");
            let feelsLikeTemp = Math.round(data.current.feels_like);
            let currentWeatherDesc = data.current.weather[0].main;
            let currentIcon = data.current.weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + currentIcon + ".png";
            $("#wicon").html("<img src='" + iconURL  + "'>");
            // console.log(data.current.weather);
            feelsLike.text("Feels like " + feelsLikeTemp + "\u00B0");
            weatherNow.text(currentWeatherDesc);

            // current humidity, wind speed, uv index, pressure, visibility, & dewpoint
            let humidity = data.current.humidity;
            currentHumidity.text("Humidity: " + humidity + "%");
            let wind = Math.round(data.current.wind_speed);
            currentWind.text("Wind Speed: " + wind + " mph");
            let uvIndex = data.current.uvi;
            currentUV.text("UV Index: " + uvIndex);
            if (Math.round(uvIndex) <= 2) {
                currentUV.addClass("green");
            } else if (Math.round(uvIndex) > 2 && Math.round(uvIndex) <= 5) {
                currentUV.addClass("yellow");
            } else if (Math.round(uvIndex) > 5 && Math.round(uvIndex) <= 7) {
                currentUV.addClass("orange");
            } else if (Math.round(uvIndex) > 7 && Math.round(uvIndex) <= 10) {
                currentUV.addClass("red");
            } else {
                currentUV.addClass("purple");
            }
            let pressure = data.current.pressure;
            currentPressure.text("Pressure: " + pressure + " hPa")
            let visibility = data.current.visibility;
            currentVisibility.text("Visibility: " + visibility + " m");
            let dewPoint = Math.round(data.current.dew_point);
            currentDewPoint.text("Dew Point: " + dewPoint + " \u00B0" + "F");

            // next 3 hours
            let firstHour = Math.round(currentHour) + 1;
            if (firstHour > 24) {
                firstHour = firstHour - 24;
            } else if (firstHour > 12) {
                firstHour = firstHour - 12;
            }
            $(".time1").text(firstHour);
            let hour1 = data.hourly[1].weather[0].icon;
            let iconURL1 = "http://openweathermap.org/img/w/" + hour1 + ".png";
            $(".hour1").html("<img src='" + iconURL1  + "'>");
            let hour1Temp = Math.round(data.hourly[1].temp);
            $(".hour1-temp").text(hour1Temp + "\u00B0");

            let secondHour = Math.round(currentHour) + 2;
            if (secondHour > 24) {
                secondHour = secondHour - 24;
            } else if (secondHour > 12) {
                secondHour = secondHour - 12;
            }
            $(".time2").text(secondHour);
            let hour2 = data.hourly[2].weather[0].icon;
            let iconURL2 = "http://openweathermap.org/img/w/" + hour2 + ".png";
            $(".hour2").html("<img src='" + iconURL2  + "'>");
            let hour2Temp = Math.round(data.hourly[2].temp);
            $(".hour2-temp").text(hour2Temp + "\u00B0");

            let thirdHour = Math.round(currentHour) + 3;
            if (thirdHour > 24) {
                thirdHour = thirdHour - 24;
            } else if (thirdHour > 12) {
                thirdHour = thirdHour - 12;
            }
            $(".time3").text(thirdHour);
            let hour3 = data.hourly[3].weather[0].icon;
            let iconURL3 = "http://openweathermap.org/img/w/" + hour3 + ".png";
            $(".hour3").html("<img src='" + iconURL3  + "'>");
            let hour3Temp = Math.round(data.hourly[3].temp);
            $(".hour3-temp").text(hour3Temp + "\u00B0");

            // next 5 days 
            let date1 = moment().add(1, "days");
            $(".day1").text(date1.format("MM-DD-YY"));
            let day1Icon = data.daily[1].weather[0].icon;
            let dayIconURL1 = "http://openweathermap.org/img/w/" + day1Icon + ".png";
            $(".icon-1").html("<img src='" + dayIconURL1  + "'>");
            let day1Temp = Math.round(data.daily[1].temp.day);
            $(".day1-temp").text(day1Temp + "\u00B0");
            let day1Humidity = data.daily[1].humidity;
            $(".day1-humid").text("Humidity: " + day1Humidity + "%");

            let date2 = moment().add(2, "days");
            $(".day2").text(date2.format("MM-DD-YY"));
            let day2Icon = data.daily[2].weather[0].icon;
            let dayIconURL2 = "http://openweathermap.org/img/w/" + day2Icon + ".png";
            $(".icon-2").html("<img src='" + dayIconURL2  + "'>");
            let day2Temp = Math.round(data.daily[2].temp.day);
            $(".day2-temp").text(day2Temp + "\u00B0");
            let day2Humidity = data.daily[2].humidity;
            $(".day2-humid").text("Humidity: " + day2Humidity + "%");

            let date3 = moment().add(3, "days");
            $(".day3").text(date3.format("MM-DD-YY"));
            let day3Icon = data.daily[3].weather[0].icon;
            let dayIconURL3 = "http://openweathermap.org/img/w/" + day3Icon + ".png";
            $(".icon-3").html("<img src='" + dayIconURL3  + "'>");
            let day3Temp = Math.round(data.daily[3].temp.day);
            $(".day3-temp").text(day3Temp + "\u00B0");
            let day3Humidity = data.daily[3].humidity;
            $(".day3-humid").text("Humidity: " + day3Humidity + "%");

            let date4 = moment().add(4, "days");
            $(".day4").text(date4.format("MM-DD-YY"));
            let day4Icon = data.daily[4].weather[0].icon;
            let dayIconURL4 = "http://openweathermap.org/img/w/" + day4Icon + ".png";
            $(".icon-4").html("<img src='" + dayIconURL4  + "'>");
            let day4Temp = Math.round(data.daily[4].temp.day);
            $(".day4-temp").text(day4Temp + "\u00B0");
            let day4Humidity = data.daily[4].humidity;
            $(".day4-humid").text("Humidity: " + day4Humidity + "%");

            let date5 = moment().add(5, "days");
            $(".day5").text(date5.format("MM-DD-YY"));
            let day5Icon = data.daily[5].weather[0].icon;
            let dayIconURL5 = "http://openweathermap.org/img/w/" + day5Icon + ".png";
            $(".icon-5").html("<img src='" + dayIconURL5  + "'>");
            let day5Temp = Math.round(data.daily[5].temp.day);
            $(".day5-temp").text(day5Temp + "\u00B0");
            let day5Humidity = data.daily[5].humidity;
            $(".day5-humid").text("Humidity: " + day5Humidity + "%");
            // createButtons(city);
        });
}

// populate buttons on page from local storage on page load
function loadButtons() {
    let values = [];
    let keys = localStorage.getItem("cities");
    if (keys !== null) {
        let keyObj = JSON.parse(keys);
        console.log(keys);
    
        for (i = 0; i < keyObj.length; i++) {
            values.push(keyObj[i].city);
        }
        // console.log(values);
        
        for (j = 0; j < values.length; j++) {
            let city = values[j];
            let newCity = document.createElement("button");
            newCity.innerText = city;
            newCity.classList.add("button");
            newCity.classList.add("is-block");
            cityButtons.append(newCity);
        }
    }
}

loadButtons();
onload();

// on load show data for NYC
function onload() {
    let start = "New York City"
    let lat = 40.7143;
    let lon = -74.006;
    currentWeather.text("Current weather for New York City - " + moment().format('MMMM Do, YYYY'));
    getWeather(start,lat,lon);
}