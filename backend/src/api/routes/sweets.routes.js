const express = require('express');
const sweetsController = require('../controllers/sweets.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const router = express.Router();

router.get('/search', protect, sweetsController.searchSweets);
router.get('/', protect, sweetsController.getAllSweets);
router.post('/', protect, isAdmin, sweetsController.addSweet);
router.put('/:id', protect, isAdmin, sweetsController.updateSweet);
router.delete('/:id', protect, isAdmin, sweetsController.deleteSweet);
router.post('/:id/purchase', protect, sweetsController.purchase);
router.post('/:id/restock', protect, isAdmin, sweetsController.restock);

module.exports = router;