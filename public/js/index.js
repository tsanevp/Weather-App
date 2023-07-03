var resultsDisplayed = false;
var unitsSelector = document.getElementById('checkbox');

const form = document.getElementById('searchForm');

form.addEventListener('submit', (event) => {
    getWeatherResults(event);
});

unitsSelector.addEventListener('change', function (event) {
    if (resultsDisplayed) getWeatherResults(event);
});

function getWeatherResults(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const cityName = Object.fromEntries(formData).cityName;
    const unitsCelcius = document.getElementById("checkbox").checked;
    const weatherValues = { cityName, unitsCelcius }

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherValues)
    }).then(response => response.json())
        .then(data => {
            if (data.invalidLocation) {
                invalidLocationSearch();
                return;
            }

            addWeatherData(data, unitsCelcius, cityName);
        })
        .catch(error => {
            console.log("There was an error fetching the weather results. "
                + "Examine the following error:\n" + error);
        });;
};

function invalidLocationSearch() {
    resultsDisplayed = false;

    $("#data-container").removeClass("form-results");
    $("#data-container").addClass("data-container");

    $("#weather-results").addClass("hidden");
    $("#welcome-msg").removeClass("hidden");
    $("#error-msg").removeClass("hidden");
};

function addWeatherData(data, unitsCelcius, cityName) {
    resultsDisplayed = true;

    // Pull data from Weather API results
    const imageURL = data.imageURL;
    const temp = data.temp;
    const description = data.description;
    const feelsLike = data.feelsLike;
    const humidity = data.humidity;
    const wind = data.wind;
    const tempMax = data.tempMax;
    const tempMin = data.tempMin;

    let unitsTemp = "F";
    if (unitsCelcius) unitsTemp = "C";

    let unitsSpeed = "mph";
    if (unitsCelcius) unitsSpeed = "km/h";

    // Update weather results accordingly
    $("#weather-img").attr("src", imageURL);
    $("#location").text(capitilizeLetters(cityName));
    $("#temp").text(temp + " \u00B0" + unitsTemp);
    $("#weather-description").text(description);
    $("#feels-like-temp").text(feelsLike + " \u00B0" + unitsTemp);
    $("#humidity-value").text(humidity + "%");
    $("#wind-value").text(wind + " " + unitsSpeed);
    $("#temp-high").text("H: " + tempMax + " \u00B0" + unitsTemp);
    $("#temp-low").text("L: " + tempMin + " \u00B0" + unitsTemp);

    // Display results
    $("#data-container").addClass("form-results");
    $("#data-container").removeClass("data-container");
    $("#weather-results").removeClass("hidden");
    $("#error-msg").addClass("hidden");
    $("#welcome-msg").addClass("hidden");
};

function capitilizeLetters(location) {
    const arr = location.split(" ");

    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    };

    return arr.join(" ");
};