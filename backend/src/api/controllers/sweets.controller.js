const sweetService = require('../services/sweets.service');

const getAllSweets = async (req, res) => {
    try {
        const sweets = await sweetService.findAllSweets();
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addSweet = async (req, res) => {
    try {
        const newSweet = await sweetService.createSweet(req.body);
        res.status(201).json(newSweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllSweets, addSweet };