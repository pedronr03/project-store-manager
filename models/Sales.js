const connection = require('./connection');

const create = async () => {
  const query = `INSERT INTO StoreManager.sales ()
  VALUES ();`;
  const [{ insertId }] = await connection.execute(query);
  return insertId;
};

const deleteSale = async (id) => {
  const query = `DELETE FROM StoreManager.sales
  WHERE id = ?;`;
  const params = [id];
  await connection.execute(query, params);
};

module.exports = {
  create,
  deleteSale,
};