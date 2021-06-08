const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');
const { validateId, validateMovie } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie); // вторым аргументом передаем middleware для валидации приходящих данных до обращения к бд
router.delete('/movies/:movieId', validateId, deleteMovie);

module.exports = router;
