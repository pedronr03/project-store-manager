const Sales = require('../models/Sales');
const SalesProducts = require('../models/SalesProducts');
const Products = require('../models/Products');
const CustomError = require('../errors/CustomError');

const validateProducts = async (saleItems) => {
  const validateAll = await Promise
    .all(saleItems.map((item) => Products.getById(item.productId)));
  const isValid = validateAll.every(Boolean);
  if (!isValid) return false;
  return true;
};

const deleteSale = async (saleId) => {
  const saleIsValid = await SalesProducts.getById(saleId);
  if (!saleIsValid.length) throw new CustomError(404, 'NOT_FOUND', 'Sale not found');
  await Sales.deleteSale(saleId);
};

const create = async (salesItems) => {
  const productsAreValid = await validateProducts(salesItems);
  if (!productsAreValid) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  const saleId = await Sales.create();
  const successReturn = {
    id: saleId,
    itemsSold: salesItems,
  };
  const newSalesItems = salesItems.map((item) => ({ ...item, saleId }));
  await Promise.all(newSalesItems.map((item) => SalesProducts.create(item)));
  return successReturn;
};

const update = async (saleId, salesItems) => {
  const saleIsValid = await SalesProducts.getById(saleId);
  if (!saleIsValid.length) throw new CustomError(404, 'NOT_FOUND', 'Sale not found');
  const productsAreValid = await validateProducts(salesItems);
  if (!productsAreValid) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  await SalesProducts.deleteBySaleId(saleId);
  const successReturn = {
    saleId,
    itemsUpdated: salesItems,
  };
  const newSalesItems = salesItems.map((item) => ({ ...item, saleId }));
  await Promise.all(newSalesItems.map((item) => SalesProducts.create(item)));
  return successReturn;
};

const getAll = async () => {
  const sales = await SalesProducts.getAll();
  return sales;
};

const getById = async (id) => {
  const sale = await SalesProducts.getById(id);
  if (!sale.length) throw new CustomError(404, 'NOT_FOUND', 'Sale not found');
  return sale;
};

module.exports = {
  create,
  validateProducts,
  getById,
  getAll,
  update,
  deleteSale,
};