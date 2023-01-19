'use strict';

console.log('1st server');


// **** REQUIRES ****
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');


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


app.get('/weather', getWeather);

app.get('/movies', getMovies);



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
