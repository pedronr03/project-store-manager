const connection = require('./connection');

const getById = async (id) => {
  const query = `SELECT * FROM StoreManager.products
  WHERE id = ?;`;
  const params = [id];
  const [[product]] = await connection.execute(query, params);
  if (!product) return null;
  return product;
};

const getAll = async () => {
  const query = 'SELECT * FROM StoreManager.products';
  const [products] = await connection.execute(query);
  return products;
};

module.exports = {
  getAll,
  getById,
};