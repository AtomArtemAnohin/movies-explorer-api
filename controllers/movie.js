const Movie = require('../models/movie.js');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

//  Получить все фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

//  Создать фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      throw new ValidationError(`Данные неверны: ${err}`);
    })
    .catch(next);
};

//  Удалить фильм
const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .orFail(new Error('Нет такого фильма'))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }

      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => res.status(200).send('Фильм удалён'))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
