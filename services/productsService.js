const Products = require('../models/Products');
const CustomError = require('../errors/CustomError');

const getById = async (saleId) => {
  const product = await Products.getById(saleId);
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

const update = async (name, saleId) => {
  const product = await Products.getById(saleId);
  if (!product) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  await Products.update(name, saleId);
  return {
    name,
    id: saleId,
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
};