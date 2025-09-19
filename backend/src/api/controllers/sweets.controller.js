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

const updateSweet = async (req, res) => {
    try {
        const updatedSweet = await sweetService.updateSweetById(req.params.id, req.body);
        if (!updatedSweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(200).json(updatedSweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSweet = async (req, res) => {
    try {
        const wasDeleted = await sweetService.deleteSweetById(req.params.id);
        if (!wasDeleted) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const searchSweets = async (req, res) => {
    try {
        const sweets = await sweetService.findSweetsByCriteria(req.query);
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllSweets, addSweet, updateSweet, deleteSweet, searchSweets };