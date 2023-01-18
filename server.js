'use strict';

console.log('1st server');


// **** REQUIRES ****
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { response } = require('express');
let data = require('./data/weather.json');
const axios = require('axios');


// **** Once express is in we need to use it - per express docs
// **** app === server
const app = express();

// **** MIDDLEWARE ****
// cors is middleware - security guard that allows us to share resources across the internet
app.use(cors());

// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3002;

// **** ENDPOINTS ****

// *** Base endpoint - proof of life
// **1st arg - endpoint in quotes
// **2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req, res)
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('/hello', (request, response) => {
  console.log(request.query);

  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server!`);
});

app.get('/weather', async (request, response, next) => {
  try {
    let searchQuery = request.query.searchQuery;
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let dataToGroom = await axios.get(url);

    let weatherData = dataToGroom.data.data.map(e => new Forecast(e));

    response.status(200).send(weatherData);

  } catch (error) {
    next(error);
  }
});

app.get('/movies', async (request, response, next) => {
  try {

    let searchQuery = request.query.searchQuery;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${searchQuery}`;

    let dataToGroom = await axios.get(url);

    let movieData = dataToGroom.data.results.map(e => new Movies(e));

    response.status(200).send(movieData);


  } catch (error) {
    next(error);
  }
});

// **** CLASS TO GROOM BULKY DATA ****

class Movies {
  constructor(city) {
    this.title = city.original_title;
    this.overview = city.overview;
  }
}

class Forecast {
  constructor(searchObj) {
    this.date = searchObj.datetime;
    this.description = searchObj.weather.description;
    this.lowTemp = searchObj.low_temp;
    this.maxTemp = searchObj.max_temp;
  }
}

// **** CATCH ALL ENDPOINT - NEEDS TO BE LAST DEFINED ENDPOINT ****

app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});

// **** ERROR HANDLING ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// **** SERVER START ****
app.listen(PORT, () => console.log(`We are running on port: ${PORT}`));
