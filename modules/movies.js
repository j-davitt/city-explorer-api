'use strict';

const axios = require('axios');

let cache = {};


async function getMovies(request, response, next) {
  try {

    let searchQuery = request.query.searchQuery;

    // **** CREATE KEY ****
    let key = `${searchQuery}Movie`;

    // **** IF IT EXISTS AND IS IN A VALID TIME - SEND THAT DATA
    if (cache[key] && (Date.now() - cache[key].timeStamp) < 300000) {
      response.status(200).send(cache[key].data);

    } else {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${searchQuery}`;

      let dataToGroom = await axios.get(url);

      let movieData = dataToGroom.data.results.map(e => new Movies(e));

      // **** Cache the results from API call
      cache[key] = {
        data: movieData,
        timeStamp: Date.now()
      };

      response.status(200).send(movieData);

    }



  } catch (error) {
    next(error);
  }
}

class Movies {
  constructor(city) {
    this.title = city.original_title;
    this.overview = city.overview;
    this.poster = `https://image.tmdb.org/t/p/w500/${city.poster_path}`;
  }
}

module.exports = getMovies;
