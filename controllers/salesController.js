const salesService = require('../services/salesService');

const create = async (req, res) => {
  const { body } = req;
  const successSale = await salesService.create(body);
  return res.status(201).json(successSale);
};

const getAll = async (_req, res) => {
  const sales = await salesService.getAll();
  return res.status(200).json(sales);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const sale = await salesService.getById(id);
  return res.status(200).json(sale);
};

module.exports = {
  create,
  getAll,
  getById,
};
