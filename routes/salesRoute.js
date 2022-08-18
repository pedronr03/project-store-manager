const { Router } = require('express');
const salesController = require('../controllers/salesController');
const authNewSale = require('../middlewares/authNewSale');

const route = Router();

route.post('/', authNewSale, salesController.create);
route.get('/:id', salesController.getById);
route.get('/', salesController.getAll);

module.exports = route;