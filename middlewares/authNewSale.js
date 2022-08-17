const salesSchema = require('../schemas/salesSchema');
const CustomError = require('../errors/CustomError');

const authNewSale = async (req, _res, next) => {
  const { body } = req;
  const errorMessage = body.map((productItem) => {
    const { error } = salesSchema.saleItemSchema.validate(productItem);
    return error && error.message;
  }).filter(Boolean)[0];
  switch (errorMessage) {
    case '"productId" is required':
      throw new CustomError(400, 'BAD_REQUEST', errorMessage);
    case '"quantity" is required':
      throw new CustomError(400, 'BAD_REQUEST', errorMessage);
    case '"quantity" must be greater than or equal to 1':
      throw new CustomError(422, 'UNPROCESSABLE_ENTITY', errorMessage);
    default:
      next();
  }
};

module.exports = authNewSale;