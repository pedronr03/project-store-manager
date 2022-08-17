const joi = require('joi');

const newProductSchema = joi.object({
  name: joi.string().min(5).required(),
});

module.exports = {
  newProductSchema,
};