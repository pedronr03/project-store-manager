const connection = require('./connection');

const create = async ({ productId, quantity, saleId }) => {
  const query = `INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
  VALUES (?, ?, ?);`;
  const params = [saleId, productId, quantity];
  await connection.execute(query, params);
};

module.exports = {
  create,
};