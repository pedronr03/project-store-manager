const productsSchema = require('../schemas/productsSchema');
const CustomError = require('../errors/CustomError');

const authNewProduct = (req, _res, next) => {
  const { error } = productsSchema.newProductSchema.validate(req.body);
  const errorMessage = error && error.message;
  switch (errorMessage) {
    case '"name" is required':
      throw new CustomError(400, 'BAD_REQUEST', errorMessage);
    case '"name" length must be at least 5 characters long':
      throw new CustomError(422, 'UNPROCESSABLE_ENTITY', errorMessage);
    default:
      next();
  }
};

module.exports = authNewProduct;