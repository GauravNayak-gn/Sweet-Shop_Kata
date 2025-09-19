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

const purchase = async (req, res) => {
    try {
        const sweet = await sweetService.purchaseSweet(req.params.id);
        if (!sweet) {
            // This could be because it's not found or out of stock
            const existingSweet = await sweetService.findSweetById(req.params.id);
            if (!existingSweet) return res.status(404).json({ message: 'Sweet not found' });
            return res.status(400).json({ message: 'Sweet is out of stock' });
        }
        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const restock = async (req, res) => {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid restock amount' });
    }
    try {
        const sweet = await sweetService.restockSweet(req.params.id, amount);
         if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getAllSweets, addSweet, updateSweet, deleteSweet, searchSweets, purchase, restock  };