const productsSchema = require('../schemas/productsSchema');
const CustomError = require('../errors/CustomError');

const authNewProduct = (req, _res, next) => {
  const { error } = productsSchema.newProductSchema.validate(req.body);
  if (error.message === '"name" is required') {
    throw new CustomError(400, 'BAD_REQUEST', error.message);
  }
  if (error.message === '"name" length must be at least 5 characters long') {
    throw new CustomError(422, 'UNPROCESSABLE_ENTITY', error.message);
  }
  next();
};

module.exports = authNewProduct;