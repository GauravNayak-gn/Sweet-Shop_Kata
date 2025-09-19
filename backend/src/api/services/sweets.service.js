const db = require("../../config/db");

const findAllSweets = async () => {
  const result = await db.query("SELECT * FROM sweets ORDER BY name ASC");
  return result.rows;
};

const createSweet = async ({ name, category, price, quantity }) => {
  const result = await db.query(
    "INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, category, price, quantity]
  );
  return result.rows[0];
};

const updateSweetById = async (id, sweetData) => {
  const { name, category, price, quantity } = sweetData;
  const result = await db.query(
    "UPDATE sweets SET name = $1, category = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *",
    [name, category, price, quantity, id]
  );
  return result.rows[0]; // Will be undefined if ID not found
};

const deleteSweetById = async (id) => {
  const result = await db.query(
    "DELETE FROM sweets WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rowCount; // Returns 1 if successful, 0 if not found
};

const findSweetsByCriteria = async (criteria) => {
  let query = "SELECT * FROM sweets WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (criteria.name) {
    query += ` AND name ILIKE $${paramIndex++}`;
    params.push(`%${criteria.name}%`);
  }
  if (criteria.category) {
    query += ` AND category ILIKE $${paramIndex++}`;
    params.push(`%${criteria.category}%`);
  }
  if (criteria.minPrice) {
    query += ` AND price >= $${paramIndex++}`;
    params.push(criteria.minPrice);
  }
  if (criteria.maxPrice) {
    query += ` AND price <= $${paramIndex++}`;
    params.push(criteria.maxPrice);
  }

  query += " ORDER BY name ASC"; // Consistent ordering for tests

  const result = await db.query(query, params);
  return result.rows;
};

const findSweetById = async (id) => {
  const result = await db.query("SELECT * FROM sweets WHERE id = $1", [id]);
  return result.rows[0];
};

const purchaseSweet = async (id) => {
  // We use a transaction here to ensure atomicity
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const sweetResult = await client.query(
      "SELECT quantity FROM sweets WHERE id = $1 FOR UPDATE",
      [id]
    );
    const currentQuantity = sweetResult.rows[0].quantity;

    if (currentQuantity <= 0) {
      await client.query("ROLLBACK");
      return null; // Indicates out of stock
    }

    const newQuantity = currentQuantity - 1;
    const updateResult = await client.query(
      "UPDATE sweets SET quantity = $1 WHERE id = $2 RETURNING *",
      [newQuantity, id]
    );
    await client.query("COMMIT");
    return updateResult.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const restockSweet = async (id, amount) => {
  const result = await db.query(
    "UPDATE sweets SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
    [amount, id]
  );
  return result.rows[0];
};

module.exports = {
  findAllSweets,
  createSweet,
  updateSweetById,
  deleteSweetById,
  findSweetsByCriteria,
  findSweetById,
  purchaseSweet,
  restockSweet,
};
