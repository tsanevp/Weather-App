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

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");    
});

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const units = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;

    https.get(url, (response) => {

        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            console.log(response.statusCode);
            if (weatherData.cod !== 200) {
                // res.write("There was an error. Your status code is: " + weatherData.cod);
                res.sendFile(__dirname + "/errorPage.html");
                // res.send();
                return;
            }
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const imageId = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + imageId + "@2x.png";

            res.setHeader('Content-Type', 'text/html');
            res.write("The weather description is: " + description);
            res.write("<h1>The temp is: " + temp + "</h1>");
            res.write("<img src=" +  imageURL + ">")
            res.write("<form action=/ method=GET><button type=submit name=button>Return To Search</button></form>")
            res.send();
        });
    }).on('error', (e) => {
        res.send(e);
    });

    // res.send("it is working");
});


app.listen(3000, function() {
    console.log("Server is running on port 3000.")
})