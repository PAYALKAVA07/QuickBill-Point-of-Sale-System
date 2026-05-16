const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../controllers/authController');

router.post('/', auth.protect, orderController.createOrder);
router.get('/', auth.protect, orderController.listOrders);
router.get('/:id', auth.protect, orderController.getOrder);
router.get('/:id/invoice', auth.protect, orderController.getInvoice);

module.exports = router;
