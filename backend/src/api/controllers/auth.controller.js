const authService = require('../services/auth.service');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await authService.registerUser(username, email, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Basic error handling for unique email constraint
        if (error.code === '23505') { 
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.loginUser(email, password);

        if (!token) {
            // To distinguish between not found and wrong password, service can be modified
            // For simplicity, we can check user existence first
            const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
            if (userExists.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const db = require('../../config/db'); 

module.exports = { register, login };