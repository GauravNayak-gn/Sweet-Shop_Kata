const express = require('express');
const sweetsController = require('../controllers/sweets.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const router = express.Router();

router.get('/', protect, sweetsController.getAllSweets);
router.post('/', protect, isAdmin, sweetsController.addSweet);
router.put('/:id', protect, isAdmin, sweetsController.updateSweet);

module.exports = router;