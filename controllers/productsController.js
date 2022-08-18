const productsService = require('../services/productsService');

const getAll = async (_req, res) => {
  const products = await productsService.getAll();
  return res.status(200).json(products);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const product = await productsService.getById(id);
  return res.status(200).json(product);
};

const create = async (req, res) => {
  const { name } = req.body;
  const newProduct = await productsService.create(name);
  return res.status(201).json(newProduct);
};

const update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const updatedProduct = await productsService.update(name, id);
  return res.status(200).json(updatedProduct);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
};