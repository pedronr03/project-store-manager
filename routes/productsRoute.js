const { Router } = require('express');
const productsController = require('../controllers/productsController');
const authNewProduct = require('../middlewares/authNewProduct');

const route = Router();

route.post('/', authNewProduct, productsController.create);

route.get('/', productsController.getAll);

route.get('/:id', productsController.getById);

module.exports = route;