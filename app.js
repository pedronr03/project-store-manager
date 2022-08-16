require('dotenv').config();
require('express-async-errors');
const express = require('express');

const errorMiddleware = require('./middlewares/errorMiddleware');
const productsRoute = require('./routes/productsRoute');

const app = express();

app.use(express.json());

app.use('/products', productsRoute);

app.get('/', (_request, response) => {
  response.send();
});

app.use(errorMiddleware);

module.exports = app;