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

module.exports = { register };