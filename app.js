const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movie');
const { createUser, login } = require('./controllers/users');
const { validateSignUp, validateSignIn } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateSignIn, login); // вторым аргументом передаем middleware для валидации приходящих данных до обращения к бд
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);
app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
  next();
});
app.listen(PORT);
