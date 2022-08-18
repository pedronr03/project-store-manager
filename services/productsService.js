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

const update = async (name, id) => {
  const product = await Products.getById(id);
  if (!product) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  await Products.update(name, id);
  return {
    name,
    id,
  };
};

const deleteProduct = async (id) => {
  const product = await Products.getById(id);
  if (!product) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  await Products.deleteProduct(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
};