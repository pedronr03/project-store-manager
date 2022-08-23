const { Router } = require('express');
const rescue = require('express-rescue');
const productsController = require('../controllers/productsController');
const authProduct = require('../middlewares/authProduct');

const route = Router();

route.get('/search', rescue(productsController.search));

route.get('/:id', rescue(productsController.getById));

route.put('/:id', rescue(authProduct), rescue(productsController.update));

route.delete('/:id', rescue(productsController.deleteProduct));

route.post('/', rescue(authProduct), rescue(productsController.create));

route.get('/', rescue(productsController.getAll));

module.exports = route;