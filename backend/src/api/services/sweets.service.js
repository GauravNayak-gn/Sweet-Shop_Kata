const db = require('../../config/db');

const findAllSweets = async () => {
    const result = await db.query('SELECT * FROM sweets ORDER BY name ASC');
    return result.rows;
};

const createSweet = async ({ name, category, price, quantity }) => {
    const result = await db.query(
        'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, category, price, quantity]
    );
    return result.rows[0];
};

const updateSweetById = async (id, sweetData) => {
    const { name, category, price, quantity } = sweetData;
    const result = await db.query(
        'UPDATE sweets SET name = $1, category = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
        [name, category, price, quantity, id]
    );
    return result.rows[0]; // Will be undefined if ID not found
};

module.exports = { findAllSweets, createSweet, updateSweetById };