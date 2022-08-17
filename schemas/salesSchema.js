const joi = require('joi');

const saleItemSchema = joi.object({
  productId: joi.number().required(),
  quantity: joi.number().min(1).required(),
});

module.exports = {
  saleItemSchema,
};