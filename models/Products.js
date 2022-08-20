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

const create = async (name) => {
  const query = `INSERT INTO StoreManager.products (name)
  VALUES (?);`;
  const params = [name];
  const [{ insertId }] = await connection.execute(query, params);
  return insertId;
};

const update = async (name, id) => {
  const query = `UPDATE StoreManager.products
  SET name = ?
  WHERE id = ?;`;
  const params = [name, id];
  await connection.execute(query, params);
};

const deleteProduct = async (id) => {
  const query = `DELETE FROM StoreManager.products
  WHERE id = ?;`;
  const params = [id];
  await connection.execute(query, params);
};

const search = async (q) => {
  const query = `SELECT * FROM StoreManager.products
  WHERE name LIKE ?;`;
  const params = [q];
  const [products] = await connection.execute(query, params);
  return products;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
  search,
};