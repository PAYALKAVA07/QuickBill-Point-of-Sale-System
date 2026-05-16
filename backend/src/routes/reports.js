const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../controllers/authController');

router.get('/sales', auth.protect, reportController.getSalesReport);
router.get('/inventory', auth.protect, reportController.getInventoryReport);
router.get('/profit', auth.protect, reportController.getProfitReport);
router.get('/tax', auth.protect, reportController.getTaxReport);

module.exports = router;
