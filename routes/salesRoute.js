const { Router } = require('express');
const rescue = require('express-rescue');
const salesController = require('../controllers/salesController');
const authSale = require('../middlewares/authSale');

const route = Router();

route.get('/:id', rescue(salesController.getById));

route.delete('/:id', rescue(salesController.deleteSale));

route.put('/:id', rescue(authSale), rescue(salesController.update));

route.post('/', rescue(authSale), rescue(salesController.create));

route.get('/', rescue(salesController.getAll));

module.exports = route;