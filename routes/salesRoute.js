const { Router } = require('express');
const salesController = require('../controllers/salesController');
const authSale = require('../middlewares/authSale');

const route = Router();

route.get('/:id', salesController.getById);

route.put('/:id', authSale, salesController.update);

route.post('/', authSale, salesController.create);

route.get('/', salesController.getAll);

module.exports = route;