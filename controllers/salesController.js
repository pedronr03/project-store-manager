const salesService = require('../services/salesService');

const create = async (req, res) => {
  const { body } = req;
  const successSale = await salesService.create(body);
  return res.status(201).json(successSale);
};

module.exports = {
  create,
};
