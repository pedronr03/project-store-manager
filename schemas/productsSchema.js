const joi = require('joi');

const productNameSchema = joi.string().min(5).required();

const newProductSchema = joi.object().keys({
  name: productNameSchema,
});

module.exports = {
  newProductSchema,
};