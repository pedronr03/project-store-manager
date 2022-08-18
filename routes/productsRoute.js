const { Router } = require('express');
const productsController = require('../controllers/productsController');
const authProduct = require('../middlewares/authProduct');

const route = Router();

route.get('/:id', productsController.getById);

route.put('/:id', authProduct, productsController.update);

route.delete('/:id', productsController.deleteProduct);

route.post('/', authProduct, productsController.create);

route.get('/', productsController.getAll);

module.exports = route;