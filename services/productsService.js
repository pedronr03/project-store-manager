const Products = require('../models/Products');
const CustomError = require('../errors/CustomError');

const getById = async (id) => {
  const product = await Products.getById(id);
  if (!product) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  return product;
};

const getAll = async () => {
  const products = await Products.getAll();
  return products;
};

const create = async (name) => {
  const newProductId = await Products.create(name);
  return { id: newProductId, name };
};

module.exports = {
  getAll,
  getById,
  create,
};