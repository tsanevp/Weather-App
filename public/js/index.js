const form = document.getElementById('searchForm');

form.addEventListener('submit', (event) => {
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

            addWeatherData(data, unitsCelcius);
            console.log(document.getElementById("img-description").classList);
        })
        .catch(error => {
            console.log("There was an error fetching the weather results. "
                + "Examine the following error:\n" + error);
        });;
});

function invalidLocationSearch() {
    document.getElementById("data-container").classList.remove("form-results");
    document.getElementById("data-container").classList.add("data-container");

    document.getElementById("weather-results").classList.add("hidden");
    document.getElementById("welcome-msg").classList.remove("hidden");
    document.getElementById("error-msg").classList.remove("hidden");
}

function addWeatherData(data, unitsCelcius) {
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
    document.getElementById("weather-img").src = imageURL;
    document.getElementById("temp").textContent = temp + " \u00B0" + unitsTemp;
    document.getElementById("weather-description").textContent = description;
    document.getElementById("feels-like-temp").textContent = feelsLike + " \u00B0" + unitsTemp;
    document.getElementById("humidity-value").textContent = humidity + "%";
    document.getElementById("wind-value").textContent = wind + " " + unitsSpeed;
    document.getElementById("temp-high").textContent = "H: " + tempMax + " \u00B0" + unitsTemp;
    document.getElementById("temp-low").textContent = "L: " + tempMin + " \u00B0" + unitsTemp;

    // Display results
    document.getElementById("data-container").classList.add("form-results");
    document.getElementById("data-container").classList.remove("data-container");
    document.getElementById("weather-results").classList.remove("hidden");
    document.getElementById("error-msg").classList.add("hidden");
    document.getElementById("welcome-msg").classList.add("hidden");
};