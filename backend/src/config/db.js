const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool, // Export the pool for transactional tests if needed
};