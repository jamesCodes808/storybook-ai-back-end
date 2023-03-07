'use strict';

const axios = require('axios');

function getMovies(req, res, next) {
  let movie = req.query.searchQuery;
  let moviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_KEY}&query=${movie}`;

  axios.get(moviesUrl)
    .then(response => {
      let liveInfo = response.data.results.map(movie => new Movies(movie));
      res.status(200).send(liveInfo);
    })
    .catch(error => next(error));
}

// create a movies class so we can store info in it
class Movies {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.average_votes;
    (this.posterImgPath = `https://image.tmdb.org/t/p/w500//${movie.posterImgPath}`),
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

module.exports = getMovies;
