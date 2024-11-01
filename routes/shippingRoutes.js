const express = require('express');
const router = express.Router();
const { getShippingRates, createShipment } = require('../controllers/shippingController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/rates', authenticateToken, getShippingRates);
router.post('/create', authenticateToken, createShipment);

module.exports = router;