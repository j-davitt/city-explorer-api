'use strict';

const axios = require('axios');

async function getMovies(request,response,next){
  try {
  
    let searchQuery = request.query.searchQuery;
  
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${searchQuery}`;
  
    let dataToGroom = await axios.get(url);
  
    let movieData = dataToGroom.data.results.map(e => new Movies(e));
  
    response.status(200).send(movieData);
  
  
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
