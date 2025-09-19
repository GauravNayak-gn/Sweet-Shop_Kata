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

module.exports = { findAllSweets, createSweet };