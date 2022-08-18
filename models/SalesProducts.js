const connection = require('./connection');

const create = async ({ productId, quantity, saleId }) => {
  const query = `INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
  VALUES (?, ?, ?);`;
  const params = [saleId, productId, quantity];
  const [{ insertId }] = await connection.execute(query, params);
  return insertId;
};

const getAll = async () => {
  const query = `SELECT S.id saleId, S.date, SP.quantity, SP.product_id productId  FROM sales S
  JOIN sales_products SP
  ON S.id = SP.sale_id;`;
  const [sales] = await connection.execute(query);
  return sales;
};

const getById = async (saleId) => {
  const query = `SELECT SP.product_id productId, S.date, SP.quantity FROM sales S
  JOIN sales_products SP
  ON S.id = SP.sale_id
  WHERE SP.sale_id = ?;`;
  const params = [saleId];
  const [sale] = await connection.execute(query, params);
  return sale;
};

module.exports = {
  create,
  getAll,
  getById,
};