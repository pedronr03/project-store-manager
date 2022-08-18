const Sales = require('../models/Sales');
const SalesProducts = require('../models/SalesProducts');
const Products = require('../models/Products');
const CustomError = require('../errors/CustomError');

const validateCreate = async (saleItems) => {
  const validateAll = await Promise
    .all(saleItems.map((item) => Products.getById(item.productId)));
  const isValid = validateAll.every(Boolean);
  if (!isValid) return false;
  return true;
};

const create = async (salesItems) => {
  const saleIsValid = await validateCreate(salesItems);
  if (!saleIsValid) throw new CustomError(404, 'NOT_FOUND', 'Product not found');
  const saleId = await Sales.create();
  const successReturn = {
    id: saleId,
    itemsSold: salesItems,
  };
  const newSalesItems = salesItems.map((item) => ({ ...item, saleId }));
  await Promise.all(newSalesItems.map((item) => SalesProducts.create(item)));
  return successReturn;
};

const getAll = async () => {
  const sales = await SalesProducts.getAll();
  return sales;
};

const getById = async (saleId) => {
  const sale = await SalesProducts.getById(saleId);
  if (!sale.length) throw new CustomError(404, 'NOT_FOUND', 'Sale not found');
  return sale;
};

module.exports = {
  create,
  validateCreate,
  getById,
  getAll,
};