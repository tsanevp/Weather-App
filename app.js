import express from 'express';
import https from 'https';
import secrets from './secrets.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const apiKey = secrets.apiKey;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/contact.html", function (req, res) {
    res.sendFile(__dirname + "/contact.html");
});

app.get("/about.html", function (req, res) {
    res.send("Built using Nodejs and Expressjs");
});

app.post("/", function (req, res) {
    // console.log(req.body);
    const query = req.body.cityName;
    const units = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;

    https.get(url, (response) => {
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);

            if (weatherData.cod !== 200) {
                const invalidLocation = query;
                res.send({ invalidLocation });
                return;
            }

            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const tempMin = weatherData.main.temp_min;
            const tempMax = weatherData.main.temp_max;
            const wind = weatherData.wind.speed;
            const humidity = weatherData.main.humidity;
            const description = weatherData.weather[0].description;
            const imageId = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + imageId + "@2x.png";

            res.send({ temp, feelsLike, tempMin, tempMax, wind, humidity, description, imageURL});
        });
    }).on('error', (e) => {
        res.send(e);
    });
});

app.post("/contact.html", function (req, res) {
    const { name, emailAddress, message } = req.body;
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSddoLVzy0JmAmq2P5ynYhaX8hUBJ22c3yuNFlWgt7Z13SBJ3A/formResponse?entry.225115399=" + name + "&entry.90530336=" + emailAddress + "&entry.2053798052=" + message;

    https.get(url, (response) => {
        const responseCode = response.statusCode;

        if (response.statusCode !== 200) {
            res.sendFile(__dirname + "/contactError.html");
            return;
        }

        res.sendFile(__dirname + "/contactSuccess.html");
    }).on('error', (e) => {
        res.send(e);
    });
});


app.listen(3000, function () {
    console.log("Server is running on port 3000.")
})