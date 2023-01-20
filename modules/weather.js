'use strict';

const axios = require('axios');

let cache = {};


async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let key = `${lat}${lon}Weather`;

    if (cache[key] && (Date.now() - cache[key].timeStamp) < 300000) {
      response.status(200).send(cache[key].data);
    } else {

      let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

      let dataToGroom = await axios.get(url);

      let weatherData = dataToGroom.data.data.map(e => new Forecast(e));

      cache[key] = {
        data: weatherData,
        timeStamp: Date.now()
      };

      response.status(200).send(weatherData);

    }


  } catch (error) {
    next(error);
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

module.exports = getWeather;
