const db = require('../../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async (username, email, password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
        [username, email, passwordHash]
    );
    return newUser.rows[0];
};

module.exports = { registerUser };